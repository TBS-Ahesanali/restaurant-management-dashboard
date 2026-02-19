import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, X, Clock, AlertCircle, ShoppingBag, CreditCard, Utensils, FileText, ChefHat, MapPin, Receipt } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { RootState } from '../../redux/rootReducer';
import { OrderItem, OrderMenuItem, OrderPricing, OrderStatus, getOrderDetails, updateOrderStatus } from '../../redux/slices/orderManagementSlice';
import Loader from '../../components/Loader';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

/* ─── helpers ────────────────────────────────────────────────── */

const formatStatus = (status: string) => status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/* ─── Status badge ───────────────────────────────────────────── */

const statusConfig: Record<OrderStatus, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: <Clock className='w-5 h-5' />,
  },
  payment_pending: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    icon: <CreditCard className='w-5 h-5' />,
  },
  confirmed: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: <Check className='w-5 h-5' />,
  },
  preparing: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: <ChefHat className='w-5 h-5' />,
  },
  ready: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    icon: <Check className='w-5 h-5' />,
  },
  out_for_delivery: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    icon: <MapPin className='w-5 h-5' />,
  },
  delivered: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: <Check className='w-5 h-5' />,
  },
  cancelled: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: <X className='w-5 h-5' />,
  },
};

/* ─── Update Status Modal ────────────────────────────────────── */

