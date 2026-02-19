// src/routes/routes.tsx

import { RouteObject } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { PATHS, SESSION_PATHS } from './paths';
import AuthGuard from '../guards/AuthGuard';
import UnAuthGuard from '../guards/UnAuthGuard';
import OnboardingGuard from '../guards/OnboardingGuard';
import { PermissionGuard } from '../guards/PermissionGuard';
import { PermissionModules } from '../utils/permissions';
import AdminLayout from '../layouts/Admin';
import UnauthLayout from '../layouts/UnauthLayout';
import Loader from '../components/Loader';
import ViewRestaurantDetails from '../pages/restaurants/ViewRestaurantDetails';
import ViewCustomerDetails from '../pages/customers/Viewcustomerdetails';

// Lazy load components
const Dashboard = lazy(() => import('../components/Dashboard'));
const RestaurantsList = lazy(() => import('../pages/restaurants/RestaurantsList'));
const CustomersList = lazy(() => import('../pages/customers/Customerslist'));
const MenuManagement = lazy(() => import('../pages/menuManagement'));
const BookingsPage = lazy(() => import('../components/bookings/BookingsPage'));
const DiscountsPage = lazy(() => import('../components/discounts/DiscountsPage'));
const OrdersPage = lazy(() => import('../pages/orders/OrdersPage'));
const ViewOrderDetails = lazy(() => import('../pages/orders/ViewOrderDetails'));
const ChangePasswordPage = lazy(() => import('../components/profile/ChangePasswordPage'));
const ProfilePage = lazy(() => import('../components/profile/ProfilePage'));
const NotFound = lazy(() => import('../components/NotFound'));

const LoginForm = lazy(() => import('../pages/authentication/LoginForm'));
const RegisterForm = lazy(() => import('../pages/authentication/RegisterForm'));
const PartnerLoginPage = lazy(() => import('../pages/authentication/partner-login/PartnerLoginPage'));
const ForgotPassword = lazy(() => import('../pages/authentication/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/authentication/ResetPassword'));
const OTPVerify = lazy(() => import('../pages/authentication/OTPVerify'));
const LandingPage = lazy(() => import('../pages/public/LandingPage'));
const RestaurantOnboardingLayout = lazy(() => import('../pages/authentication/partner-login/RestaurantOnboardingLayout'));
const RestaurantPending = lazy(() => import('../pages/authentication/partner-login/RestaurantPending'));

const renderFallback = () => <Loader />;

const routes: RouteObject[] = [
  // Protected Routes with Permissions
  {
    element: (
      <AuthGuard>
        <AdminLayout>
          <Suspense fallback={renderFallback()}>
            <Outlet />
          </Suspense>
        </AdminLayout>
      </AuthGuard>
    ),
    children: [
      {
        path: PATHS.DASHBOARD,
        element: (
          <PermissionGuard requiredPermission={PermissionModules.DASHBOARD}>
            <Dashboard />
          </PermissionGuard>
        ),
      },
      {
        path: PATHS.RESTAURANTS,
        element: (
          <PermissionGuard requiredPermission={PermissionModules.RESTAURANTS}>
            <RestaurantsList />
          </PermissionGuard>
        ),
      },
      {
        path: PATHS.VIEW_RESTAURANT_DETAILS,
        element: (
          <PermissionGuard requiredPermission={PermissionModules.RESTAURANTS}>
            <ViewRestaurantDetails />
          </PermissionGuard>
        ),
      },
      {
        path: PATHS.CUSTOMERS,
        element: (
          <PermissionGuard requiredPermission={PermissionModules.CUSTOMERS}>
            <CustomersList />
          </PermissionGuard>
        ),
      },
      {
        path: PATHS.VIEW_CUSTOMER_DETAILS,
        element: (
          <PermissionGuard requiredPermission={PermissionModules.CUSTOMERS}>
            <ViewCustomerDetails />
          </PermissionGuard>
        ),
      },
      {
        path: PATHS.MENU,
        element: (
          <PermissionGuard requiredPermission={PermissionModules.MENU_MANAGEMENT}>
            <MenuManagement />
          </PermissionGuard>
        ),
      },
      {
        path: PATHS.BOOKINGS,
        element: (
          <PermissionGuard requiredPermission={PermissionModules.BOOKINGS}>
            <BookingsPage />
          </PermissionGuard>
        ),
      },
      {
        path: PATHS.DISCOUNTS,
        element: (
          <PermissionGuard requiredPermission={PermissionModules.DISCOUNTS_OFFERS}>
            <DiscountsPage />
          </PermissionGuard>
        ),
      },
      {
        path: PATHS.ORDERS,
        element: (
          <PermissionGuard requiredPermission={PermissionModules.ORDERS}>
            <OrdersPage />
          </PermissionGuard>
        ),
      },
      {
        path: PATHS.VIEW_ORDER_DETAILS,
        element: (
          <PermissionGuard requiredPermission={PermissionModules.ORDERS}>
            <ViewOrderDetails />
          </PermissionGuard>
        ),
      },
      {
        path: '/reports',
        element: (
          <PermissionGuard requiredPermission={PermissionModules.REPORTS}>
            <div>Reports Page (To be created)</div>
          </PermissionGuard>
        ),
      },
      {
        path: '/notifications',
        element: (
          <PermissionGuard requiredPermission={PermissionModules.NOTIFICATIONS}>
            <div>Notifications Page (To be created)</div>
          </PermissionGuard>
        ),
      },
      {
        path: '/settings',
        element: (
          <PermissionGuard requiredPermission={PermissionModules.SETTINGS}>
            <div>Settings Page (To be created)</div>
          </PermissionGuard>
        ),
      },
      {
        path: PATHS.PROFILE,
        element: (
          <PermissionGuard requiredPermission={PermissionModules.PROFILE}>
            <ProfilePage />
          </PermissionGuard>
        ),
      },
      {
        path: PATHS.CHANGEPASSWORD,
        element: (
          <PermissionGuard requiredPermission={PermissionModules.CHANGE_PASSWORD}>
            <ChangePasswordPage />
          </PermissionGuard>
        ),
      },
      {
        path: PATHS.NOT_FOUND,
        element: <NotFound />,
      },
    ],
  },

  // Public/Unauthenticated Routes
  {
    element: (
      <UnAuthGuard>
        <UnauthLayout>
          <Suspense fallback={renderFallback()}>
            <Outlet />
          </Suspense>
        </UnauthLayout>
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

  // Restaurant Onboarding Routes (Protected with OnboardingGuard)
  {
    path: SESSION_PATHS.RESTAURANT_INFORMATION,
    element: (
      <OnboardingGuard>
        <Suspense fallback={renderFallback()}>
          <RestaurantOnboardingLayout />
        </Suspense>
      </OnboardingGuard>
    ),
  },
  {
    path: SESSION_PATHS.RESTAURANT_PENDING,
    element: (
      <Suspense fallback={renderFallback()}>
        <RestaurantPending />
      </Suspense>
    ),
  },

  // Catch-all 404
  {
    path: '*',
    element: (
      <Suspense fallback={renderFallback()}>
        <NotFound />
      </Suspense>
    ),
  },
];

export default routes;
