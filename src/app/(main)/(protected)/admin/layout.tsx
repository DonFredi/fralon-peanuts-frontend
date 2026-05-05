"use client";
import { requireRoles } from "@/modules/auth/shared/guards/require-roles";
import { useAuth } from "@/modules/auth/shared/hooks/useAuth";
import FullScreenLoader from "@/shared/components/layout/FullScreenLoader";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitialized, user } = useAuth();

  if (!isInitialized) return <FullScreenLoader />;
  // Not logged in
  if (!user) {
    redirect("/auth/login");
  }
  // Logged in but not admin
  if (isAuthenticated && !requireRoles(user.roles, ["admin"])) {
    redirect("/unauthorized");
  }
  return <>{children}</>;
}
