import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { axiosFileInstance } from '../../utils/axios';
import { AppDispatch } from '../store';

interface UserProfileData {
  id?: number;
  name?: string;
  email?: string;
  avatar?: string;
  [key: string]: unknown;
}

interface SuccessPayload {
  message: string;
  status: number;
  data?: UserProfileData;
}

interface ErrorResponse {
  message?: string;
}

interface UserProfileState {
  data: UserProfileData | null;
  isLoading: boolean;
  error: string | null;
  success: SuccessPayload | null;
}

const initialState: UserProfileState = {
  data: null,
  isLoading: false,
  error: null,
  success: null,
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    updateUserProfileRequest(state) {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    updateUserProfileSuccess(state, action: PayloadAction<SuccessPayload>) {
      state.isLoading = false;
      state.data = { ...state.data, ...action.payload.data };
      state.success = action.payload;
    },
    updateUserProfileFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
      state.success = null;
    },
    changePasswordRequest(state) {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    changePasswordSuccess(state, action: PayloadAction<SuccessPayload>) {
      state.isLoading = false;
      state.success = action.payload;
    },
    changePasswordFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
      state.success = null;
    },
    resetUserProfileState(state) {
      state.isLoading = false;
      state.error = null;
      state.success = null;
    },
  },
});

export const {
  updateUserProfileRequest,
  updateUserProfileSuccess,
  updateUserProfileFailure,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
  resetUserProfileState,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ErrorResponse | undefined;
    return errorData?.message || error.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Update User Profile Thunk
export const updateUserProfile =
  (data: FormData) =>
  async (dispatch: AppDispatch): Promise<SuccessPayload | undefined> => {
    dispatch(updateUserProfileRequest());
    try {
      const response = await axiosFileInstance.patch<SuccessPayload>('/update-profile', data);
      dispatch(updateUserProfileSuccess(response.data));
      return response.data;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      dispatch(updateUserProfileFailure(errorMessage));
      throw error;
    }
  };

// Change User Password Thunk
export const changeUserPassword =
  (data: { old_password: string; new_password: string; confirm_password: string }) =>
  async (dispatch: AppDispatch): Promise<SuccessPayload> => {
    dispatch(changePasswordRequest());
    try {
      const response = await axiosFileInstance.post<SuccessPayload>('/change-password', data);
      dispatch(changePasswordSuccess(response.data));
      return response.data;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      dispatch(changePasswordFailure(errorMessage));

      // Return error response in the same format for consistency
      if (error instanceof AxiosError && error.response) {
        const errorData = error.response.data as ErrorResponse | undefined;
        return {
          message: errorData?.message || errorMessage,
          status: error.response.status,
        };
      }

      return {
        message: errorMessage,
        status: 500,
      };
    }
  };
