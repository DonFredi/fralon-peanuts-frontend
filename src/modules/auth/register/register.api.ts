"use server";
import type { RegisterInput } from "./register.schema";
import { ApiCustomError } from "@/shared/errors/api-error";
import type { RegisterDto } from "./register.types";
import { createClient } from "@/shared/lib/supabase/server";

export const register = async (data: RegisterInput): Promise<RegisterDto> => {
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { full_name: data.username },
    },
  });
  if (error) {
    console.log("register ;", error);
    throw new ApiCustomError("Error creating user", error.status ?? 500);
  }
  if (!authData.user) throw new ApiCustomError("Failed to register", 500);
  return authData.user;
};
