"use client";
import * as Sentry from "@sentry/nextjs";
import FullScreenLoader from "@/shared/components/layout/FullScreenLoader";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/shared/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { ProfileWithAddresses } from "@/modules/profile/account/me/update-profile/update-profile.types";

type AuthContextType = {
  user: SupabaseUser | null;
  profile: ProfileWithAddresses | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<ProfileWithAddresses | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*,addresses(*)")
        .eq("id", userId)
        .eq("addresses.is_default", true)
        .single<ProfileWithAddresses>();

      if (error) {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
      setProfile(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const handleAuthError = (error: unknown) => {
      console.error("Auth initialization failed", error);
      Sentry.captureException(error);
      if (!isMounted) return;

      setUser(null);
      setProfile(null);
      setIsInitialized(true);
      toast.error("We couldn't verify your session right now. You can keep browsing as a guest.");
    };

    const initAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!isMounted) return;

        setUser(user);
        if (user) {
          await fetchProfile(user.id);
          Sentry.setUser({ id: user.id, email: user.email });
        } else {
          setProfile(null);
          Sentry.setUser(null);
        }
      } catch (error) {
        handleAuthError(error);
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    void initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      setUser(session?.user ?? null);
      if (session?.user) {
        void fetchProfile(session.user.id);
        Sentry.setUser({ id: session.user.id, email: session.user.email });
      } else {
        setProfile(null);
        Sentry.setUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, isAuthenticated: !!user, isInitialized }}>
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
