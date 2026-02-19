import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

/* ------------------ TYPES ------------------ */

export type OrderStatus = 'pending' | 'payment_pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface MenuItemVariation {
  id: number;
  variant: number;
  variant_name: string;
  variant_price: string;
}

export interface OrderMenuItem {
  id: number;
  order: number;
  menu_item: number;
  menu_item_name: string;
  variations: MenuItemVariation[];
  modifiers: any[];
}

export interface OrderPricing {
  items_subtotal: string;
  items_gst: string;
  items_total: string;
  delivery_fee: string;
  platform_fee: string;
  packaging_fee: string;
  discount: string;
  grand_total: string;
}

export interface OrderItem {
  id: number;
  restaurant_id: number;
  extra_note?: string;
  status: OrderStatus;
  total_amount: string;
  menu_item: OrderMenuItem[];
  pricing: OrderPricing;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItemDetail {
  id: number;
  item_name: string;
  quantity: number;
  price: string;
  total: string;
}

interface Pagination {
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

interface OrderState {
  data: OrderItem[];
  selectedOrder: OrderItem | null;
  pagination: Pagination | null;
  isLoading: boolean;
  success: boolean | null;
  message: string | null;
  statusCode: number | null;
  error: string | null;
  updateLoading: boolean;
}

export interface GetOrdersPayload {
  page_number: number;
  page_size: number;
  restaurant_id?: number;
  search?: string;
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
}

export interface UpdateOrderStatusPayload {
  id: number;
  status: OrderStatus;
  notes?: string;
}

export interface UpdateStatusResponse {
  status?: number;
  message?: string;
}

/* ------------------ INITIAL STATE ------------------ */

const initialState: OrderState = {
  data: [],
  selectedOrder: null,
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

// Get all orders
export const getAllOrders = createApiThunk(
  'orders/getAllOrders',
  ({ page_number, page_size, restaurant_id, search, status, payment_status, date_from, date_to }: GetOrdersPayload) => {
    const params = new URLSearchParams();
    params.append('page_number', String(page_number));
    params.append('page_size', String(page_size));
    if (restaurant_id) params.append('restaurant_id', String(restaurant_id));
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (payment_status) params.append('payment_status', payment_status);
    if (date_from) params.append('date_from', date_from);
    if (date_to) params.append('date_to', date_to);
    return axiosInstance.get(`/restaurant-order?${params.toString()}`);
  },
);

// Get order details
export const getOrderDetails = createApiThunk('orders/getOrderDetails', (id: number) => axiosInstance.get(`/orders/${id}`));

// Update order status
export const updateOrderStatus = createApiThunk('orders/updateStatus', ({ id, status, notes }: UpdateOrderStatusPayload) =>
  axiosInstance.patch(`/orders/${id}/status`, { status, ...(notes ? { notes } : {}) }),
);

// Cancel order
export const cancelOrder = createApiThunk('orders/cancelOrder', (id: number) => axiosInstance.post(`/orders/${id}/cancel`));

// Slice
const orderManagementSlice = createSlice({
  name: 'orderManagement',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setSelectedOrder: (state, action: PayloadAction<OrderItem | null>) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: OrderState) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
      state.message = null;
      state.statusCode = null;
    };

    const handleUpdatePending = (state: OrderState) => {
      state.updateLoading = true;
      state.error = null;
    };

    const handleRejected = (state: OrderState, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.updateLoading = false;
      state.error = action.payload || 'An error occurred';
      state.success = false;
      state.message = action.payload?.message || null;
      state.statusCode = action.payload?.statusCode || null;
    };

    const handleFulfilled = (state: OrderState, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.updateLoading = false;
      state.error = null;
      state.data = action.payload.data || [];
      state.pagination = action.payload?.pagination || null;
      state.success = true;
      state.message = action.payload?.message || null;
      state.statusCode = action.payload?.statusCode || null;
    };

    const handleGetDetailsFulfilled = (state: OrderState, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.updateLoading = false;
      state.error = null;
      state.selectedOrder = action.payload.data || null;
      state.success = true;
      state.message = action.payload?.message || null;
      state.statusCode = action.payload?.statusCode || null;
    };

    const handleUpdateFulfilled = (state: OrderState, action: PayloadAction<any>) => {
      state.updateLoading = false;
      state.error = null;
      state.success = true;
      state.message = action.payload?.message || null;

      // Update the order in the list
      if (action.payload.data) {
        const index = state.data.findIndex((order) => order.id === action.payload.data.id);
        if (index !== -1) {
          state.data[index] = action.payload.data;
        }
        if (state.selectedOrder?.id === action.payload.data.id) {
          state.selectedOrder = action.payload.data;
        }
      }
    };

    // Get all orders handlers
    [getAllOrders].forEach((thunk) => {
      builder.addCase(thunk.pending, handlePending);
      builder.addCase(thunk.fulfilled, handleFulfilled);
      builder.addCase(thunk.rejected, handleRejected);
    });

    // Get order details handlers
    builder.addCase(getOrderDetails.pending, handlePending);
    builder.addCase(getOrderDetails.fulfilled, handleGetDetailsFulfilled);
    builder.addCase(getOrderDetails.rejected, handleRejected);

    // Update order status handlers
    builder.addCase(updateOrderStatus.pending, handleUpdatePending);
    builder.addCase(updateOrderStatus.fulfilled, handleUpdateFulfilled);
    builder.addCase(updateOrderStatus.rejected, handleRejected);

    // Cancel order handlers
    builder.addCase(cancelOrder.pending, handleUpdatePending);
    builder.addCase(cancelOrder.fulfilled, handleUpdateFulfilled);
    builder.addCase(cancelOrder.rejected, handleRejected);
  },
});

/* ------------------ EXPORTS ------------------ */

export const { clearError, clearSuccess, setSelectedOrder } = orderManagementSlice.actions;

export default orderManagementSlice.reducer;
