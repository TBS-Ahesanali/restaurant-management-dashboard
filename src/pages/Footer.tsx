import { BsTwitterX } from 'react-icons/bs';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import LOGO from '../assets/icons/Logo.svg';

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className='bg-gray-900 text-gray-400 pt-20 pb-8'>
        <div className='container mx-auto px-4 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
            <div>
              <div className='flex items-center gap-2 mb-6'>
                {/* <ChefHat size={32} className='text-white' />
                <span className='text-2xl font-bold text-white'>Gourmet Haven</span> */}
                <img src={LOGO} alt='Food Logo' className='company-logo' />
              </div>
              <p className='mb-6'>Experience the art of fine dining in an elegant atmosphere.</p>
              <div className='flex gap-4'>
                <a href={`#`} className='w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 hover:text-white transition-colors'>
                  <BsTwitterX className='hover:text-white' />
                </a>
                <a href={`#`} className='w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors'>
                  <FaFacebookF />
                </a>
                <a href={`#`} className='w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors'>
                  <FaInstagram />
                </a>
              </div>
            </div>
            <div>
              <h4 className='text-white text-lg font-semibold mb-6'>Opening Hours</h4>
              <ul className='space-y-3'>
                <li>Monday - Friday: 11:00 AM - 11:00 PM</li>
                <li>Saturday - Sunday: 10:00 AM - 11:00 PM</li>
                <li>Happy Hour: 4:00 PM - 7:00 PM</li>
              </ul>
            </div>
            <div>
              <h4 className='text-white text-lg font-semibold mb-6'>Contact</h4>
              <ul className='space-y-3'>
                <li>123 Gourmet Street</li>
                <li>Culinary District, Food City</li>
                <li>+1 (555) 123-4567</li>
                <li>info@gourmethaven.com</li>
              </ul>
            </div>
            <div>
              <h4 className='text-white text-lg font-semibold mb-6'>Newsletter</h4>
              <p className='mb-4'>Subscribe to our newsletter for updates and special offers.</p>
              <form className='space-y-3'>
                <input
                  type='email'
                  placeholder='Enter your email'
                  className='w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                />
                <button className='w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>Subscribe</button>
              </form>
            </div>
          </div>
          <div className='border-t border-gray-800 mt-16 pt-8 text-center'>
            <p>&copy; 2024 Gourmet Haven. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
