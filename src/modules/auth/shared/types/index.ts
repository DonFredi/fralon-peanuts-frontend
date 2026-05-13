export type UserRoles = "admin" | "member" | "user";

export type User = {
  _id: string;
  username: string;
  email: string;
  roles: UserRoles[];
};

/* export type ForgotPasswordDto = {
  email: string;
};
 */
