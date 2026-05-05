import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "./reset-password.api";
import { toast } from "sonner";
import type { ResetPasswordRequest } from "./reset-password.types";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
    onSuccess: (data) => {
      console.log("register :", data);
      toast.success("Email sent successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
