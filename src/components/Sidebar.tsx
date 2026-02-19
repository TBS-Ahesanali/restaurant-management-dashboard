// src/components/Sidebar.tsx

import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Utensils, Tags, CalendarRange, ShoppingCart, Users, BarChart3, Bell, Settings, X, Palette } from 'lucide-react';
import { PATHS } from '../routes/paths';
import LOGO from '../assets/icons/Logo.svg';
import useAuth from '../hooks/useAuth';
import { hasPermission, PermissionModules } from '../utils/permissions';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  path: string;
  icon: React.ComponentType<{ size?: number | string }>;
  label: string;
  permission: string;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useAuth();
  const userRole = user?.user_role?.toString() || '';

  useEffect(() => {
    if (window.innerWidth <= 991.98) {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Define all navigation items with their permissions
  const navItems: NavItem[] = [
    {
      path: PATHS.DASHBOARD,
      icon: LayoutDashboard,
      label: 'Dashboard',
      permission: PermissionModules.DASHBOARD,
    },
    {
      path: PATHS.RESTAURANTS,
      icon: Utensils,
      label: 'Restaurants',
      permission: PermissionModules.RESTAURANTS,
    },
    {
      path: PATHS.MENU,
      icon: UtensilsCrossed,
      label: 'Menu Management',
      permission: PermissionModules.MENU_MANAGEMENT,
    },
    {
      path: PATHS.DISCOUNTS,
      icon: Tags,
      label: 'Discounts & Offers',
      permission: PermissionModules.DISCOUNTS_OFFERS,
    },
    {
      path: PATHS.BOOKINGS,
      icon: CalendarRange,
      label: 'Bookings',
      permission: PermissionModules.BOOKINGS,
    },
    {
      path: '/orders',
      icon: ShoppingCart,
      label: 'Orders',
      permission: PermissionModules.ORDERS,
    },
    {
      path: '/customers',
      icon: Users,
      label: 'Customers',
      permission: PermissionModules.CUSTOMERS,
    },
    {
      path: '/reports',
      icon: BarChart3,
      label: 'Reports',
      permission: PermissionModules.REPORTS,
    },
    {
      path: '/notifications',
      icon: Bell,
      label: 'Notifications',
      permission: PermissionModules.NOTIFICATIONS,
    },
    // {
    //   path: '/settings',
    //   icon: Settings,
    //   label: 'Settings',
    //   permission: PermissionModules.SETTINGS,
    // },
  ];

  // Filter nav items based on user permissions
  const allowedNavItems = navItems.filter((item) => hasPermission(userRole, item.permission as (typeof PermissionModules)[keyof typeof PermissionModules]));

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
          {allowedNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path} className='nav-link' onClick={onClose}>
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
