import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, Filter, Eye, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../components/Pagination';
import Loader from '../../components/Loader';
import { AppDispatch } from '../../redux/store';
import { RootState } from '../../redux/rootReducer';
import { getAllRestaurants, RestaurantItem, updateRestaurantStatus, UpdateStatusResponse } from '../../redux/slices/restaurantManagementSlice';
import { ActionModal } from '../../components/ActionModal';
import { useSnackbar } from 'notistack';

// Types
type RestaurantStatus = 'Approved' | 'Pending' | 'Rejected';

interface FilterState {
  search: string;
  status: 'All' | RestaurantStatus;
}

interface ModalState {
  approve: boolean;
  reject: boolean;
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
const StatusBadge: React.FC<{
  status: RestaurantStatus;
  rejectionReason?: string;
}> = ({ status, rejectionReason }) => {
  const statusColors = {
    Approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Rejected: 'bg-red-100 text-red-700 border-red-200',
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  return (
    <div className='relative inline-block group'>
      <span className={`px-3 py-1.5 inline-flex text-xs font-semibold rounded-full border ${statusColors[status]}`}>{status}</span>
      {status === 'Rejected' && rejectionReason && (
        <div className='absolute z-20 invisible group-hover:visible bg-gray-900 text-white text-xs rounded-lg py-2 px-3 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 shadow-xl'>
          <div className='font-semibold mb-1'>Rejection Reason:</div>
          <div className='text-gray-200'>{rejectionReason}</div>
          <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900' />
        </div>
      )}
    </div>
  );
};

// Action buttons component
const ActionButtons: React.FC<{
  restaurant: RestaurantItem;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
}> = ({ restaurant, onView, onApprove, onReject }) => (
  <div className='flex gap-2 justify-center flex-wrap'>
    <button
      onClick={onView}
      className='text-[#ff4d4d] hover:text-[#ff4d4dda] p-2 rounded-lg hover:bg-[#ffdcdc] transition-all transform hover:scale-110'
      title='View Details'
      aria-label='View restaurant details'
    >
      <Eye size={18} />
    </button>
    {restaurant.status !== 'Approved' && (
      <button
        onClick={onApprove}
        className='text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-100 transition-all transform hover:scale-110'
        title='Approve'
        aria-label='Approve restaurant'
      >
        <Check size={18} />
      </button>
    )}
    {restaurant.status !== 'Rejected' && restaurant.status !== 'Approved' && (
      <button
        onClick={onReject}
        className='text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-all transform hover:scale-110'
        title='Reject'
        aria-label='Reject restaurant'
      >
        <X size={18} />
      </button>
    )}
  </div>
);

// Main Component
const RestaurantsList: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch<AppDispatch>();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const shouldRestoreFocusRef = useRef(false);

  // Redux state
  const { data: restaurants, isLoading, pagination } = useSelector((state: RootState) => state.restaurantManagement);

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<FilterState>({ search: '', status: 'All' });
  const [modals, setModals] = useState<ModalState>({ approve: false, reject: false });
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Debounced search
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch restaurants
  const fetchRestaurants = useCallback(async () => {
    try {
      await dispatch(
        getAllRestaurants({
          page_number: currentPage,
          page_size: rowsPerPage,
          search: debouncedSearch || undefined,
          status: filters.status !== 'All' ? filters.status : undefined,
        }),
      ).unwrap();
      if (shouldRestoreFocusRef.current) {
        requestAnimationFrame(() => {
          searchInputRef.current?.focus();
        });
      }
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
    }
  }, [dispatch, currentPage, rowsPerPage, debouncedSearch, filters.status]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filters.status]);

  // Computed values
  const restaurantList = useMemo(() => (Array.isArray(restaurants) ? restaurants : []), [restaurants]);

  const totalCount = pagination?.totalCount || restaurantList.length;

  // Modal handlers
  const openModal = (type: keyof ModalState, restaurant: RestaurantItem) => {
    setSelectedRestaurant(restaurant);
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    if (type === 'reject') setRejectionReason('');
    setSelectedRestaurant(null);
  };

  const handleView = (restaurant: RestaurantItem) => {
    navigate(`/restaurants/${restaurant.id}`, { state: { restaurant } });
  };

