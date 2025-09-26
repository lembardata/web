import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createAuthApiClient } from "@/lib/api";
import type { LoginRequest, LoginResponse } from "@/types/api";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const authClient = createAuthApiClient();
          const response = await authClient.post<LoginResponse>("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          } as LoginRequest);

          const { user, access_token, refresh_token } = response.data;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            plan: user.plan,
            accessToken: access_token,
            refreshToken: refresh_token,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.plan = user.plan;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.user.id = token.sub!;
        session.user.subscription_plan = token.subscription_plan!;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
