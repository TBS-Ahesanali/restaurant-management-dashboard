import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Check, X, AlertCircle, UtensilsCrossed, Mail } from 'lucide-react';
import { RestaurantItem } from '../../redux/slices/restaurantManagementSlice';

type RestaurantStatus = 'Approved' | 'Pending' | 'Rejected';

const ViewRestaurantDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const restaurant = location.state?.restaurant as RestaurantItem | null;

  if (!restaurant) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
        <div className='text-center'>
          <AlertCircle className='w-16 h-16 text-gray-400 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>Restaurant Not Found</h2>
          <p className='text-gray-600 mb-6'>The restaurant data is missing. Please go back and try again.</p>
          <button onClick={() => navigate('/restaurants')} className='px-6 py-3 bg-[#ff4d4d] text-white rounded-lg hover:bg-[#ff3333] transition-all font-medium'>
            Back to Restaurants
          </button>
        </div>
      </div>
    );
  }

  const statusColors = {
    Approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Rejected: 'bg-red-100 text-red-700 border-red-200',
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  const statusIcons = {
    Approved: <Check className='w-5 h-5' />,
    Rejected: <X className='w-5 h-5' />,
    Pending: <Clock className='w-5 h-5' />,
  };

  return (
    <div className='min-h-screen p-4 sm:p-6 lg:p-8'>
      <div className='max-w-full mx-auto'>
        {/* Header with Back Button */}
        <div className='mb-6'>
          <button onClick={() => navigate('/restaurants')} className='inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4 group'>
            <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
            <span>Back</span>
          </button>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>View Restaurant Details</h1>
        </div>

        {/* Main Content Card */}
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
          {/* Simple Header Section */}
          <div className='p-6 sm:p-8 border-b border-gray-200'>
            <div className='flex flex-col gap-2'>
              {/* Restaurant Name & Status */}
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                <h2 className='text-2xl sm:text-3xl font-bold text-gray-900'>{restaurant.restaurant_name}</h2>
                <div className={`px-4 py-2 rounded-lg border ${statusColors[restaurant.status as RestaurantStatus]} flex items-center gap-2 self-start sm:self-auto`}>
                  {statusIcons[restaurant.status as RestaurantStatus]}
                  <span className='font-semibold'>{restaurant.status}</span>
                </div>
              </div>
              <div className='flex items-start gap-2 text-gray-600'>
                <Mail className='w-5 h-5 mt-0.5 flex-shrink-0' />
                <span className='text-sm sm:text-base'>{restaurant.email}</span>
              </div>
              {/* Address */}
              <div className='flex items-start gap-2 text-gray-600'>
                <MapPin className='w-5 h-5 mt-0.5 flex-shrink-0' />
                <span className='text-sm sm:text-base'>{restaurant.address}</span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className='p-4 sm:p-6 space-y-4'>
            {/* Description */}
            {/* <div className='bg-gray-50 rounded-xl p-3 border border-gray-200'>
              <div className='flex items-center gap-2 mb-3'>
                <FileText className='w-5 h-5 text-[#ff4d4d]' />
                <h3 className='text-lg font-semibold text-gray-900'>Description</h3>
              </div>
              <p className='text-gray-700 leading-relaxed'>{restaurant.description || 'No description provided'}</p>
            </div> */}

            {/* Rejection Reason (if rejected) */}
            {restaurant.status === 'Rejected' && restaurant.rejection_reason && (
              <div className='bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 sm:p-6'>
                <div className='flex items-start gap-3'>
                  <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 flex-shrink-0' />
                  <div>
                    <h3 className='text-lg font-semibold text-red-900 mb-2'>Rejection Reason</h3>
                    <p className='text-red-800 leading-relaxed'>{restaurant.rejection_reason}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items */}
            {restaurant.menu_items && restaurant.menu_items.length > 0 && (
              <div className='bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200'>
                <div className='flex items-center gap-2 mb-4'>
                  <UtensilsCrossed className='w-5 h-5 text-[#ff4d4d]' />
                  <h3 className='text-lg font-semibold text-gray-900'>Menu Items</h3>
                  <span className='ml-auto bg-[#ff4d4d] text-white px-3 py-1 rounded-full text-sm font-semibold'>{restaurant.menu_items.length} Items</span>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
                  {restaurant.menu_items.map((item, index) => (
                    <div key={item.id} className='bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all hover:scale-[1.02]'>
                      <div className='flex justify-between items-center gap-3'>
                        <div className='flex items-center gap-2 flex-1'>
                          <span className='w-6 h-6 rounded-full bg-[#ff4d4d] text-white flex items-center justify-center text-xs font-bold'>{index + 1}</span>
                          <span className='font-medium text-gray-900'>{item.item_name}</span>
                        </div>
                        {/* <span className='text-lg font-bold text-[#ff4d4d] whitespace-nowrap'>₹{item.price}</span> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Menu Items Message */}
            {(!restaurant.menu_items || restaurant.menu_items.length === 0) && (
              <div className='bg-gray-50 rounded-xl p-8 border border-gray-200 text-center'>
                <UtensilsCrossed className='w-12 h-12 text-gray-400 mx-auto mb-3' />
                <p className='text-gray-600'>No menu items available</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        {/* <div className='mt-6 bg-white rounded-lg border border-blue-200 p-4 shadow-sm'>
          <div className='flex items-start gap-3'>
            <AlertCircle className='w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0' />
            <p className='text-sm text-gray-700'>
              <strong className='text-gray-900'>Note:</strong> This is a read-only view of the restaurant details. For any modifications, please contact the administrator.
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ViewRestaurantDetails;
