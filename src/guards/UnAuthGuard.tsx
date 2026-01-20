// src/guards/UnAuthGuard.tsx

import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { PATHS } from '../routes/paths';
import useAuth from '../hooks/useAuth';

interface UnAuthGuardProps {
  children: ReactNode;
}

const UnAuthGuard = ({ children }: UnAuthGuardProps) => {
  const { user, isAuthenticated } = useAuth();

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated && user) {
    return <Navigate to={PATHS.DASHBOARD} replace />;
  }

  // User is not authenticated, render children (public pages)
  return <>{children}</>;
};

export default UnAuthGuard;
