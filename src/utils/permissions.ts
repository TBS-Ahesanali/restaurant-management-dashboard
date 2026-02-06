// src/types/permissions.ts

export const PermissionModules = {
  DASHBOARD: 'dashboard',
  RESTAURANTS: 'restaurants',
  VIEW_RESTAURANT_DETAILS: 'view_restaurant_details',
  MENU_MANAGEMENT: 'menu_management',
  DISCOUNTS_OFFERS: 'discounts_offers',
  BOOKINGS: 'bookings',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  REPORTS: 'reports',
  NOTIFICATIONS: 'notifications',
  SETTINGS: 'settings',
  PROFILE: 'profile',
  CHANGE_PASSWORD: 'change_password',
} as const;

export type PermissionModule = (typeof PermissionModules)[keyof typeof PermissionModules];

// Define which roles have access to which modules
export const RolePermissions: Record<string, PermissionModule[]> = {
  'Super Admin': [
    PermissionModules.DASHBOARD,
    PermissionModules.RESTAURANTS,
    // PermissionModules.VIEW_RESTAURANT_DETAILS,
    // PermissionModules.MENU_MANAGEMENT,
    // PermissionModules.DISCOUNTS_OFFERS,
    // PermissionModules.BOOKINGS,
    PermissionModules.ORDERS,
    PermissionModules.CUSTOMERS,
    PermissionModules.REPORTS,
    PermissionModules.NOTIFICATIONS,
    PermissionModules.SETTINGS,
    PermissionModules.PROFILE,
    PermissionModules.CHANGE_PASSWORD,
  ],
  'Restaurant Manager': [
    PermissionModules.DASHBOARD,
    // Restaurants module is excluded for restaurant role
    PermissionModules.MENU_MANAGEMENT,
    PermissionModules.DISCOUNTS_OFFERS,
    PermissionModules.BOOKINGS,
    PermissionModules.ORDERS,
    PermissionModules.CUSTOMERS,
    PermissionModules.REPORTS,
    PermissionModules.NOTIFICATIONS,
    PermissionModules.SETTINGS,
    PermissionModules.PROFILE,
    PermissionModules.CHANGE_PASSWORD,
  ],
};

// Helper function to check if a role has a specific permission
export const hasPermission = (userRole: string, permission: PermissionModule): boolean => {
  const rolePermissions = RolePermissions[userRole];
  if (!rolePermissions) return false;
  return rolePermissions.includes(permission);
};
