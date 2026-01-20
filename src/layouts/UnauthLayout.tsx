// src/layouts/UnauthLayout.tsx

import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../pages/public/Header';
import Footer from '../pages/public/Footer';

interface UnauthLayoutProps {
  children?: ReactNode;
}

const UnauthLayout = ({ children }: UnauthLayoutProps) => {
  return (
    <div className='unauth-layout'>
      <Header />
      <main className='unauth-content'>{children || <Outlet />}</main>
      <Footer />
    </div>
  );
};

export default UnauthLayout;
