import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ShoppingBag, DollarSign, CalendarRange, Users, CheckCircle, Clock, Store } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/rootReducer';
import { getDashboardCounts } from '../redux/slices/dashboardManagementSlice';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const dispatch = useDispatch<any>();
  const { data: dashboardData, isLoading } = useSelector((state: RootState) => state.dashboardManagement);

  React.useEffect(() => {
    dispatch(getDashboardCounts());
  }, [dispatch]);

  const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: [3200, 4100, 3800, 5200, 4800, 6100, 5800],
        borderColor: '#4A90E2',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='max-w-full mx-auto'>
        {/* Header */}
        <header className='mb-8'>
          <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-2'>Dashboard</h1>
          <p className='text-gray-600'>Overview of your restaurant management system</p>
        </header>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8'>
          {/* Total Customers */}
          <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-[#ff4d4d] to-[#ff6b6b] flex items-center justify-center'>
                <Users size={24} className='text-white' />
              </div>
              <span className='text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full'>Total</span>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>{dashboardData?.customer_count || 0}</h3>
            <p className='text-gray-600 text-sm'>Total Customers</p>
          </div>

          {/* Approved Restaurants */}
          <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center'>
                <CheckCircle size={24} className='text-white' />
              </div>
              <span className='text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full'>Active</span>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>{dashboardData?.restaurant_approved_count || 0}</h3>
            <p className='text-gray-600 text-sm'>Approved Restaurants</p>
          </div>

          {/* Pending Restaurants */}
          <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center'>
                <Clock size={24} className='text-white' />
              </div>
              <span className='text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full'>Pending</span>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>{dashboardData?.restaurant_pending_count || 0}</h3>
            <p className='text-gray-600 text-sm'>Pending Restaurants</p>
          </div>

          {/* Total Restaurants */}
          <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center'>
                <Store size={24} className='text-white' />
              </div>
              <span className='text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full'>All</span>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-1'>{(dashboardData?.restaurant_approved_count || 0) + (dashboardData?.restaurant_pending_count || 0)}</h3>
            <p className='text-gray-600 text-sm'>Total Restaurants</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className='row g-4 mb-4'>
          <div className='col-md-8'>
            <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-100'>
              <div className='d-flex justify-content-between align-items-center mb-4'>
                <h5 className='mb-0'>Revenue Overview</h5>
                <select className='form-select' style={{ width: 'auto' }}>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>
          <div className='col-md-4'>
            <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-100'>
              <div className='d-flex justify-content-between align-items-center mb-4'>
                <h5 className='mb-0'>Popular Items</h5>
                <select className='form-select' style={{ width: 'auto' }}>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
                </select>
              </div>
              {/* Add popular items list here */}
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100'>
          <div className='p-6 border-bottom border-gray-100'>
            <div className='d-flex justify-content-between align-items-center'>
              <h5 className='mb-0'>Recent Orders</h5>
              <button className='btn btn-primary btn-sm'>View All</button>
            </div>
          </div>
          <div className='table-responsive'>
            <table className='table table-hover mb-0'>
              <thead>
                <tr className='bg-gradient-to-r from-[#ff4d4d] to-[#ff6b6b] text-white'>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>ORDER ID</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>CUSTOMER</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>ITEMS</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>TOTAL</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>STATUS</th>
                  <th className='px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider'>ACTION</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                <tr className='hover:bg-blue-50 transition-colors'>
                  <td className='px-6 py-4'>#ORD-7829</td>
                  <td className='px-6 py-4'>
                    <div className='d-flex align-items-center gap-2'>
                      <img
                        src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=32&h=32&q=80'
                        alt='Sarah Johnson'
                        className='rounded-circle'
                        width='32'
                        height='32'
                      />
                      Sarah Johnson
                    </div>
                  </td>
                  <td className='px-6 py-4'>3 items</td>
                  <td className='px-6 py-4'>$84.50</td>
                  <td className='px-6 py-4'>
                    <span className='status-badge status-processing'>Processing</span>
                  </td>
                  <td className='px-6 py-4'>
                    <button className='btn btn-link btn-sm p-0'>View Details</button>
                  </td>
                </tr>
                <tr className='hover:bg-blue-50 transition-colors bg-gray-50'>
                  <td className='px-6 py-4'>#ORD-7828</td>
                  <td className='px-6 py-4'>
                    <div className='d-flex align-items-center gap-2'>
                      <img
                        src='https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=32&h=32&q=80'
                        alt='Mike Peters'
                        className='rounded-circle'
                        width='32'
                        height='32'
                      />
                      Mike Peters
                    </div>
                  </td>
                  <td className='px-6 py-4'>2 items</td>
                  <td className='px-6 py-4'>$32.25</td>
                  <td className='px-6 py-4'>
                    <span className='status-badge status-completed'>Completed</span>
                  </td>
                  <td className='px-6 py-4'>
                    <button className='btn btn-link btn-sm p-0'>View Details</button>
                  </td>
                </tr>
                <tr className='hover:bg-blue-50 transition-colors'>
                  <td className='px-6 py-4'>#ORD-7827</td>
                  <td className='px-6 py-4'>
                    <div className='d-flex align-items-center gap-2'>
                      <img
                        src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=32&h=32&q=80'
                        alt='Emily Wilson'
                        className='rounded-circle'
                        width='32'
                        height='32'
                      />
                      Emily Wilson
                    </div>
                  </td>
                  <td className='px-6 py-4'>1 item</td>
                  <td className='px-6 py-4'>$18.99</td>
                  <td className='px-6 py-4'>
                    <span className='status-badge status-cancelled'>Cancelled</span>
                  </td>
                  <td className='px-6 py-4'>
                    <button className='btn btn-link btn-sm p-0'>View Details</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
