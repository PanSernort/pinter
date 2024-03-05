import type { User } from "../../users/types/User";

export type AuthState = {
  user: User | undefined;
  error: string | undefined;
};

export type AuthReg = {
  name: string;
  email: string;
  password: string;
  cpassword: string;
};
export type AuthAuthoriza = Omit<AuthReg, "name" | "cpassword">;
