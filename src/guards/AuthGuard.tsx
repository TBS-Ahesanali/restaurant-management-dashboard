import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authRoles } from './authRoles';
import Loader from '../components/Loader';
import useAuth from '../hooks/useAuth';
import { PATHS, SESSION_PATHS } from '../routes/paths';

interface AuthGuardProps {
  allowedRoles?: string[];
  children: ReactNode;
}

const AuthGuard = ({ allowedRoles = [], children }: AuthGuardProps) => {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { pathname } = useLocation();

  const userRole = user?.user_role;
  console.log(isInitialized, 'isInitialized');

  if (!isInitialized) {
    return <Loader />;
  }

  if (isAuthenticated) {
    if (userRole && allowedRoles.includes(userRole.toString())) {
      return <>{children}</>;
    }

    const roleRedirects: Record<string, string> = {
      [authRoles.SUPER_ADMIN]: PATHS.DASHBOARD,
      [authRoles.USER]: PATHS.DASHBOARD,
    };

    return <Navigate to={userRole ? roleRedirects[userRole] || SESSION_PATHS.SIGNIN : SESSION_PATHS.SIGNIN} replace state={{ from: pathname }} />;
  }

  return <Navigate to={SESSION_PATHS.SIGNIN} replace state={{ from: pathname }} />;
};

export default AuthGuard;
