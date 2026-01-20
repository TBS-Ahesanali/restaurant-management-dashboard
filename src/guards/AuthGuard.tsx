// src/guards/AuthGuard.tsx

import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import useAuth from '../hooks/useAuth';
import { SESSION_PATHS } from '../routes/paths';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isInitialized, user, restaurant } = useAuth();
  const { pathname } = useLocation();

  // Prevent back navigation for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      window.history.pushState(null, '', window.location.href);

      const handlePopState = (e: PopStateEvent) => {
        window.history.pushState(null, '', window.location.href);
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isAuthenticated]);

  if (!isInitialized) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={SESSION_PATHS.SIGNIN} replace state={{ from: pathname }} />;
  }

  // Check if restaurant onboarding is incomplete
  if (restaurant) {
    console.log('restaurant:Auth ', restaurant);
    const status = restaurant.status;

    // If restaurant status is Draft, redirect to onboarding
    if (status === 'Draft') {
      return <Navigate to={SESSION_PATHS.RESTAURANT_INFORMATION} replace />;
    }

    // If restaurant status is Pending, redirect to pending page
    if (status === 'Pending') {
      return <Navigate to={SESSION_PATHS.RESTAURANT_PENDING} replace />;
    }
  }

  // User is authenticated and onboarding is complete
  return <>{children}</>;
};

export default AuthGuard;
