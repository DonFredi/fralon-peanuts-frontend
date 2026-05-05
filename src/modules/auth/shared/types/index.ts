export type UserRoles = "admin" | "member" | "user";

export type User = {
  id: string;
  username: string;
  email: string;
  roles: UserRoles[];
};

/* export type ForgotPasswordDto = {
  email: string;
};
 */
