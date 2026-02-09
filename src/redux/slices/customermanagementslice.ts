import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

/* ------------------ TYPES ------------------ */

export interface CustomerItem {
  id: number;
  full_name: string | null;
  email: string;
  phone_number: string | null;
  gender: string | null;
  dob: string | null;
  is_active: boolean;
  user_role: number;
}

interface Pagination {
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

interface CustomerState {
  data: CustomerItem[];
  pagination: Pagination | null;
  isLoading: boolean;
  success: boolean | null;
  message: string | null;
  statusCode: number | null;
  error: string | null;
}

export interface UpdateStatusResponse {
  status?: number;
  message?: string;
}
/* ------------------ INITIAL STATE ------------------ */

const initialState: CustomerState = {
  data: [],
  pagination: null,
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

// Get all customers
export const getAllCustomers = createApiThunk('customer/getAllCustomers', ({ page, page_size, search }: { page: number; page_size: number; search?: string }) =>
  axiosInstance.get('/customers', {
    params: {
      page,
      page_size,
      ...(search ? { search } : {}),
    },
  }),
);

// Update customer status (active/inactive)
export const updateCustomerStatus = createApiThunk('customer/updateStatus', ({ id, is_active }: { id: number; is_active: boolean }) =>
  axiosInstance.patch(`/customer-update-status/${id}`, {
    is_active,
  }),
);

// Slice
const customerManagementSlice = createSlice({
  name: 'customerManagement',
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
    const handlePending = (state: CustomerState) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
      state.message = null;
      state.statusCode = null;
    };

    const handleRejected = (state: CustomerState, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload || 'An error occurred';
      state.success = false;
      state.message = action.payload?.message || null;
      state.statusCode = action.payload?.statusCode || null;
    };

    const handleFulfilled = (state: CustomerState, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = null;
      state.data = action.payload.data || [];
      state.pagination = action.payload?.pagination || null;
      state.success = true;
      state.message = action.payload?.message || null;
      state.statusCode = action.payload?.statusCode || null;
    };

    // Get all customers handlers
    [getAllCustomers].forEach((thunk) => {
      builder.addCase(thunk.pending, handlePending);
      builder.addCase(thunk.fulfilled, handleFulfilled);
      builder.addCase(thunk.rejected, handleRejected);
    });
  },
});

/* ------------------ EXPORTS ------------------ */

export const { clearError, clearSuccess } = customerManagementSlice.actions;

export default customerManagementSlice.reducer;
