import { useMutation } from "@tanstack/react-query";
import type { RegisterInput } from "./register.schema";
import { register } from "./register.api";
import { toast } from "sonner";
import { authBreadcrumbs } from "@/shared/lib/sentry/sentry-breadcrumbs";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterInput) => register(data),
    onMutate: () => {
      authBreadcrumbs("User registration started");
    },
    onSuccess: (data) => {
      authBreadcrumbs("User registration successful", {
        userId: data.user.id,
        email: data.user.email,
      });
      toast.success("Account created successfully");
    },
    onError: (error) => {
      authBreadcrumbs("User registration failed");
      toast.error(error.message);
    },
  });
};
