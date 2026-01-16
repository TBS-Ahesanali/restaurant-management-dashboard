import React, { useContext } from 'react';
import AuthContext from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RestaurantPending: React.FC = () => {
  const { restaurant } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className='auth-container d-flex align-items-center justify-content-center' style={{ minHeight: '100vh' }}>
      <div className='partner-login'>
        <div className='partner-login__overlay' />
        <div className='partner-login__container'>
          <div className='card shadow-lg' style={{ maxWidth: '600px', width: '100%' }}>
            <div className='card-body text-center p-5'>
              {/* Pending Icon */}
              <div className='mb-4'>
                <svg width='80' height='80' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' style={{ color: '#ffa500' }}>
                  <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' />
                  <path d='M12 6v6l4 2' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
                </svg>
              </div>

              {/* Title */}
              <h2 className='mb-3' style={{ fontWeight: 'bold', color: '#333' }}>
                Application Under Review
              </h2>

              {/* Restaurant Name */}
              {restaurant?.restaurant_name && (
                <h5 className='mb-4' style={{ color: '#666' }}>
                  {restaurant.restaurant_name}
                </h5>
              )}

              {/* Description */}
              <p className='text-muted mb-4' style={{ fontSize: '16px', lineHeight: '1.6' }}>
                Thank you for submitting your restaurant application. Our team is currently reviewing your information and documents.
              </p>

              {/* Status Badge */}
              <div className='mb-4'>
                <span className='badge bg-warning text-dark' style={{ fontSize: '14px', padding: '10px 20px' }}>
                  Status: Pending Approval
                </span>
              </div>

              {/* Additional Info */}
              <div className='alert alert-info' role='alert'>
                <strong>What's Next?</strong>
                <ul className='text-start mt-3 mb-0' style={{ listStyle: 'none', paddingLeft: 0 }}>
                  <li className='mb-2'>✓ Our team will verify your documents</li>
                  <li className='mb-2'>✓ You will receive an email notification once approved</li>
                  <li className='mb-2'>✓ This process typically takes 24-48 hours</li>
                </ul>
              </div>

              {/* Contact Info */}
              <p className='text-muted mt-4' style={{ fontSize: '14px' }}>
                Need help? Contact us at{' '}
                <a href='mailto:support@swiggy.com' className='text-primary'>
                  support@swiggy.com
                </a>
              </p>

              {/* Logout Button */}
              <button
                className='btn btn-outline-secondary mt-3'
                onClick={() => {
                  localStorage.removeItem('accessToken');
                  navigate('/partner-login');
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPending;
