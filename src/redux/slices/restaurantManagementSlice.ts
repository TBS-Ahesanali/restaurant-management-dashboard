import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

/* ------------------ TYPES ------------------ */

export interface MenuItemImage {
  id: number;
  image: string;
  uploaded_at: string;
  menu_item: number;
}

export interface MenuItem {
  id: number;
  images: MenuItemImage[];
  item_name: string;
  price: string;
  description: string;
  gst: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestaurantItem {
  id: number;
  restaurant_name: string;
  email: string;
  description: string;
  logo: string | null;
  longitude: string;
  latitude: string;
  address: string;
  pan_number: string;
  gstin: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  is_contract_partner: boolean;
  status: string;
  rejection_reason: string;
  created_at: string;
  updated_at: string;
  owner: number;
  menu_items: MenuItem[];
}

interface Pagination {
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

interface RestaurantState {
  data: RestaurantItem[];
  pagination: Pagination | null;
  isLoading: boolean;
  success: boolean | null;
  message: string | null;
  statusCode: number | null;
  error: string | null;
  updateLoading: boolean;
}

export interface UpdateStatusPayload {
  id: number;
  status: 'Approved' | 'Rejected';
  rejection_reason?: string;
}
export interface UpdateStatusResponse {
  status?: number;
  message?: string;
}

/* ------------------ INITIAL STATE ------------------ */

const initialState: RestaurantState = {
  data: [],
  pagination: null,
  isLoading: false,
  success: null,
  message: null,
  statusCode: null,
  error: null,
  updateLoading: false,
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

// Get all restaurants
export const getAllRestaurants = createApiThunk(
  'restaurant/getAllRestaurants',
  ({ page_number, page_size, search, status }: { page_number: number; page_size: number; search?: string; status?: string }) =>
    axiosInstance.post('/get-restaurants-list/', {
      page_number,
      page_size,
      ...(search ? { search } : {}),
      ...(status ? { status } : {}),
    }),
);

// Update restaurant status
export const updateRestaurantStatus = createApiThunk('restaurant/updateStatus', ({ id, status, rejection_reason }: UpdateStatusPayload) => {
  const payload: any = { status };

  // Only add rejection_reason if status is Rejected
  if (status === 'Rejected' && rejection_reason) {
    payload.rejection_reason = rejection_reason;
  }

  return axiosInstance.patch(`/restaurant-update-status/${id}`, payload);
});

// Slice
const restaurantManagementSlice = createSlice({
  name: 'restaurantManagement',
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
    const handlePending = (state: RestaurantState) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
      state.message = null;
      state.statusCode = null;
    };

    const handleRejected = (state: RestaurantState, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload || 'An error occurred';
      state.success = false;
      state.message = action.payload?.message || null;
      state.statusCode = action.payload?.statusCode || null;
    };

    const handleFulfilled = (state: RestaurantState, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = null;
      state.data = action.payload.data || [];
      state.pagination = action.payload?.pagination || null;
      state.success = true;
      state.message = action.payload?.message || null;
      state.statusCode = action.payload?.statusCode || null;
    };

    // Get all restaurants handlers
    [getAllRestaurants].forEach((thunk) => {
      builder.addCase(thunk.pending, handlePending);
      builder.addCase(thunk.fulfilled, handleFulfilled);
      builder.addCase(thunk.rejected, handleRejected);
    });
  },
});

/* ------------------ EXPORTS ------------------ */

export const { clearError, clearSuccess } = restaurantManagementSlice.actions;

export default restaurantManagementSlice.reducer;
