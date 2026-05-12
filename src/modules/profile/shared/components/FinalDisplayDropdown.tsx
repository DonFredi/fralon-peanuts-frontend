"use client";
import { useAuth } from "@/modules/auth/shared/hooks/useAuth";
import { ProfileDropdown } from "./ProfileDropdown";
import { NoUserProfileDropdown } from "./NoUserProfileDropdown";

export default function FinalDisplayDropdown() {
  const { isInitialized, isAuthenticated } = useAuth();
  return <>{isInitialized && isAuthenticated ? <ProfileDropdown /> : <NoUserProfileDropdown />}</>;
}
