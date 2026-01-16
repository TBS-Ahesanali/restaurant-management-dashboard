import { RouteObject } from 'react-router-dom';
import { PATHS, SESSION_PATHS } from './paths';
import AuthGuard from '../guards/AuthGuard';
// import UnAuthGuard from '../Guards/UnAuthGuard';
import AdminLayout from '../layouts/Admin';
import Dashboard from '../components/Dashboard';
import MenuManagement from '../components/menu/MenuManagement';
import BookingsPage from '../components/bookings/BookingsPage';
import DiscountsPage from '../components/discounts/DiscountsPage';
import UnAuthGuard from '../guards/UnAuthGuard';
import UnauthLayout from '../layouts/UnauthLayout';
import LoginForm from '../pages/authentication/LoginForm';
import ForgotPassword from '../pages/authentication/ForgotPassword';
import ResetPassword from '../pages/authentication/ResetPassword';
import OTPVerify from '../pages/authentication/OTPVerify';
import RegisterForm from '../pages/authentication/RegisterForm';
import LandingPage from '../pages/public/LandingPage';
import { authRoles } from '../guards/authRoles';
import NotFound from '../components/NotFound';
import ChangePasswordPage from '../components/profile/ChangePasswordPage';
import ProfilePage from '../components/profile/ProfilePage';
import OrdersPage from '../components/orders/OrdersPage';
import PartnerLoginPage from '../pages/authentication/partner-login/PartnerLoginPage';
import RestaurantOnboardingLayout from '../pages/authentication/partner-login/RestaurantOnboardingLayout';
import RestaurantPending from '../pages/authentication/partner-login/RestaurantPending';
import RestaurantsList from '../pages/restaurants/RestaurantsList';

const routes: RouteObject[] = [
  {
    element: (
      <AuthGuard allowedRoles={[authRoles.SUPER_ADMIN]}>
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      { path: PATHS.DASHBOARD, element: <Dashboard /> },
      { path: PATHS.RESTAURANTS, element: <RestaurantsList /> },
      { path: PATHS.MENU, element: <MenuManagement /> },
      { path: PATHS.BOOKINGS, element: <BookingsPage /> },
      { path: PATHS.DISCOUNTS, element: <DiscountsPage /> },
      { path: PATHS.ORDERS, element: <OrdersPage /> },
      { path: PATHS.CHANGEPASSWORD, element: <ChangePasswordPage /> },
      { path: PATHS.PROFILE, element: <ProfilePage /> },
      { path: PATHS.NOT_FOUND, element: <NotFound /> },
    ],
  },
  {
    element: (
      <UnAuthGuard>
        <UnauthLayout />
      </UnAuthGuard>
    ),
    children: [
      { path: '/', element: <LandingPage /> },
      { path: SESSION_PATHS.SIGNIN, element: <LoginForm /> },
      { path: SESSION_PATHS.SIGNUP, element: <RegisterForm /> },
      { path: SESSION_PATHS.PARTNER_LOGIN, element: <PartnerLoginPage /> },
      { path: SESSION_PATHS.FORGOT_PASSWORD, element: <ForgotPassword /> },
      { path: SESSION_PATHS.RESET_PASSWORD, element: <ResetPassword /> },
      { path: SESSION_PATHS.VERIFY_OTP, element: <OTPVerify /> },
      { path: PATHS.NOT_FOUND, element: <NotFound /> },
    ],
  },
  {
    path: SESSION_PATHS.RESTAURANT_INFORMATION,
    element: <RestaurantOnboardingLayout />,
  },
  {
    path: SESSION_PATHS.RESTAURANT_PENDING,
    element: <RestaurantPending />,
  },
];

export default routes;
