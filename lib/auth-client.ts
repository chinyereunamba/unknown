import { getSession, signIn, signOut } from "next-auth/react";

export const authClient = {
  getSession,
  signIn,
  signOut,
};
