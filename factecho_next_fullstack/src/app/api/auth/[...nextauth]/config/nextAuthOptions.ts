import { NextAuthUserSession } from "@/types/apiTypes";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

import { authorizeCredentials } from "../callbacks/authorizeCredentials";
import { jwtCallback } from "../callbacks/jwtCallback";
import { sessionCallback } from "../callbacks/sessionCallback";
import { signInCallback } from "../callbacks/signInCallback";

declare module "next-auth" {
  interface Session {
    user: NextAuthUserSession;
  }
}

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        return await authorizeCredentials(credentials);
      },
    }),
  ],

  callbacks: {
    async signIn({ account, profile }) {
      return await signInCallback(account, profile);
    },

    async jwt({ token, user, account, trigger, session }) {
      return await jwtCallback(token, user, account, trigger, session);
    },

    async session({ session, token }) {
      return await sessionCallback(session, token);
    },
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 7 * 24 * 60 * 60,
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 15 * 60,
  },

  pages: {
    signIn: "/sign-in",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
