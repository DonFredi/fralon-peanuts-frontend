"use client";
import { useAuthContext } from "@/providers/AuthProvider";

export const useAuth = () => {
  const { user, isAuthenticated, isInitialized } = useAuthContext();
  return { user, isAuthenticated, isInitialized };
};
// readonly state
