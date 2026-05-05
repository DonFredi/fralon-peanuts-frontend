"use client";
import { useMutation } from "@tanstack/react-query";
import type { LoginInput } from "./login.schema";
import { login } from "./login.api";
import { useAuthContext } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/utils/get-error-message";
import { authBreadcrumbs } from "@/shared/lib/sentry/sentry-breadcrumbs";

export const useLogin = () => {
  const { setSession } = useAuthContext();
  return useMutation({
    mutationFn: (data: LoginInput) => login(data),
    onMutate: () => {
      authBreadcrumbs("Login attempt started");
    },
    onSuccess: (data) => {
      authBreadcrumbs("Login successful", {
        userId: data.user.id,
        email: data.user.email,
      });
      setSession(data.user, data.accessToken);
      toast.success("Login successfull");
    },
    onError: (error) => {
      authBreadcrumbs("Login failed", {
        error: String(error),
      });
      toast.error(getErrorMessage(error));
    },
  });
};
