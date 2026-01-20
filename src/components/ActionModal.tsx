import { Check, X } from 'lucide-react';
import { RestaurantItem } from '../redux/slices/restaurantManagementSlice';

export const ActionModal: React.FC<{
  type: 'approve' | 'reject';
  restaurant: RestaurantItem;
  rejectionReason: string;
  onReasonChange: (reason: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ type, restaurant, rejectionReason, onReasonChange, onCancel, onConfirm }) => {
  const config = {
    approve: {
      icon: <Check className='text-green-600' size={32} />,
      iconBg: 'bg-green-100',
      title: 'Confirm Approval',
      message: `Are you sure you want to approve ${restaurant.restaurant_name}?`,
      confirmText: 'Approve',
      confirmClass: 'bg-green-600 hover:bg-green-700',
    },
    reject: {
      icon: <X className='text-red-600' size={32} />,
      iconBg: 'bg-red-100',
      title: 'Confirm Rejection',
      message: `Please provide a reason for rejecting ${restaurant.restaurant_name}`,
      confirmText: 'Reject',
      confirmClass: 'bg-red-600 hover:bg-red-700',
    },
  };

  const current = config[type];
  const isDisabled = type === 'reject' && !rejectionReason.trim();

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full'>
        <div className='p-6'>
          <div className={`flex items-center justify-center w-16 h-16 ${current.iconBg} rounded-full mx-auto mb-4`}>{current.icon}</div>
          <h2 className='text-2xl font-bold text-center mb-4 text-gray-900'>{current.title}</h2>
          <p className='text-gray-600 text-center mb-4'>{current.message}</p>

          {type === 'reject' && (
            <textarea
              value={rejectionReason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder='Enter rejection reason (required)...'
              rows={4}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4'
              aria-label='Rejection reason'
            />
          )}

          <div className='flex gap-3'>
            <button onClick={onCancel} className='flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-medium'>
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDisabled}
              className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-all font-medium shadow-lg ${current.confirmClass} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {current.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
