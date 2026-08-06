import { ApiCustomError } from "@/shared/errors/api-error";
import type { LoginInput } from "./login.schema";
import type { LoginDto } from "./login.types";
import { supabase } from "@/shared/lib/supabase/client";

export const login = async (data: LoginInput): Promise<LoginDto> => {
  const { data: authData, error } = await supabase.auth.signInWithPassword({ ...data });
  if (error) throw new ApiCustomError(error.message, error.status ?? 500);
  return authData.user;
};
