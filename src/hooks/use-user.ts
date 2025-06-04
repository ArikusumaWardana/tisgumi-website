"use client";

import { useContext, createContext } from "react";
import { User } from "lucia";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
});

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Role-based permission hooks
export function useCanCreateOrEdit(): boolean {
  const { user } = useUser();
  if (!user) return false;
  return user.role === "superadmin";
}

export function useCanDelete(): boolean {
  const { user } = useUser();
  if (!user) return false;
  return user.role === "superadmin";
}

export function useCanViewActions(): boolean {
  const { user } = useUser();
  if (!user) return false;
  return user.role === "superadmin";
}