  const handleStatusUpdate = async (status: 'Approved' | 'Rejected', modalType: keyof ModalState) => {
    if (!selectedRestaurant) return;
    if (status === 'Rejected' && !rejectionReason.trim()) {
      enqueueSnackbar('Please provide a rejection reason.', {
        variant: 'error',
      });
      return;
    }

    try {
      const payload: any = {
        id: selectedRestaurant.id,
        status,
      };

      if (status === 'Rejected') {
        payload.rejection_reason = rejectionReason.trim();
      }

      const response = (await dispatch(updateRestaurantStatus(payload)).unwrap()) as UpdateStatusResponse;

      if (response?.status === 200) {
        const isApproved = status === 'Approved';

        enqueueSnackbar(response?.message || `Restaurant "${selectedRestaurant.restaurant_name}" ${isApproved ? 'approved' : 'rejected'} successfully!`, {
          variant: isApproved ? 'success' : 'error',
        });

        await fetchRestaurants();
        closeModal(modalType);
      }
    } catch (err: any) {
      console.error(`Failed to ${status.toLowerCase()} restaurant:`, err);

      enqueueSnackbar(err?.message || `Failed to ${status.toLowerCase()} restaurant`, { variant: 'error' });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='max-w-full mx-auto'>
        {/* Header */}
        <header className='mb-8'>
          <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-2'>Restaurant Management</h1>
          <p className='text-gray-600'>Manage and review restaurant applications</p>
        </header>

        {/* Filters */}
        <div className='bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
            <div className='relative md:col-span-2'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' size={20} />
              <input
                ref={searchInputRef}
                type='text'
                placeholder='Search by name, description, or address...'
                value={filters.search}
                onChange={(e) => {
                  shouldRestoreFocusRef.current = true;
                  setFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }));
                }}
                className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]
                   focus:border-transparent transition-all'
                aria-label='Search restaurants'
              />
            </div>

            <div className='relative md:col-span-1'>
              <Filter className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' size={20} />
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value as FilterState['status'],
                  }))
                }
                className='w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]
                   focus:border-transparent appearance-none bg-white
                   cursor-pointer transition-all'
                aria-label='Filter by status'
              >
                <option value='All'>All Status</option>
                <option value='Approved'>Approved</option>
                <option value='Pending'>Pending</option>
                <option value='Rejected'>Rejected</option>
              </select>

              {/* Dropdown Icon */}
              <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </div>
            </div>
          </div>

          {/* 📊 Results Count */}
          <div className='mt-4 text-sm text-gray-600'>
            Showing <span className='font-semibold text-gray-900'>{restaurantList.length}</span> restaurant{restaurantList.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Table - Desktop */}
        <div className='hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-gradient-to-r from-[#ff4d4d] to-[#ff6b6b] text-white'>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>Restaurant</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>Email</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>Address</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>Status</th>
                  <th className='px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {restaurantList.length > 0 ? (
                  restaurantList.map((restaurant, index) => (
                    <tr key={restaurant.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className='px-6 py-4'>
                        <div className='font-semibold text-gray-900'>{restaurant.restaurant_name}</div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-600 max-w-xs truncate' title={restaurant.email}>
                          {restaurant.email || '-'}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-600 max-w-xs truncate' title={restaurant.address}>
                          {restaurant.address || '-'}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <StatusBadge status={restaurant.status as RestaurantStatus} rejectionReason={restaurant.rejection_reason} />
                      </td>
                      <td className='px-6 py-4'>
                        <ActionButtons
                          restaurant={restaurant}
                          onView={() => handleView(restaurant)}
                          onApprove={() => openModal('approve', restaurant)}
                          onReject={() => openModal('reject', restaurant)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className='px-6 py-12 text-center'>
                      <div className='text-gray-400 text-lg'>No restaurants found</div>
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

        {/* Cards - Mobile/Tablet */}
        <div className='lg:hidden space-y-4'>
          {restaurantList.length > 0 ? (
            restaurantList.map((restaurant) => (
              <div key={restaurant.id} className='bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100'>
                <div className='space-y-3'>
                  <div className='flex justify-between items-start gap-2'>
                    <h3 className='font-bold text-gray-900 text-lg flex-1'>{restaurant.restaurant_name}</h3>
                    <StatusBadge status={restaurant.status as RestaurantStatus} rejectionReason={restaurant.rejection_reason} />
                  </div>

                  <div>
                    <p className='text-xs text-gray-500 font-semibold mb-1'>Description</p>
                    <p className='text-sm text-gray-700 line-clamp-2'>{restaurant.description}</p>
                  </div>

                  <div>
                    <p className='text-xs text-gray-500 font-semibold mb-1'>Address</p>
                    <p className='text-sm text-gray-700 line-clamp-2'>{restaurant.address}</p>
                  </div>

                  <div className='pt-2 border-t border-gray-200'>
                    <ActionButtons
                      restaurant={restaurant}
                      onView={() => handleView(restaurant)}
                      onApprove={() => openModal('approve', restaurant)}
                      onReject={() => openModal('reject', restaurant)}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100'>
              <div className='text-gray-400 text-lg'>No restaurants found</div>
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

      {/* Approve Modal */}
      {modals.approve && selectedRestaurant && (
        <ActionModal
          type='approve'
          restaurant={selectedRestaurant}
          rejectionReason=''
          onReasonChange={() => {}}
          onCancel={() => closeModal('approve')}
          onConfirm={() => handleStatusUpdate('Approved', 'approve')}
        />
      )}

      {/* Reject Modal */}
      {modals.reject && selectedRestaurant && (
        <ActionModal
          type='reject'
          restaurant={selectedRestaurant}
          rejectionReason={rejectionReason}
          onReasonChange={setRejectionReason}
          onCancel={() => closeModal('reject')}
          onConfirm={() => handleStatusUpdate('Rejected', 'reject')}
        />
      )}
    </div>
  );
};

export default RestaurantsList;
