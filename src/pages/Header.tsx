// src/components/Header.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import LOGO from '../assets/icons/Logo.svg';
import { SESSION_PATHS } from '../routes/paths';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className='container mx-auto px-4 lg:px-8'>
        <div className='flex items-center justify-between'>
          <Link to='/' className='flex items-center gap-2'>
            <img src={LOGO} alt='Food Logo' className='company-logo' />
          </Link>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center gap-8'>
            <Link to='/' className={`text-sm font-medium ${isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'}`}>
              Menu
            </Link>
            <Link to='/about' className={`text-sm font-medium ${isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'}`}>
              About
            </Link>
            <Link to='/contact' className={`text-sm font-medium ${isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'}`}>
              Contact
            </Link>
            <div className='flex items-center gap-4'>
              <Link
                to={SESSION_PATHS.SIGNIN}
                className={`px-4 py-2 text-sm font-medium rounded-lg bg-[#ff4d4d] ${isScrolled ? 'text-white  hover:text-gray-900' : 'text-white/90 hover:text-white'}`}
              >
                Login
              </Link>
              <Link
                to={SESSION_PATHS.PARTNER_LOGIN}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  isScrolled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-gray-900 hover:bg-gray-100'
                } transition-colors`}
              >
                Register
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className='md:hidden p-2' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <X className={isScrolled ? 'text-gray-900' : 'text-white'} size={24} />
            ) : (
              <Menu className={isScrolled ? 'text-gray-900' : 'text-white'} size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute left-0 right-0 top-full bg-white shadow-lg transition-all duration-300 ${
            isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <div className='px-4 py-6 space-y-4'>
            <Link to='/menu' className='block text-gray-700 hover:text-gray-900 font-medium'>
              Menu
            </Link>
            <Link to='/about' className='block text-gray-700 hover:text-gray-900 font-medium'>
              About
            </Link>
            <Link to='/contact' className='block text-gray-700 hover:text-gray-900 font-medium'>
              Contact
            </Link>
            <div className='pt-4 space-y-2'>
              <Link to='/login' className='block w-full px-4 py-2 text-center text-gray-700 hover:text-gray-900 font-medium rounded-lg border border-gray-300'>
                Login
              </Link>
              <Link to='/register' className='block w-full px-4 py-2 text-center text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg'>
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
