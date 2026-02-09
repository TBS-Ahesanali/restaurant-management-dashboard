import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

/* ------------------ TYPES ------------------ */

export interface DashboardData {
  customer_count: number;
  restaurant_approved_count: number;
  restaurant_pending_count: number;
}

interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  success: boolean | null;
  message: string | null;
  statusCode: number | null;
  error: string | null;
}

/* ------------------ INITIAL STATE ------------------ */

const initialState: DashboardState = {
  data: null,
  isLoading: false,
  success: null,
  message: null,
  statusCode: null,
  error: null,
};

// Generic API thunk returning full Axios response
export function createApiThunk<T = any, U = void>(type: string, apiCall: (arg: U) => Promise<T>) {
  return createAsyncThunk<T, U>(type, async (arg: U, { rejectWithValue }) => {
    try {
      const response = await apiCall(arg);
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.data?.message || error?.response?.data?.data?.error || error?.message || 'Something went wrong';
      console.error(`${type} error:`, errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  });
}

// ----------- API THUNKS -----------

// Get dashboard counts
export const getDashboardCounts = createApiThunk('dashboard/getDashboardCounts', () => axiosInstance.get('/dashboard'));

// Slice
const dashboardManagementSlice = createSlice({
  name: 'dashboardManagement',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: DashboardState) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
      state.message = null;
      state.statusCode = null;
    };

    const handleRejected = (state: DashboardState, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload || 'An error occurred';
      state.success = false;
      state.message = action.payload?.message || null;
      state.statusCode = action.payload?.statusCode || null;
    };

    const handleFulfilled = (state: DashboardState, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = null;
      state.data = action.payload?.data || null;
      state.success = true;
      state.message = action.payload?.message || null;
      state.statusCode = action.payload?.statusCode || null;
    };

    // Get dashboard counts handlers
    builder.addCase(getDashboardCounts.pending, handlePending).addCase(getDashboardCounts.fulfilled, handleFulfilled).addCase(getDashboardCounts.rejected, handleRejected);
  },
});

/* ------------------ EXPORTS ------------------ */

export const { clearError, clearSuccess } = dashboardManagementSlice.actions;

export default dashboardManagementSlice.reducer;
