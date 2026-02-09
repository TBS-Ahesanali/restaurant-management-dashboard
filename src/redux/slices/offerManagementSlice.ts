import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

/* ------------------ TYPES ------------------ */

export interface RestaurantOffer {
  id: number;
  title: string;
  discount_type: 'percent' | 'flat';
  discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StatusResponse {
  status?: number;
  result?: string;
  message?: string;
}

interface RestaurantOfferState {
  offers: RestaurantOffer[];
  currentOffer: RestaurantOffer | null;
  isLoading: boolean;
  success: boolean | null;
  message: string | null;
  error: string | null;
}

export interface AddOfferPayload {
  title: string;
  discount_type: 'percent' | 'flat';
  discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface UpdateOfferPayload extends AddOfferPayload {
  id: number;
}

/* ------------------ INITIAL STATE ------------------ */

const initialState: RestaurantOfferState = {
  offers: [],
  currentOffer: null,
  isLoading: false,
  success: null,
  message: null,
  error: null,
};

/* ------------------ HELPER FUNCTION ------------------ */

// Generic API thunk returning full Axios response
export function createApiThunk<T = any, U = void>(type: string, apiCall: (arg: U) => Promise<T>) {
  return createAsyncThunk<T, U>(type, async (arg: U, { rejectWithValue }) => {
    try {
      const response = await apiCall(arg);
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.data?.message || error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Something went wrong';
      console.error(`${type} error:`, errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  });
}

/* ------------------ API THUNKS ------------------ */

// Get all restaurant offers
export const getRestaurantOffers = createApiThunk('restaurantOffer/getAll', () => axiosInstance.get('/restaurant-offer'));

// Get restaurant offer by ID
export const getRestaurantOfferById = createApiThunk('restaurantOffer/getById', (id: number) => axiosInstance.get(`/restaurant-offer/${id}`));

// Add new restaurant offer
export const addRestaurantOffer = createApiThunk('restaurantOffer/add', (payload: AddOfferPayload) => axiosInstance.post('/restaurant-offer', payload));

// Update restaurant offer
export const updateRestaurantOffer = createApiThunk('restaurantOffer/update', ({ id, ...payload }: UpdateOfferPayload) => axiosInstance.patch(`/restaurant-offer/${id}`, payload));

// Delete restaurant offer
export const deleteRestaurantOffer = createApiThunk('restaurantOffer/delete', (id: number) => axiosInstance.delete(`/restaurant-offer/${id}`));

/* ------------------ SLICE ------------------ */

const offerManagementSlice = createSlice({
  name: 'offerManagement',
  initialState,
  reducers: {
    clearOfferState: (state) => {
      state.success = null;
      state.message = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setCurrentOffer: (state, action: PayloadAction<RestaurantOffer | null>) => {
      state.currentOffer = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* ------------------ GET ALL OFFERS ------------------ */
    builder
      .addCase(getRestaurantOffers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRestaurantOffers.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.offers = action.payload?.data || action.payload || [];
        state.success = true;
      })
      .addCase(getRestaurantOffers.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch offers';
        state.success = false;
      });

    /* ------------------ GET OFFER BY ID ------------------ */
    builder
      .addCase(getRestaurantOfferById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRestaurantOfferById.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.currentOffer = action.payload?.data || action.payload;
        state.success = true;
      })
      .addCase(getRestaurantOfferById.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch offer';
        state.success = false;
      });

    /* ------------------ ADD OFFER ------------------ */
    builder
      .addCase(addRestaurantOffer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addRestaurantOffer.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload?.message || 'Offer added successfully';
      })
      .addCase(addRestaurantOffer.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add offer';
        state.success = false;
      });

    /* ------------------ UPDATE OFFER ------------------ */
    builder
      .addCase(updateRestaurantOffer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateRestaurantOffer.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload?.message || 'Offer updated successfully';
      })
      .addCase(updateRestaurantOffer.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update offer';
        state.success = false;
      });

    /* ------------------ DELETE OFFER ------------------ */
    builder
      .addCase(deleteRestaurantOffer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteRestaurantOffer.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.success = true;
        state.message = action.payload?.message || 'Offer deleted successfully';
      })
      .addCase(deleteRestaurantOffer.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete offer';
        state.success = false;
      });
  },
});

/* ------------------ EXPORTS ------------------ */

export const { clearOfferState, clearError, clearSuccess, setCurrentOffer } = offerManagementSlice.actions;

export default offerManagementSlice.reducer;
