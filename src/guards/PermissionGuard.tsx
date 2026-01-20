// src/guards/PermissionGuard.tsx

import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { PATHS } from '../routes/paths';
import { hasPermission, PermissionModule } from '../utils/permissions';

interface PermissionGuardProps {
  requiredPermission: PermissionModule;
  children: ReactNode;
}

export const PermissionGuard = ({ requiredPermission, children }: PermissionGuardProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={PATHS.DASHBOARD} replace />;
  }

  const userRole = user.user_role?.toString();

  if (!userRole || !hasPermission(userRole, requiredPermission)) {
    // User doesn't have permission, redirect to dashboard
    return <Navigate to={PATHS.DASHBOARD} replace />;
  }

  return <>{children}</>;
};
