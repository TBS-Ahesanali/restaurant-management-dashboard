import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, Filter, Eye, Clock, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Pagination from '../../components/Pagination';
import Loader from '../../components/Loader';
import { AppDispatch } from '../../redux/store';
import { RootState } from '../../redux/rootReducer';
import { getAllOrders, updateOrderStatus, OrderItem, OrderStatus, PaymentStatus } from '../../redux/slices/orderManagementSlice';
import useAuth from '../../hooks/useAuth';

// Types
type OrderStatusFilter = 'All' | OrderStatus;

interface FilterState {
  search: string;
  status: OrderStatusFilter;
  payment_status: 'All' | PaymentStatus;
}

// Custom hook for debouncing
const useDebounce = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

// Status badge component
const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const statusColors: Record<OrderStatus, { bg: string; text: string; border: string }> = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    payment_pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    preparing: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    ready: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
    out_for_delivery: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
    delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  };
  const colors = statusColors[status] || statusColors['pending'];
  const statusLabel = status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return <span className={`px-3 py-1.5 inline-flex text-xs font-semibold rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>{statusLabel}</span>;
};

// Action buttons component
const ActionButtons: React.FC<{
  order: OrderItem;
  onView: () => void;
  onUpdateStatus: () => void;
}> = ({ order, onView, onUpdateStatus }) => (
  <div className='flex gap-2 justify-center flex-wrap'>
    <button
      onClick={onView}
      className='text-[#ff4d4d] hover:text-[#ff4d4dda] p-2 rounded-lg hover:bg-[#ffdcdc] transition-all transform hover:scale-110'
      title='View Details'
      aria-label='View order details'
    >
      <Eye size={18} />
    </button>
    {order.status !== 'delivered' && order.status !== 'cancelled' && (
      <button
        onClick={onUpdateStatus}
        className='text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-all transform hover:scale-110'
        title='Update Status'
        aria-label='Update order status'
      >
        <Clock size={18} />
      </button>
    )}
  </div>
);

// Update Status Modal (inline, no detail page needed for quick status change)
const UpdateStatusModal: React.FC<{
  order: OrderItem | null;
  onClose: () => void;
  onConfirm: (status: OrderStatus) => void;
  isLoading: boolean;
}> = ({ order, onClose, onConfirm, isLoading }) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order?.status || 'pending');

  if (!order) return null;

  const statusOptions: OrderStatus[] = ['pending', 'payment_pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
  const formatStatus = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full'>
        <div className='p-6'>
          <h2 className='text-xl font-bold text-center mb-2 text-gray-900'>Update Order Status</h2>
          <p className='text-gray-500 text-center mb-6 text-sm'>Order ID: #{order.id}</p>
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Select New Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] focus:border-transparent'
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {formatStatus(s)}
                </option>
              ))}
            </select>
          </div>
          <div className='flex gap-3'>
            <button
              onClick={onClose}
              disabled={isLoading}
              className='flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-medium disabled:opacity-50'
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(selectedStatus)}
              disabled={isLoading}
              className='flex-1 px-4 py-2.5 bg-[#ff4d4d] text-white rounded-lg hover:bg-[#ff4d4dda] transition-all font-medium disabled:opacity-50'
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const shouldRestoreFocusRef = useRef(false);

  const { restaurant } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { data: orders, isLoading, pagination, updateLoading } = useSelector((state: RootState) => state.orderManagement);

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'All',
    payment_status: 'All',
  });
  const [statusModal, setStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch orders with all params
  const fetchOrders = useCallback(async () => {
    try {
      await dispatch(
        getAllOrders({
          page_number: currentPage,
          page_size: rowsPerPage,
          restaurant_id: restaurant?.id,
          search: debouncedSearch || undefined,
          status: filters.status !== 'All' ? filters.status : undefined,
          payment_status: filters.payment_status !== 'All' ? filters.payment_status : undefined,
        }),
      ).unwrap();
      if (shouldRestoreFocusRef.current) {
        requestAnimationFrame(() => {
          searchInputRef.current?.focus();
          shouldRestoreFocusRef.current = false;
        });
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  }, [dispatch, currentPage, rowsPerPage, debouncedSearch, filters.status, filters.payment_status, restaurant?.id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filters.status, filters.payment_status]);

  const orderList = useMemo(() => (Array.isArray(orders) ? orders : []), [orders]);
  const totalCount = pagination?.totalCount || orderList.length;

  // Navigate to detail page
  const handleView = (order: OrderItem) => {
    navigate(`/orders/${order.id}`, { state: { order } });
  };

  const handleUpdateStatusModal = (order: OrderItem) => {
    setSelectedOrder(order);
    setStatusModal(true);
  };

  const closeStatusModal = () => {
    setStatusModal(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdate = async (status: OrderStatus) => {
    if (!selectedOrder) return;
    try {
      const response = await dispatch(updateOrderStatus({ id: selectedOrder.id, status })).unwrap();
      const successMsg = (response as any)?.data?.message || (response as any)?.message || 'Order status updated successfully!';
      enqueueSnackbar(successMsg, { variant: 'success' });
      closeStatusModal();
      fetchOrders();
    } catch (err: any) {
      console.error('Failed to update order status:', err);
      enqueueSnackbar(err?.message || 'Failed to update order status', { variant: 'error' });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='max-w-full mx-auto'>
        {/* Header */}
        <header className='mb-8'>
          <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-2'>Order Management</h1>
          <p className='text-gray-600'>Manage and track all restaurant orders</p>
        </header>

        {/* Filters */}
        <div className='bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
            {/* Search */}
            <div className='relative'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' size={20} />
              <input
                ref={searchInputRef}
                type='text'
                placeholder='Search by order ID, customer...'
                value={filters.search}
                onChange={(e) => {
                  shouldRestoreFocusRef.current = true;
                  setFilters((prev) => ({ ...prev, search: e.target.value }));
                }}
                className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] focus:border-transparent transition-all'
                aria-label='Search orders'
              />
            </div>

            {/* Order Status Filter */}
            <div className='relative'>
              <Filter className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' size={20} />
              <select
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as OrderStatusFilter }))}
                className='w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] focus:border-transparent appearance-none bg-white cursor-pointer transition-all'
                aria-label='Filter by order status'
              >
                <option value='All'>All Status</option>
                <option value='payment_pending'>Payment Pending</option>
                <option value='pending'>Pending</option>
                <option value='confirmed'>Confirmed</option>
                <option value='preparing'>Preparing</option>
                <option value='ready'>Ready</option>
                <option value='out_for_delivery'>Out for Delivery</option>
                <option value='delivered'>Delivered</option>
                <option value='cancelled'>Cancelled</option>
              </select>
              <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </div>
            </div>

            {/* Payment Status Filter */}
            <div className='relative'>
              <CreditCard className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' size={20} />
              <select
                value={filters.payment_status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    payment_status: e.target.value as 'All' | PaymentStatus,
                  }))
                }
                className='w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] focus:border-transparent appearance-none bg-white cursor-pointer transition-all'
                aria-label='Filter by payment status'
              >
                <option value='All'>All Payment</option>
                <option value='Pending'>Pending</option>
                <option value='Paid'>Paid</option>
                <option value='Failed'>Failed</option>
                <option value='Refunded'>Refunded</option>
              </select>
              <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className='mt-4 text-sm text-gray-600'>
            Showing <span className='font-semibold text-gray-900'>{orderList.length}</span> order
            {orderList.length !== 1 ? 's' : ''}
            {pagination?.totalCount ? (
              <span className='ml-1'>
                of <span className='font-semibold text-gray-900'>{pagination.totalCount}</span> total
              </span>
            ) : null}
          </div>
        </div>

        {/* Desktop Table */}
        <div className='hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-gradient-to-r from-[#ff4d4d] to-[#ff6b6b] text-white'>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>Order ID</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>Items</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>Total</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>Status</th>
                  <th className='px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {orderList.length > 0 ? (
                  orderList.map((order, index) => (
                    <tr key={order.id} className={`hover:bg-red-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className='px-6 py-4'>
                        <div className='font-semibold text-gray-900 text-sm'>#{order.id}</div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-600'>
                          {order.menu_item.length} item{order.menu_item.length !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='font-semibold text-gray-900'>₹{order.total_amount}</div>
                      </td>
                      <td className='px-6 py-4'>
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className='px-6 py-4'>
                        <ActionButtons order={order} onView={() => handleView(order)} onUpdateStatus={() => handleUpdateStatusModal(order)} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className='px-6 py-16 text-center'>
                      <div className='text-gray-400 text-lg'>No orders found</div>
                      <p className='text-gray-500 text-sm mt-2'>Try adjusting your search or filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            totalItems={totalCount}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 20, 50, 100]}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={setRowsPerPage}
          />
        </div>

        {/* Mobile / Tablet Cards */}
        <div className='lg:hidden space-y-4'>
          {orderList.length > 0 ? (
            orderList.map((order) => (
              <div key={order.id} className='bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100'>
                <div className='space-y-3'>
                  <div className='flex justify-between items-start gap-2'>
                    <div>
                      <h3 className='font-bold text-gray-900 text-lg'>#{order.id}</h3>
                      <p className='text-sm text-gray-500'>Restaurant ID: {order.restaurant_id}</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <p className='text-xs text-gray-500 font-semibold'>Items</p>
                      <p className='text-sm text-gray-700'>
                        {order.menu_item.length} item{order.menu_item.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-500 font-semibold'>Total</p>
                      <p className='text-sm font-semibold text-gray-900'>₹{order.total_amount}</p>
                    </div>
                  </div>
                  <div className='pt-2 border-t border-gray-200'>
                    <ActionButtons order={order} onView={() => handleView(order)} onUpdateStatus={() => handleUpdateStatusModal(order)} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100'>
              <div className='text-gray-400 text-lg'>No orders found</div>
              <p className='text-gray-500 text-sm mt-2'>Try adjusting your search or filters</p>
            </div>
          )}
          {totalCount > rowsPerPage && (
            <div className='bg-white rounded-xl shadow-lg border border-gray-100'>
              <Pagination
                totalItems={totalCount}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10, 20, 50]}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={setRowsPerPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Update Status Modal */}
      {statusModal && selectedOrder && <UpdateStatusModal order={selectedOrder} onClose={closeStatusModal} onConfirm={handleStatusUpdate} isLoading={updateLoading} />}
    </div>
  );
};

export default OrdersPage;
