import type { User } from "../shared/types";

export type LoginDto = {
  user: User;
  accessToken: string;
};
