import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

interface AdminProps {
  children?: React.ReactNode;
}

const Admin: React.FC<AdminProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 991.98);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991.98) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 991.98) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className='app-wrapper'>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className={`content-wrapper ${sidebarOpen ? 'content-with-sidebar' : ''}`}>
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className='main-content' onClick={closeSidebar}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
