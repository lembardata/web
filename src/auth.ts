import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { createAuthApiClient } from "./lib/api"

const loginSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/spreadsheets",
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const isRegister = credentials?.isRegister === 'true';
          
          if (isRegister) {
            // Handle registration
            const registerSchema = z.object({
              email: z.string().email(),
              password: z.string().min(8),
              firstName: z.string().min(1),
              lastName: z.string().min(1),
              company: z.string().optional(),
              jobTitle: z.string().optional(),
              plan: z.string().optional(),
              subscribeNewsletter: z.boolean().optional(),
            });
            
            const validatedFields = registerSchema.safeParse(credentials);
            
            if (!validatedFields.success) {
              return null;
            }

            const { email, password, firstName, lastName, company, jobTitle, plan, subscribeNewsletter } = validatedFields.data;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/register`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                email, 
                password, 
                name: `${firstName} ${lastName}`,
                company, 
                jobTitle, 
                plan, 
                subscribeNewsletter 
              }),
            });

            const data = await response.json();
            console.log('Register response:', data);
            
            if (!response.ok) {
              console.error('Register failed:', data);
              throw new Error(data.message || 'Registrasi gagal');
            }
            
            if (data.access_token) {
              return {
                id: data.user?.id || data.id,
                email: data.user?.email || email,
                name: data.user?.name || `${firstName} ${lastName}`,
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
              };
            }

            throw new Error('Format response tidak valid');
          } else {
            // Handle login
            const validatedFields = loginSchema.safeParse(credentials);
            
            if (!validatedFields.success) {
              return null;
            }

            const { email, password } = validatedFields.data;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1//auth/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('Login response:', data);
            
            if (!response.ok) {
              console.error('Login failed:', data);
              throw new Error(data.message || 'Login gagal');
            }
            
            if (data.access_token) {
              return {
                id: data.user?.id || data.id,
                email: data.user?.email || email,
                name: data.user?.name || data.name,
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
              };
            }

            throw new Error('Format response tidak valid');
          }
        } catch (error) {
          console.error('Auth error:', error);
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
              id: user.id || account.providerAccountId,
              email: user.email!,
              name: user.name,
            },
          }
        } else {
          // For credentials login
          return {
            ...token,
            accessToken: (user as any).accessToken,
            refreshToken: (user as any).refreshToken,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
            },
          }
        }
      }

      // Return previous token if the access token has not expired yet
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        googleAccessToken: token.googleAccessToken,
        user: {
          ...session.user,
          id: token.user?.id || token.sub,
        },
      }
    },
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
  },
  debug: process.env.NODE_ENV === "development",
})

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    googleAccessToken?: string
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
    }
  }

  interface JWT {
    accessToken?: string
    refreshToken?: string
    googleAccessToken?: string
    user?: {
      id: string
      email: string
      name?: string
    }
  }
}