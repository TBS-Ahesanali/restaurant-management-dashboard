import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { PATHS } from '../routes/paths';
import useAuth from '../hooks/useAuth';
import Header from '../pages/Header';
import Footer from '../pages/Footer';

interface UnAuthGuardProps {
  children: ReactNode;
}

const UnAuthGuard = ({ children }: UnAuthGuardProps) => {
  const { user } = useAuth(); // Get authentication status

  if (user) {
    return <Navigate to={PATHS.DASHBOARD} replace />;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default UnAuthGuard;
