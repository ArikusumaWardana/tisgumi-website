import { Role } from "@prisma/client";

// Client-side utility functions for role-based access control
export function canCreateOrEditClient(userRole: Role): boolean {
  return userRole === "superadmin";
}

export function canDeleteClient(userRole: Role): boolean {
  return userRole === "superadmin";
}

export function canViewActionsClient(userRole: Role): boolean {
  return userRole === "superadmin";
}
