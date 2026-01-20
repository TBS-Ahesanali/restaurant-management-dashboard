// src/hooks/usePermission.ts

import { useMemo } from 'react';
import useAuth from './useAuth';
import { hasPermission as checkPermission } from '../utils/permissions';
import type { PermissionModule } from '../utils/permissions';

/**
 * Custom hook to check if the current user has a specific permission
 * @param permission - The permission module to check
 * @returns boolean indicating if user has the permission
 */
export const usePermission = (permission: PermissionModule): boolean => {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user) return false;
    const userRole = user.user_role?.toString();
    if (!userRole) return false;
    return checkPermission(userRole, permission);
  }, [user, permission]);
};

/**
 * Custom hook to check multiple permissions at once
 * @param permissions - Array of permission modules to check
 * @returns object with permission keys and boolean values
 */
export const usePermissions = (permissions: PermissionModule[]) => {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user) {
      return permissions.reduce((acc, perm) => ({ ...acc, [perm]: false }), {});
    }

    const userRole = user.user_role?.toString();
    if (!userRole) {
      return permissions.reduce((acc, perm) => ({ ...acc, [perm]: false }), {});
    }

    return permissions.reduce(
      (acc, perm) => ({
        ...acc,
        [perm]: checkPermission(userRole, perm),
      }),
      {},
    );
  }, [user, permissions]);
};

/**
 * Custom hook to get all permissions for the current user
 * @returns array of permission modules the user has access to
 */
export const useUserPermissions = (): PermissionModule[] => {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user) return [];
    const userRole = user.user_role?.toString();
    if (!userRole) return [];

    const { RolePermissions } = require('../utils/permissions');
    return RolePermissions[userRole] || [];
  }, [user]);
};
