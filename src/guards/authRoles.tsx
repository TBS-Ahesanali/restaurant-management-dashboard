// src/guards/authRoles.ts

export const authRoles = {
  SUPER_ADMIN: 'Super Admin', // Role ID: 1
  RESTAURANT_MANAGER: 'Restaurant Manager', // Role ID: 2
} as const;

export type Role = (typeof authRoles)[keyof typeof authRoles];

// All available roles as an array
export const ALL_ROLES = Object.values(authRoles);