const UpdateStatusModal: React.FC<{
  order: OrderItem;
  onClose: () => void;
  onConfirm: (status: OrderStatus) => void;
  isLoading: boolean;
}> = ({ order, onClose, onConfirm, isLoading }) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);

  const statusOptions: OrderStatus[] = ['pending', 'payment_pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

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

/* ─── Main Component ─────────────────────────────────────────── */

const ViewOrderDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();

  const { selectedOrder, isLoading, updateLoading } = useSelector((state: RootState) => state.orderManagement);

  // Use order passed via navigation state first; fall back to fetched order
  const stateOrder = location.state?.order as OrderItem | undefined;
  const order: OrderItem | null = stateOrder ?? selectedOrder;

  const [showStatusModal, setShowStatusModal] = useState(false);

  // Fetch full details if not already available (e.g., direct URL access)
  useEffect(() => {
    if (!stateOrder && id) {
      dispatch(getOrderDetails(Number(id)));
    }
  }, [id, stateOrder, dispatch]);

  if (isLoading) return <Loader />;

  if (!order) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center p-4'>
        <div className='text-center'>
          <AlertCircle className='w-16 h-16 text-gray-400 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>Order Not Found</h2>
          <p className='text-gray-600 mb-6'>The order data is missing. Please go back and try again.</p>
          <button onClick={() => navigate('/orders')} className='px-6 py-3 bg-[#ff4d4d] text-white rounded-lg hover:bg-[#ff3333] transition-all font-medium'>
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const cfg = statusConfig[order.status] || statusConfig['pending'];
  const isCancelled = order.status === 'cancelled';
  const isTerminal = order.status === 'delivered' || order.status === 'cancelled';

  const statusSteps: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
  const currentStepIndex = statusSteps.indexOf(order.status);

  const pricing: OrderPricing = order.pricing;

  const handleStatusUpdate = async (status: OrderStatus) => {
    try {
      const response = await dispatch(updateOrderStatus({ id: order.id, status })).unwrap();
      const successMsg = (response as any)?.data?.message || (response as any)?.message || 'Order status updated successfully!';
      enqueueSnackbar(successMsg, { variant: 'success' });
      setShowStatusModal(false);
      // Re-fetch updated order
      dispatch(getOrderDetails(order.id));
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to update order status', { variant: 'error' });
    }
  };

  return (
    <div className='min-h-screen p-4 sm:p-6 lg:p-8'>
      <div className='max-w-full mx-auto'>
        {/* ── Back + Title ── */}
        <div className='mb-6'>
          <button onClick={() => navigate('/orders')} className='inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4 group'>
            <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
            <span>Back</span>
          </button>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Order Details</h1>
        </div>

        {/* ── Main Card ── */}
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
          {/* ── Header ── */}
          <div className='p-6 sm:p-8 border-b border-gray-200'>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                <h2 className='text-2xl sm:text-3xl font-bold text-gray-900'>Order #{order.id}</h2>
                <div className={`px-4 py-2 rounded-lg border ${cfg.bg} ${cfg.text} ${cfg.border} flex items-center gap-2 self-start sm:self-auto`}>
                  {cfg.icon}
                  <span className='font-semibold'>{formatStatus(order.status)}</span>
                </div>
              </div>

              {/* <div className='flex items-center gap-2 text-gray-600'>
                <Utensils className='w-4 h-4 flex-shrink-0' />
                <span className='text-sm'>Restaurant ID: {order.restaurant_id}</span>
              </div> */}

              {order.extra_note && (
                <div className='flex items-start gap-2 text-gray-600'>
                  <FileText className='w-4 h-4 mt-0.5 flex-shrink-0' />
                  <span className='text-sm italic'>"{order.extra_note}"</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Details Section ── */}
          <div className='p-4 sm:p-6 space-y-4'>
            {/* ── Order Progress ── */}
            {!isCancelled && currentStepIndex >= 0 && (
              <div className='bg-gray-50 rounded-xl p-5 border border-gray-200'>
                <div className='flex items-center gap-2 mb-4'>
                  <Receipt className='w-5 h-5 text-[#ff4d4d]' />
                  <h3 className='text-lg font-semibold text-gray-900'>Order Progress</h3>
                </div>
                <div className='flex items-start justify-between relative mt-2'>
                  {/* track */}
                  <div className='absolute top-3 left-0 right-0 h-1 bg-gray-200' />
                  <div
                    className='absolute top-3 left-0 h-1 bg-[#ff4d4d] transition-all duration-300'
                    style={{
                      width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                    }}
                  />
                  {statusSteps.map((step, index) => (
                    <div key={step} className='flex flex-col items-center z-10'>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                          index <= currentStepIndex ? 'bg-[#ff4d4d] text-white shadow-md' : 'bg-white border-2 border-gray-300 text-gray-500'
                        }`}
                      >
                        {index < currentStepIndex ? <Check size={12} /> : index + 1}
                      </div>
                      <span className={`text-xs mt-2 text-center max-w-[56px] leading-tight ${index <= currentStepIndex ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                        {formatStatus(step)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancelled notice */}
            {isCancelled && (
              <div className='bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 sm:p-6'>
                <div className='flex items-start gap-3'>
                  <X className='w-5 h-5 text-red-600 mt-0.5 flex-shrink-0' />
                  <div>
                    <h3 className='text-lg font-semibold text-red-900 mb-1'>Order Cancelled</h3>
                    <p className='text-red-700 text-sm'>This order has been cancelled.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Order Items ── */}
            <div className='bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border border-orange-200'>
              <div className='flex items-center gap-2 mb-4'>
                <ShoppingBag className='w-5 h-5 text-[#ff4d4d]' />
                <h3 className='text-lg font-semibold text-gray-900'>Order Items</h3>
                <span className='ml-auto bg-[#ff4d4d] text-white px-3 py-1 rounded-full text-sm font-semibold'>
                  {order.menu_item.length} Item{order.menu_item.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {order.menu_item.map((item: OrderMenuItem, index: number) => (
                  <div key={item.id} className='bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all hover:scale-[1.01]'>
                    <div className='flex items-start gap-3'>
                      <span className='w-7 h-7 rounded-full bg-[#ff4d4d] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5'>{index + 1}</span>
                      <div className='flex-1'>
                        <p className='font-semibold text-gray-900'>{item.menu_item_name}</p>
                        {item.variations && item.variations.length > 0 ? (
                          <div className='mt-1 space-y-0.5'>
                            {item.variations.map((v) => (
                              <div key={v.id} className='flex justify-between items-center'>
                                <span className='text-xs text-gray-500'>{v.variant_name}</span>
                                <span className='text-xs font-semibold text-[#ff4d4d]'>₹{v.variant_price}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className='text-xs text-gray-400 mt-1 block'>No variants</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Pricing ── */}
            <div className='bg-gray-50 rounded-xl p-5 border border-gray-200'>
              <div className='flex items-center gap-2 mb-4'>
                <CreditCard className='w-5 h-5 text-[#ff4d4d]' />
                <h3 className='text-lg font-semibold text-gray-900'>Pricing Details</h3>
              </div>
              <div className='space-y-2.5'>
                <PricingRow label='Items Subtotal' value={pricing.items_subtotal} />
                <PricingRow label='GST' value={pricing.items_gst} />
                {parseFloat(pricing.delivery_fee) > 0 && <PricingRow label='Delivery Fee' value={pricing.delivery_fee} />}
                {parseFloat(pricing.platform_fee) > 0 && <PricingRow label='Platform Fee' value={pricing.platform_fee} />}
                {parseFloat(pricing.packaging_fee) > 0 && <PricingRow label='Packaging Fee' value={pricing.packaging_fee} />}
                {parseFloat(pricing.discount) > 0 && (
                  <div className='flex justify-between text-sm text-emerald-600'>
                    <span className='font-medium'>Discount</span>
                    <span className='font-semibold'>-₹{pricing.discount}</span>
                  </div>
                )}
                <div className='border-t border-gray-300 pt-3 mt-2'>
                  <div className='flex justify-between'>
                    <span className='font-bold text-gray-900 text-base'>Grand Total</span>
                    <span className='font-bold text-[#ff4d4d] text-lg'>₹{pricing.grand_total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Special Note ── */}
            {order.extra_note && (
              <div className='bg-yellow-50 rounded-xl p-3 border border-yellow-200'>
                <div className='flex items-start gap-3'>
                  <FileText className='w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0' />
                  <div>
                    <h3 className='text-base font-semibold text-gray-900 mb-1'>Special Instructions</h3>
                    <p className='text-gray-700 text-sm'>{order.extra_note}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Actions ── */}
        {!isTerminal && (
          <div className='mt-6 flex justify-end gap-3'>
            <button
              onClick={() => navigate('/orders')}
              className='px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium'
            >
              Back to List
            </button>
            <button onClick={() => setShowStatusModal(true)} className='px-5 py-2.5 bg-[#ff4d4d] text-white rounded-lg hover:bg-[#ff3333] transition-all font-medium'>
              Update Status
            </button>
          </div>
        )}
      </div>

      {/* ── Update Status Modal ── */}
      {showStatusModal && <UpdateStatusModal order={order} onClose={() => setShowStatusModal(false)} onConfirm={handleStatusUpdate} isLoading={updateLoading} />}
    </div>
  );
};

/* ─── Small helper component ────────────────────────────────── */

const PricingRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className='flex justify-between text-sm'>
    <span className='text-gray-600'>{label}</span>
    <span className='text-gray-900 font-medium'>₹{value}</span>
  </div>
);

export default ViewOrderDetails;
