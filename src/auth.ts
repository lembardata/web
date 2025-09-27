import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import type { SubscriptionPlan } from "@/types/auth";

// import { createAuthApiClient } from "./lib/api";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/spreadsheets",
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isRegister: { label: "Register", type: "checkbox" },
      },
      async authorize(credentials, request) {
        console.log("credentials", credentials);
        try {
          const isRegister = credentials?.isRegister === "true";

          if (isRegister) {
            // Handle registration
            const registerSchema = z.object({
              email: z.string().email("Email tidak valid"),
              password: z.string().min(8, "Password minimal 8 karakter"),
              firstName: z.string().min(1, "Nama depan harus diisi"),
              lastName: z.string().min(1, "Nama belakang harus diisi"),
              company: z.string().optional(),
              jobTitle: z.string().optional(),
              plan: z.string().optional(),
              subscribeNewsletter: z.boolean().optional(),
            });

            const validatedFields = registerSchema.safeParse(credentials);

            if (!validatedFields.success) {
              return null;
            }

            const {
              email,
              password,
              firstName,
              lastName,
              company,
              jobTitle,
              plan,
              subscribeNewsletter,
            } = validatedFields.data;

            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email,
                  password,
                  name: `${firstName} ${lastName}`,
                  company,
                  jobTitle,
                  plan,
                  subscribeNewsletter,
                }),
              },
            );

            const data = await response.json();
            console.log("Register response:", data);

            if (!response.ok) {
              console.error("Register failed:", data);
              throw new Error(data.message || "Registrasi gagal");
            }

            if (data.access_token) {
              return {
                id: data.user?.id || data.id,
                email: data.user?.email || email,
                name: data.user?.name || `${firstName} ${lastName}`,
                plan: ((data.user?.plan ?? "free") as SubscriptionPlan),
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
              };
            }

            throw new Error("Format response tidak valid");
          } else {
            // Handle login
            const validatedFields = loginSchema.safeParse(credentials);

            if (!validatedFields.success) {
              return null;
            }

            const { email, password } = validatedFields.data;

            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
              },
            );

            const data = await response.json();
            console.log("Login response:", data);

            if (!response.ok) {
              console.error("Login failed:", data);
              throw new Error(data.message || "Login gagal");
            }

            if (data.access_token) {
              return {
                id: data.user?.id || data.id,
                email: data.user?.email || email,
                name: data.user?.name || data.name,
                plan: ((data.user?.plan ?? "free") as SubscriptionPlan),
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
              };
            }

            throw new Error("Format response tidak valid");
          }
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        if (account.provider === "google") {
          // For Google OAuth, store Google access token for Sheets API
          return {
            ...token,
            googleAccessToken: account.access_token,
            user: {
              id: (user as any)?.id || (account as any)?.providerAccountId,
              email: (user as any)?.email!,
              name: (user as any)?.name,
            },
          };
        } else {
          // For credentials login
          return {
            ...token,
            accessToken: (user as any).accessToken,
            refreshToken: (user as any).refreshToken,
            user: {
              id: (user as any)?.id,
              email: (user as any)?.email,
              name: (user as any)?.name,
            },
          };
        }
      }

      // Return previous token if the access token has not expired yet
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: (token as any).accessToken,
        refreshToken: (token as any).refreshToken,
        googleAccessToken: (token as any).googleAccessToken,
        user: {
          ...(session.user as any),
          id: (token as any)?.user?.id || (token as any)?.sub,
        },
      } as any;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
});

// NOTE: Augmentasi tipe untuk next-auth sudah didefinisikan di src/types/auth.ts
// Menghindari duplikasi deklarasi di file ini untuk mencegah konflik tipe.
