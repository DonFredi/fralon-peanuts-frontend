import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "./me.api";
import { useAuth } from "@/modules/auth/shared/hooks/useAuth";

export const useMe = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["profile"],
    queryFn: getCurrentUser,
    retry: false,
    enabled: !!isAuthenticated,
  });
};
