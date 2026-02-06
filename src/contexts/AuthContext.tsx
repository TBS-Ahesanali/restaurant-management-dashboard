import { createContext, useReducer, useEffect, ReactNode } from 'react';
import axiosInstance, { axiosFileInstance } from '../utils/axios';
import { AxiosResponse } from 'axios';

/* =========================
   Types & Interfaces
========================= */

interface User {
  id: string;
  email: string;
  name?: string;
  [key: string]: string | number | undefined;
}

interface Restaurant {
  id: number;
  restaurant_name: string;
  address: string;
  owner_full_name?: string;
  owner_email?: string;
  owner_phone_number?: number;
  whatsapp_number?: number;
  pan_number?: string;
  gstin?: string;
  fssai?: string;
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  is_step1: boolean;
  is_step2: boolean;
  is_step3: boolean;
  is_step4: boolean;
  status: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  restaurant: Restaurant | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  isRestaurantLoaded: boolean;
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
  fetchRestaurantData: (token: any) => Promise<any>;
  createOrUpdateRestaurant: (token: string, payload: any) => Promise<any>;
  clearRestaurant: () => void;
}

/* =========================
   Initial State
========================= */

const initialAuthState: AuthState = {
  user: null,
  restaurant: null,
  isInitialized: false,
  isAuthenticated: false,
  isRestaurantLoaded: false,
};

/* =========================
   Reducer
========================= */

type AuthAction =
  | { type: 'INITIALIZE'; payload: { user: User | null } }
  | { type: 'LOGIN'; payload: { user: User } }
  | { type: 'LOGOUT' }
  | { type: 'SET_RESTAURANT'; payload: { restaurant: Restaurant | null } }
  | { type: 'RESTAURANT_FETCH_START' }
  | { type: 'RESTAURANT_FETCH_END' }
  | { type: 'CLEAR_RESTAURANT' };

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
        restaurant: null,
      };
    case 'SET_RESTAURANT':
      return {
        ...state,
        restaurant: action.payload.restaurant,
        isRestaurantLoaded: false,
      };
    case 'RESTAURANT_FETCH_START':
      return {
        ...state,
        isRestaurantLoaded: true,
      };

    case 'RESTAURANT_FETCH_END':
      return {
        ...state,
        isRestaurantLoaded: false,
      };

    case 'CLEAR_RESTAURANT':
      return {
        ...state,
        restaurant: null,
        isRestaurantLoaded: false,
      };
    default:
      return state;
  }
};

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
  fetchRestaurantData: async () => Promise.reject(),
  createOrUpdateRestaurant: async () => Promise.reject(),
  clearRestaurant: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  useEffect(() => {
    initialize();
  }, []);

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
    }
  };

  const fetchRestaurantData = async (token: any) => {
    dispatch({ type: 'RESTAURANT_FETCH_START' });
    try {
      if (!token) {
        return;
      }

      const response = await axiosInstance.get('/get-restaurant', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('response: ', response);

      if (response.data) {
        console.log('aah');
        dispatch({
          type: 'SET_RESTAURANT',
          payload: { restaurant: response.data },
        });
      }
    } catch (error: any) {
      console.log('No restaurant data found:', error?.response?.message || error.message);
      dispatch({ type: 'RESTAURANT_FETCH_END' });
    }
  };

  const createOrUpdateRestaurant = async (token: string, payload: any) => {
    try {
      const response = await axiosFileInstance.post('/restaurant-creation', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        await fetchRestaurantData(token);
      }
      return response;
    } catch (error) {
      console.error('Restaurant create/update failed:', error);
      throw error;
    }
  };

  const clearRestaurant = () => {
    dispatch({ type: 'CLEAR_RESTAURANT' });
  };

  const login = async (email: string, password: string): Promise<AxiosResponse> => {
    try {
      const response = await axiosInstance.post('/login', { email, password });

      const token = response.data.tokens?.access;
      if (token) {
        localStorage.setItem('accessToken', token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      dispatch({ type: 'LOGIN', payload: { user: response.data.user } });
      await initialize();
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

  const registerRestaurant = async (email: string): Promise<AxiosResponse> => {
    try {
      const response = await axiosInstance.post('/restaurant-user/', { email });
      return response;
    } catch (error) {
      console.error('Restaurant registration failed:', error);
      throw error;
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
        fetchRestaurantData,
        clearRestaurant,
        createOrUpdateRestaurant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
