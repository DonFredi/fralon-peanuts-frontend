"use client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { logout } from "./logout.api";
import { useAuthContext } from "@/providers/AuthProvider";
import { queryClient } from "@/shared/lib/query-client";
import { getErrorMessage } from "@/shared/utils/get-error-message";
import { authBreadcrumbs } from "@/shared/lib/sentry/sentry-breadcrumbs";

export const useLogout = () => {
  const { clearSession } = useAuthContext();

  return useMutation({
    mutationFn: logout,
    onMutate: () => {
      authBreadcrumbs("Logout started");
    },
    onSuccess: (_data) => {
      authBreadcrumbs("Logout successful");
      clearSession();
      queryClient.clear();
      toast.success("Logout successful");
    },
    onError: (error) => {
      authBreadcrumbs("Logout failed", { error: String(error) });
      clearSession();
      queryClient.clear();
      toast.error(getErrorMessage(error));
    },
  });
};
