import { connectDB, usersModel } from "@/database";
import { NextAuthUserSession } from "@/types/apiTypes";
import { ROLES_LIST } from "@/utils/constants";
import { User } from "next-auth";

type ExtendedUser = User & NextAuthUserSession;

export async function jwtCallback(token: any, user: any, account: any, trigger: any, session: any) {
  if (trigger === "update") {
    // Handle both direct field updates and nested user object updates
    const updatedFields = session?.user ? session.user : session;
    return {
      ...token,
      ...updatedFields,
      // Ensure critical fields aren't overwritten if not provided
      id: updatedFields?.id ?? token.id,
      name: updatedFields?.name ?? token.name,
      email: updatedFields?.email ?? token.email,
      role: updatedFields?.role ?? token.role,
    };
  }

  if (account?.provider === "google" || account?.provider === "facebook") {
    try {
      await connectDB();

      const user = await usersModel.findUserByOAuth(account.provider, account.providerAccountId);

      if (user) {
        // Get avatar if user is Admin or Author
        const userAvatar = [ROLES_LIST.Admin, ROLES_LIST.Author].includes(user.role)
          ? await usersModel.findUserAvatar(user.user_id)
          : null;

        return {
          ...token,
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: userAvatar,
        };
      }
    } catch (error) {
      console.error("JWT callback error:", error);
    }
  }

  if (user) {
    const extendedUser = user as ExtendedUser;

    return {
      ...token,
      id: extendedUser.id,
      name: extendedUser.name,
      email: extendedUser.email,
      role: extendedUser.role,
      avatar: extendedUser.avatar,
    };
  }

  return token;
}
