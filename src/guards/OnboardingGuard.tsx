// src/guards/OnboardingGuard.tsx

import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import useAuth from '../hooks/useAuth';
import { SESSION_PATHS, PATHS } from '../routes/paths';

interface OnboardingGuardProps {
  children: ReactNode;
}

const OnboardingGuard = ({ children }: OnboardingGuardProps) => {
  const { restaurant, isAuthenticated } = useAuth();
  const location = useLocation();
  const accessToken = location.state?.token || localStorage.getItem('accessToken');

  // If no token in state or localStorage, redirect to login
  if (!accessToken) {
    return <Navigate to={SESSION_PATHS.PARTNER_LOGIN} replace />;
  }

  // If restaurant data is not loaded yet, show loader
  // if (!isRestaurantLoaded) {
  //   return <Loader />;
  // }

  // Check restaurant status and redirect accordingly
  if (restaurant) {
    const status = restaurant.status;

    console.log('OnboardingGuard - Restaurant Status:', status);

    // If status is Pending, redirect to pending page
    if (status === 'Pending') {
      return <Navigate to={SESSION_PATHS.RESTAURANT_PENDING} replace />;
    }

    // If status is Complete or Approved, redirect to dashboard
    if (status === 'Complete' || status === 'Approved') {
      if (isAuthenticated) {
        return <Navigate to={PATHS.DASHBOARD} replace />;
      }
    }

    // If status is Draft, allow access to onboarding
    if (status === 'Draft') {
      console.log('Allowing access to onboarding');
      return <>{children}</>;
    }
  }

  // Default: allow access
  console.log('OnboardingGuard - Default access granted');
  return <>{children}</>;
};

export default OnboardingGuard;
