import { createContext, useReducer, useEffect, ReactNode } from 'react';
import axiosInstance from '../utils/axios';
import { AxiosResponse, AxiosError } from 'axios';

/* =========================
   Types & Interfaces
========================= */

interface User {
  id: string;
  email: string;
  name?: string;
  [key: string]: string | number | undefined;
}

interface AuthState {
  user: User | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  method: 'JWT';
  login: (email: string, password: string) => Promise<AxiosResponse>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<AxiosResponse>;
  forgotPassword: (email: string) => Promise<AxiosResponse>;
  registerRestaurant: (email: string) => Promise<AxiosResponse>;
  verifyOtp: (payload: { email: string; otp: string }) => Promise<AxiosResponse>;
  resendOtp: (email: string) => Promise<AxiosResponse>;
  resetPassword: (data: object) => Promise<AxiosResponse>;
  initialize: () => Promise<void>;
}

/* =========================
   Initial State
========================= */

const initialAuthState: AuthState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false,
};

/* =========================
   Reducer
========================= */

type AuthAction = { type: 'INITIALIZE'; payload: { user: User | null } } | { type: 'LOGIN'; payload: { user: User } } | { type: 'LOGOUT' };

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        isInitialized: true,
        isAuthenticated: !!action.payload.user,
        user: action.payload.user,
      };

    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    default:
      return state;
  }
};

/* =========================
   Context
========================= */

const AuthContext = createContext<AuthContextType>({
  ...initialAuthState,
  method: 'JWT',
  login: async () => Promise.reject(),
  logout: () => {},
  changePassword: async () => Promise.reject(),
  forgotPassword: async () => Promise.reject(),
  registerRestaurant: async () => Promise.reject(),
  verifyOtp: async () => Promise.reject(),
  resendOtp: async () => Promise.reject(),
  resetPassword: async () => Promise.reject(),
  initialize: async () => {},
});

/* =========================
   Provider
========================= */

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  useEffect(() => {
    initialize();
  }, []);

  /* =========================
     Initialize
  ========================= */

  const initialize = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      dispatch({ type: 'INITIALIZE', payload: { user: null } });
      return;
    }

    try {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axiosInstance.get('/get-profile');

      dispatch({
        type: 'INITIALIZE',
        payload: { user: response.data },
      });
    } catch (error) {
      console.error('Initialization failed:', error);
      logout();
      throw error; // ✅ propagate if needed
    }
  };

  /* =========================
     Auth APIs
  ========================= */

  const login = async (email: string, password: string): Promise<AxiosResponse> => {
    try {
      const response = await axiosInstance.post('/login', { email, password });

      const token = response.data.tokens?.access;
      if (token) {
        localStorage.setItem('accessToken', token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      dispatch({ type: 'LOGIN', payload: { user: response.data.user } });
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<AxiosResponse> => {
    try {
      const response = await axiosInstance.post('/change-password', {
        oldPassword,
        newPassword,
      });
      return response;
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  };

  const forgotPassword = async (email: string): Promise<AxiosResponse> => {
    try {
      const response = await axiosInstance.post('/forgetpassword-mail', { email });
      return response;
    } catch (error) {
      console.error('Forgot password request failed:', error);
      throw error;
    }
  };

  /* =========================
     Restaurant OTP Flow
  ========================= */

  const registerRestaurant = async (email: string): Promise<AxiosResponse> => {
    try {
      const response = await axiosInstance.post('/restaurant-user/', { email });
      return response;
    } catch (error) {
      console.error('Restaurant registration failed:', error);
      throw error; // ✅ REQUIRED
    }
  };

  const verifyOtp = async (payload: { email: string; otp: string }): Promise<AxiosResponse> => {
    try {
      const response = await axiosInstance.post('/otp-verification', payload);
      return response;
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    }
  };

  const resendOtp = async (email: string): Promise<AxiosResponse> => {
    try {
      const response = await axiosInstance.post('/resend-otp', { email });
      return response;
    } catch (error) {
      console.error('Resend OTP failed:', error);
      throw error;
    }
  };

  const resetPassword = async (data: object): Promise<AxiosResponse> => {
    try {
      const response = await axiosInstance.post('/reset-password', data);
      return response;
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  };

  /* =========================
     Provider Value
  ========================= */

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        logout,
        changePassword,
        forgotPassword,
        registerRestaurant,
        verifyOtp,
        resendOtp,
        resetPassword,
        initialize,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
