import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='max-w-md w-full text-center'>
        <div className='mb-8'>
          <div className='text-6xl font-bold text-blue-600 mb-4'>404</div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>Page Not Found</h1>
          <p className='text-gray-600'>Oops! The page you're looking for doesn't exist or has been moved.</p>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link to='/' className='inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all'>
            <Home size={20} />
            Back to Home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className='inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all'
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        <div className='mt-12'>
          <p className='text-gray-600 mb-4'>Looking for something specific?</p>
          <div className='flex flex-col gap-2'>
            <Link to='/contact' className='text-blue-600 hover:text-blue-700 font-medium'>
              Contact Us
            </Link>
          </div>
        </div>

        <div className='mt-12 pt-12 border-t border-gray-200'>
          <p className='text-gray-500 text-sm'>
            If you believe this is a mistake, please{' '}
            <Link to='/contact' className='text-blue-600 hover:text-blue-700'>
              contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
