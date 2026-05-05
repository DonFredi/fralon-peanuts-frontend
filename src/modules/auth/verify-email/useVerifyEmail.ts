import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "./verify-email.api";
import { toast } from "sonner";

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
    onSuccess: (data) => {
      console.log("register :", data);
      toast.success("Email verification successful");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
