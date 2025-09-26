import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

export type SubscriptionPlan =
  | "free"
  | "starter"
  | "professional"
  | "pro"
  | "business"
  | "enterprise";
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      subscription_plan: SubscriptionPlan;
      timezone: string;
      email_verified: boolean;
      active: boolean;
      name?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    plan: SubscriptionPlan;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    role: string;
    email?: string;
    user_id?: string;
    subscription_plan?: SubscriptionPlan;
  }
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  plan: "free" | "starter" | "professional" | "business" | "enterprise";
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
