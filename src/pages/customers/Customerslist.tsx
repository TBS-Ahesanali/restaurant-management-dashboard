import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, Eye, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../../components/Pagination';
import Loader from '../../components/Loader';
import { AppDispatch } from '../../redux/store';
import { RootState } from '../../redux/rootReducer';
import { getAllCustomers, CustomerItem, updateCustomerStatus, UpdateStatusResponse } from '../../redux/slices/customermanagementslice';
import { useSnackbar } from 'notistack';

// Custom hook for debouncing
const useDebounce = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// Status badge component for active/inactive - now clickable
const StatusBadge: React.FC<{
  isActive: boolean;
  onClick: () => void;
}> = ({ isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 inline-flex text-xs font-semibold rounded-full border transition-all transform hover:scale-105 cursor-pointer ${
        isActive ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200' : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
      }`}
      title={`Click to ${isActive ? 'deactivate' : 'activate'}`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </button>
  );
};

// Action buttons component
const ActionButtons: React.FC<{
  customer: CustomerItem;
  onView: () => void;
}> = ({ customer, onView }) => (
  <div className='flex gap-2 justify-center'>
    <button
      onClick={onView}
      className='text-[#ff4d4d] hover:text-[#ff4d4dda] p-2 rounded-lg hover:bg-[#ffdcdc] transition-all transform hover:scale-110'
      title='View Details'
      aria-label='View customer details'
    >
      <Eye size={18} />
    </button>
  </div>
);

// Main Component
const CustomersList: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch<AppDispatch>();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const shouldRestoreFocusRef = useRef(false);

  // Redux state
  const { data: customers, isLoading, pagination } = useSelector((state: RootState) => state.customerManagement);

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  // Debounced search
  const debouncedSearch = useDebounce(search, 500);

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    try {
      await dispatch(
        getAllCustomers({
          page: currentPage,
          page_size: rowsPerPage,
          search: debouncedSearch || undefined,
        }),
      ).unwrap();
      if (shouldRestoreFocusRef.current) {
        requestAnimationFrame(() => {
          searchInputRef.current?.focus();
        });
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  }, [dispatch, currentPage, rowsPerPage, debouncedSearch]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Computed values
  const customerList = useMemo(() => (Array.isArray(customers) ? customers : []), [customers]);

  const totalCount = pagination?.totalCount || customerList.length;

  // View handler
  const handleView = (customer: CustomerItem) => {
    navigate(`/customers/${customer.id}`, { state: { customer } });
  };

  // Toggle status handler
  const handleToggleStatus = async (customer: CustomerItem) => {
    try {
      const newStatus = !customer.is_active;
      const response = (await dispatch(
        updateCustomerStatus({
          id: customer.id,
          is_active: newStatus,
        }),
      ).unwrap()) as UpdateStatusResponse;

      enqueueSnackbar(response?.message || `Customer "${customer.full_name || customer.email}" ${newStatus ? 'activated' : 'deactivated'} successfully!`, {
        variant: 'success',
      });

      await fetchCustomers();
    } catch (err: any) {
      console.error('Failed to update customer status:', err);
      enqueueSnackbar(err?.message || 'Failed to update customer status', {
        variant: 'error',
      });
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
          <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-2'>Customer Management</h1>
          <p className='text-gray-600'>View and manage customer accounts</p>
        </header>

        {/* Search Filter */}
        <div className='bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-100'>
          <div className='grid grid-cols-1 gap-4'>
            {/* 🔍 Search */}
            <div className='relative'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' size={20} />
              <input
                ref={searchInputRef}
                type='text'
                placeholder='Search by name, email, or phone number...'
                value={search}
                onChange={(e) => {
                  shouldRestoreFocusRef.current = true;
                  setSearch(e.target.value);
                }}
                className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]
                   focus:border-transparent transition-all'
                aria-label='Search customers'
              />
            </div>
          </div>

          {/* 📊 Results Count */}
          <div className='mt-4 text-sm text-gray-600'>
            Showing <span className='font-semibold text-gray-900'>{customerList.length}</span> customer{customerList.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Table - Desktop */}
        <div className='hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-gradient-to-r from-[#ff4d4d] to-[#ff6b6b] text-white'>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>Name</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>Email</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>Phone</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>Gender</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>Status</th>
                  <th className='px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {customerList.length > 0 ? (
                  customerList.map((customer, index) => (
                    <tr key={customer.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <div className='w-8 h-8 rounded-full bg-[#ff4d4d] text-white flex items-center justify-center font-semibold'>
                            {customer.full_name ? customer.full_name.charAt(0).toUpperCase() : <User size={16} />}
                          </div>
                          <div className='font-semibold text-gray-900'>{customer.full_name || '-'}</div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-600 max-w-xs truncate' title={customer.email}>
                          {customer.email || '-'}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-600'>{customer.phone_number || '-'}</div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-600 capitalize'>{customer.gender || '-'}</div>
                      </td>
                      <td className='px-6 py-4'>
                        <StatusBadge isActive={customer.is_active} onClick={() => handleToggleStatus(customer)} />
                      </td>
                      <td className='px-6 py-4'>
                        <ActionButtons customer={customer} onView={() => handleView(customer)} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className='px-6 py-12 text-center'>
                      <div className='text-gray-400 text-lg'>No customers found</div>
                      <p className='text-gray-500 text-sm mt-2'>Try adjusting your search</p>
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
          {customerList.length > 0 ? (
            customerList.map((customer) => (
              <div key={customer.id} className='bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100'>
                <div className='space-y-3'>
                  <div className='flex justify-between items-start gap-2'>
                    <div className='flex items-center gap-2'>
                      <div className='w-10 h-10 rounded-full bg-[#ff4d4d] text-white flex items-center justify-center font-semibold'>
                        {customer.full_name ? customer.full_name.charAt(0).toUpperCase() : <User size={18} />}
                      </div>
                      <h3 className='font-bold text-gray-900 text-lg'>{customer.full_name || 'No Name'}</h3>
                    </div>
                    <StatusBadge isActive={customer.is_active} onClick={() => handleToggleStatus(customer)} />
                  </div>

                  <div>
                    <p className='text-xs text-gray-500 font-semibold mb-1'>Email</p>
                    <p className='text-sm text-gray-700'>{customer.email}</p>
                  </div>

                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <p className='text-xs text-gray-500 font-semibold mb-1'>Phone</p>
                      <p className='text-sm text-gray-700'>{customer.phone_number || '-'}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-500 font-semibold mb-1'>Gender</p>
                      <p className='text-sm text-gray-700 capitalize'>{customer.gender || '-'}</p>
                    </div>
                  </div>

                  <div className='pt-2 border-t border-gray-200'>
                    <ActionButtons customer={customer} onView={() => handleView(customer)} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100'>
              <div className='text-gray-400 text-lg'>No customers found</div>
              <p className='text-gray-500 text-sm mt-2'>Try adjusting your search</p>
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
    </div>
  );
};

export default CustomersList;
