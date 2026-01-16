import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface MenuItem {
  id: number;
  item_name: string;
  price: string;
}

type RestaurantStatus = 'Approved' | 'Pending' | 'Rejected';

interface Restaurant {
  id: number;
  restaurant_name: string;
  description: string;
  address: string;
  status: RestaurantStatus;
  rejection_reason?: string;
  menu_items?: MenuItem[];
}

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredData, setFilteredData] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | RestaurantStatus>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const itemsPerPage = 10;

  // Mock API call - replace with actual API
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    // Simulating API call
    const mockData: Restaurant[] = [
      {
        id: 1,
        restaurant_name: 'Indian Masala House',
        description: 'Serving authentic Gujarati food.',
        address: 'Ahmedabad, Gujarat',
        status: 'Approved',
        rejection_reason: '',
        menu_items: [
          { id: 90, item_name: 'Veg Salad', price: '500.00' },
          { id: 93, item_name: 'Dosa', price: '100.00' },
        ],
      },
      {
        id: 2,
        restaurant_name: 'Punjabi Dhaba',
        description: 'Traditional Punjabi cuisine',
        address: 'Delhi, India',
        status: 'Pending',
        rejection_reason: '',
      },
      {
        id: 3,
        restaurant_name: 'South Indian Express',
        description: 'Quick South Indian meals',
        address: 'Bangalore, Karnataka',
        status: 'Rejected',
        rejection_reason: 'Incomplete documentation',
      },
      {
        id: 4,
        restaurant_name: 'Mumbai Street Food',
        description: 'Authentic Mumbai street food experience',
        address: 'Mumbai, Maharashtra',
        status: 'Approved',
        rejection_reason: '',
      },
      {
        id: 5,
        restaurant_name: 'Bengali Delight',
        description: 'Traditional Bengali sweets and meals',
        address: 'Kolkata, West Bengal',
        status: 'Pending',
        rejection_reason: '',
      },
    ];

    setRestaurants(mockData);
    setFilteredData(mockData);
    setLoading(false);
  };

  // Search and Filter
  useEffect(() => {
    let filtered = restaurants;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.restaurant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter((restaurant) => restaurant.status === statusFilter);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, restaurants]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleApprove = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowApproveModal(true);
  };

  const handleReject = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowRejectModal(true);
  };

  const handleView = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowViewModal(true);
  };

  const confirmApprove = () => {
    setShowApproveModal(false);
    setSelectedRestaurant(null);
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) return;
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedRestaurant(null);
  };

  const getStatusColor = (status: RestaurantStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className='flex items-center justify-center h-screen'>Loading...</div>;
  }

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='max-w-full mx-auto'>
        <h1 className='text-3xl font-bold text-gray-800 mb-6'>Restaurants List</h1>

        {/* Search and Filter Section */}
        <div className='bg-white rounded-lg shadow-md p-4 mb-6'>
          <div className='flex flex-col md:flex-row gap-4'>
            {/* Search */}
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
              <input
                type='text'
                placeholder='Search by name, description, or address...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Status Filter */}
            <div className='relative'>
              <Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className='pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer'
              >
                <option value='All'>All Status</option>
                <option value='Approved'>Approved</option>
                <option value='Pending'>Pending</option>
                <option value='Rejected'>Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-100 border-b border-gray-200'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>Name</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>Description</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>Address</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>Status</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {currentData.length > 0 ? (
                  currentData.map((restaurant) => (
                    <tr key={restaurant.id} className='hover:bg-gray-50 transition-colors'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>{restaurant.restaurant_name}</div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-700 max-w-xs truncate'>{restaurant.description}</div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-700'>{restaurant.address}</div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='relative inline-block group'>
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(restaurant.status)}`}>{restaurant.status}</span>
                          {restaurant.status === 'Rejected' && restaurant.rejection_reason && (
                            <div className='absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded-lg py-2 px-3 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48'>
                              <div className='font-semibold mb-1'>Rejection Reason:</div>
                              {restaurant.rejection_reason}
                              <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900'></div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex gap-2'>
                          <button
                            onClick={() => handleView(restaurant)}
                            className='text-blue-600 hover:text-blue-900 p-1.5 rounded-lg hover:bg-blue-50 transition-colors'
                            title='View Details'
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleApprove(restaurant)}
                            className='text-green-600 hover:text-green-900 p-1.5 rounded-lg hover:bg-green-50 transition-colors'
                            title='Approve'
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleReject(restaurant)}
                            className='text-red-600 hover:text-red-900 p-1.5 rounded-lg hover:bg-red-50 transition-colors'
                            title='Reject'
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className='px-6 py-8 text-center text-gray-500'>
                      No restaurants found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200'>
              <div className='text-sm text-gray-700'>
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className='px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors'
                >
                  <ChevronLeft size={20} />
                </button>
                <div className='flex gap-1'>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg transition-colors ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-100'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className='px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors'
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedRestaurant && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <h2 className='text-2xl font-bold mb-4'>Restaurant Details</h2>
              <div className='space-y-3'>
                <div>
                  <span className='font-semibold'>Name:</span> {selectedRestaurant.restaurant_name}
                </div>
                <div>
                  <span className='font-semibold'>Description:</span> {selectedRestaurant.description}
                </div>
                <div>
                  <span className='font-semibold'>Address:</span> {selectedRestaurant.address}
                </div>
                <div>
                  <span className='font-semibold'>Status:</span>{' '}
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedRestaurant.status)}`}>
                    {selectedRestaurant.status}
                  </span>
                </div>
                {selectedRestaurant.rejection_reason && (
                  <div>
                    <span className='font-semibold'>Rejection Reason:</span> {selectedRestaurant.rejection_reason}
                  </div>
                )}
                {selectedRestaurant.menu_items && selectedRestaurant.menu_items.length > 0 && (
                  <div>
                    <span className='font-semibold'>Menu Items:</span>
                    <ul className='mt-2 space-y-1'>
                      {selectedRestaurant.menu_items.map((item) => (
                        <li key={item.id} className='ml-4'>
                          • {item.item_name} - ₹{item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className='flex justify-end gap-3 mt-6'>
                <button onClick={() => setShowViewModal(false)} className='px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedRestaurant && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full'>
            <div className='p-6'>
              <h2 className='text-xl font-bold mb-4'>Confirm Approval</h2>
              <p className='text-gray-700 mb-6'>
                Are you sure you want to approve <span className='font-semibold'>{selectedRestaurant.restaurant_name}</span>?
              </p>
              <div className='flex justify-end gap-3'>
                <button onClick={() => setShowApproveModal(false)} className='px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'>
                  Cancel
                </button>
                <button onClick={confirmApprove} className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRestaurant && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full'>
            <div className='p-6'>
              <h2 className='text-xl font-bold mb-4'>Confirm Rejection</h2>
              <p className='text-gray-700 mb-4'>
                Please provide a reason for rejecting <span className='font-semibold'>{selectedRestaurant.restaurant_name}</span>:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder='Enter rejection reason...'
                rows={4}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none'
              />
              <div className='flex justify-end gap-3 mt-4'>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                  className='px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
                >
                  Cancel
                </button>
                <button onClick={confirmReject} className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantsList;
