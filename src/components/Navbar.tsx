import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu as MenuIcon, User, Settings, LogOut, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { PATHS } from '../routes/paths';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const { logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className='navbar navbar-expand-lg px-4 py-2'>
      <div className='d-flex justify-content-between align-items-center w-100'>
        <div className='d-flex align-items-center gap-3'>
          <button className='btn btn-icon' onClick={onToggleSidebar} aria-label='Toggle Menu'>
            <MenuIcon size={24} />
          </button>
          <div className='position-relative d-none d-md-block'>
            <Search size={20} className='position-absolute top-50 start-0 translate-middle-y ms-3 text-muted' />
            <input type='text' className='form-control ps-5' placeholder='Search...' style={{ width: '300px' }} />
          </div>
        </div>
        <div className='d-flex align-items-center gap-4'>
          <button className='btn position-relative'>
            <Bell size={20} />
            <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>3</span>
          </button>
          <div className='dropdown' ref={dropdownRef}>
            <button className='profile-button' onClick={() => setProfileOpen(!profileOpen)} aria-expanded={profileOpen} aria-haspopup='true'>
              <img
                src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=32&h=32&q=80'
                alt='Profile'
                className='rounded-circle'
                width='32'
                height='32'
              />
              <span className='fw-medium d-none d-md-inline'>John Admin</span>
            </button>
            <div className={`dropdown-menu ${profileOpen ? 'show' : ''}`} role='menu' aria-orientation='vertical'>
              <div className='dropdown-header'>
                <div className='d-flex align-items-center gap-2'>
                  <img
                    src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=32&h=32&q=80'
                    alt='Profile'
                    className='rounded-circle'
                    width='32'
                    height='32'
                  />
                  <div>
                    <h6 className='mb-0'>John Admin</h6>
                    <small className='text-muted'>admin@restaurant.com</small>
                  </div>
                </div>
              </div>
              <div className='dropdown-divider'></div>
              <Link to='/profile' className='dropdown-item' role='menuitem'>
                <User size={16} />
                <span>Profile</span>
              </Link>
              <Link to={PATHS.CHANGEPASSWORD} className='dropdown-item' role='menuitem'>
                <User size={16} />
                <span>Change Password</span>
              </Link>
              <Link to='/settings' className='dropdown-item' role='menuitem'>
                <Settings size={16} />
                <span>Settings</span>
              </Link>
              <Link to='/help' className='dropdown-item' role='menuitem'>
                <HelpCircle size={16} />
                <span>Help Center</span>
              </Link>
              <div className='dropdown-divider'></div>
              <button className='dropdown-item text-danger' role='menuitem' onClick={logout}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
