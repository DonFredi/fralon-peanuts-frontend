import api from "@/shared/lib/api-client";
import type { LoginInput } from "./login.schema";
import type { ApiResponse } from "@/shared/types";
import { ApiCustomError } from "@/shared/errors/api-error";
import type { LoginDto } from "./login.types";

export const login = async (data: LoginInput): Promise<LoginDto> => {
  const response = await api.post<ApiResponse<LoginDto>>("/auth/login", data);
  if (!response.data.success) throw new ApiCustomError(response.data.message, response.data.statusCode);
  return response.data.payload;
};
