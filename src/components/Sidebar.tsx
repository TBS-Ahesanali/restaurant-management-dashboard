import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Utensils, Tags, CalendarRange, ShoppingCart, Users, BarChart3, Bell, Settings, X } from 'lucide-react';
import { PATHS } from '../routes/paths';
import LOGO from '../assets/icons/Logo.svg';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  useEffect(() => {
    if (window.innerWidth <= 991.98) {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${!isOpen ? 'sidebar-closed' : ''}`}>
        <div className='sidebar-header p-3 border-bottom d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center justify-content-center m-auto'>
            <img src={LOGO} alt='Food Logo' className='company-logo' />
          </div>
          <button className='btn btn-icon d-lg-none' onClick={onClose} aria-label='Close Menu'>
            <X size={24} />
          </button>
        </div>
        <nav className='nav flex-column mt-3'>
          <NavLink to={PATHS.DASHBOARD} className='nav-link' onClick={onClose}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to={PATHS.RESTAURANTS} className='nav-link' onClick={onClose}>
            <Utensils size={20} />
            <span>Restaurants</span>
          </NavLink>
          <NavLink to={PATHS.MENU} className='nav-link' onClick={onClose}>
            <UtensilsCrossed size={20} />
            <span>Menu Management</span>
          </NavLink>
          <NavLink to={PATHS.DISCOUNTS} className='nav-link' onClick={onClose}>
            <Tags size={20} />
            <span>Discounts & Offers</span>
          </NavLink>
          <NavLink to={PATHS.BOOKINGS} className='nav-link' onClick={onClose}>
            <CalendarRange size={20} />
            <span>Bookings</span>
          </NavLink>
          <NavLink to='/orders' className='nav-link' onClick={onClose}>
            <ShoppingCart size={20} />
            <span>Orders</span>
          </NavLink>
          <NavLink to='/customers' className='nav-link' onClick={onClose}>
            <Users size={20} />
            <span>Customers</span>
          </NavLink>
          <NavLink to='/reports' className='nav-link' onClick={onClose}>
            <BarChart3 size={20} />
            <span>Reports</span>
          </NavLink>
          <NavLink to='/notifications' className='nav-link' onClick={onClose}>
            <Bell size={20} />
            <span>Notifications</span>
          </NavLink>
          <NavLink to='/settings' className='nav-link' onClick={onClose}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
