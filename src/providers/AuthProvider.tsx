"use client";
import * as Sentry from "@sentry/nextjs";
import { getCurrentUser } from "@/modules/auth/me/me.api";
import { refresh } from "@/modules/auth/refresh/refresh.api";
import type { User } from "@/modules/auth/shared/types";
import FullScreenLoader from "@/shared/components/layout/FullScreenLoader";
import { setAccessToken } from "@/shared/lib/api-client";
import { authBreadcrumbs } from "@/shared/lib/sentry/sentry-breadcrumbs";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setSession: (user: User, token: string) => void;
  clearSession: () => void;
  isInitialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const setSession = useCallback((user: User, token: string) => {
    authBreadcrumbs("Session set", {
      userId: user.id,
      email: user.email,
    });
    Sentry.setUser({
      userId: user.id,
      email: user.email,
    });
    setUser(user);
    setToken(token);
    setAccessToken(token);
  }, []);

  const clearSession = useCallback(() => {
    authBreadcrumbs("Session cleared");
    Sentry.setUser(null);
    setUser(null);
    setToken(null);
    setAccessToken(null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // try refresh
        const { accessToken } = await refresh();
        // store token
        setToken(accessToken);
        setAccessToken(accessToken);
        // fetch user
        const user = await getCurrentUser();
        setUser(user);
      } catch (error) {
        // not logged in or refresh expired
        console.log("auth error:", error);
        clearSession();
      } finally {
        setIsInitialized(true);
      }
    };
    initAuth();
  }, [clearSession]);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isAuthenticated: !!user, setSession, clearSession, isInitialized }}
    >
      {/* prevent flicker */}
      {!isInitialized ? <FullScreenLoader /> : children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within the AuthProvider");
  }
  return context;
};
