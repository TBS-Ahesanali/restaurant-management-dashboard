import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, User, AlertCircle, Shield } from 'lucide-react';
import { CustomerItem } from '../../redux/slices/customermanagementslice';

const ViewCustomerDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const customer = location.state?.customer as CustomerItem | null;

  if (!customer) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
        <div className='text-center'>
          <AlertCircle className='w-16 h-16 text-gray-400 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>Customer Not Found</h2>
          <p className='text-gray-600 mb-6'>The customer data is missing. Please go back and try again.</p>
          <button onClick={() => navigate('/customers')} className='px-6 py-3 bg-[#ff4d4d] text-white rounded-lg hover:bg-[#ff3333] transition-all font-medium'>
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const userRoles: { [key: number]: string } = {
    1: 'Admin',
    2: 'Restaurant Owner',
    3: 'Customer',
    4: 'Delivery Partner',
  };

  return (
    <div className='min-h-screen p-4 sm:p-6 lg:p-8'>
      <div className='max-w-full mx-auto'>
        {/* Header with Back Button */}
        <div className='mb-6'>
          <button onClick={() => navigate('/customers')} className='inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4 group'>
            <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
            <span>Back</span>
          </button>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Customer Details</h1>
        </div>

        {/* Main Content Card */}
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
          {/* Header Section with Avatar */}
          <div className='bg-gradient-to-r from-[#ff4d4d] to-[#ff6b6b] p-6 sm:p-8'>
            <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4'>
              {/* Avatar */}
              <div className='w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg'>
                {customer.full_name ? (
                  <span className='text-3xl font-bold text-[#ff4d4d]'>{customer.full_name.charAt(0).toUpperCase()}</span>
                ) : (
                  <User className='w-10 h-10 text-[#ff4d4d]' />
                )}
              </div>

              {/* Name & Status */}
              <div className='flex-1  sm:text-left'>
                <h2 className='text-2xl sm:text-3xl font-bold text-white mb-2'>{customer.full_name || '-'}</h2>
                <div className='flex flex-wrap gap-2 justify-center sm:justify-start'>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${customer.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                    {customer.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className='px-3 py-1.5 rounded-full text-sm font-semibold bg-white text-[#ff4d4d]'>
                    <Shield className='w-4 h-4 inline mr-1' />
                    {userRoles[customer.user_role] || 'Unknown Role'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className='p-6 sm:p-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Email */}
              <div className='bg-gray-50 rounded-xl p-4 border border-gray-200'>
                <div className='flex items-center gap-2 mb-2'>
                  <Mail className='w-5 h-5 text-[#ff4d4d]' />
                  <h3 className='text-sm font-semibold text-gray-600 uppercase tracking-wider'>Email Address</h3>
                </div>
                <p className='text-gray-900 font-medium break-all'>{customer.email || '-'}</p>
              </div>

              {/* Phone Number */}
              <div className='bg-gray-50 rounded-xl p-4 border border-gray-200'>
                <div className='flex items-center gap-2 mb-2'>
                  <Phone className='w-5 h-5 text-[#ff4d4d]' />
                  <h3 className='text-sm font-semibold text-gray-600 uppercase tracking-wider'>Phone Number</h3>
                </div>
                <p className='text-gray-900 font-medium'>{customer.phone_number || '-'}</p>
              </div>

              {/* Gender */}
              <div className='bg-gray-50 rounded-xl p-4 border border-gray-200'>
                <div className='flex items-center gap-2 mb-2'>
                  <User className='w-5 h-5 text-[#ff4d4d]' />
                  <h3 className='text-sm font-semibold text-gray-600 uppercase tracking-wider'>Gender</h3>
                </div>
                <p className='text-gray-900 font-medium capitalize'>{customer.gender || '-'}</p>
              </div>

              {/* Date of Birth */}
              <div className='bg-gray-50 rounded-xl p-4 border border-gray-200'>
                <div className='flex items-center gap-2 mb-2'>
                  <Calendar className='w-5 h-5 text-[#ff4d4d]' />
                  <h3 className='text-sm font-semibold text-gray-600 uppercase tracking-wider'>Date of Birth</h3>
                </div>
                <p className='text-gray-900 font-medium'>{formatDate(customer.dob)}</p>
              </div>
            </div>

            {/* Additional Info */}
            {/* <div className='mt-6 grid grid-cols-1 gap-4'>
              <div className='bg-blue-50 rounded-xl p-4 border border-blue-200'>
                <div className='flex items-start gap-3'>
                  <AlertCircle className='w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0' />
                  <div>
                    <h3 className='text-sm font-semibold text-blue-900 mb-1'>Account Information</h3>
                    <div className='text-sm text-blue-800 space-y-1'>
                      <p>
                        <strong>User ID:</strong> {customer.id}
                      </p>
                      <p>
                        <strong>Role:</strong> {userRoles[customer.user_role] || 'Unknown'}
                      </p>
                      <p>
                        <strong>Account Status:</strong> {customer.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Info Card */}
        {/* <div className='mt-6 bg-white rounded-lg border border-blue-200 p-4 shadow-sm'>
          <div className='flex items-start gap-3'>
            <AlertCircle className='w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0' />
            <p className='text-sm text-gray-700'>
              <strong className='text-gray-900'>Note:</strong> This is a read-only view of the customer details. For any modifications or account management, please contact the
              system administrator.
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ViewCustomerDetails;
