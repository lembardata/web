"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Email atau password salah");
      }

      if (result?.ok) {
        // Update session to get fresh data
        await update();
        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        throw new Error("Google login gagal");
      }

      if (result?.ok) {
        await update();
        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut({
        redirect: false,
      });

      toast.success("Logout berhasil");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Terjadi kesalahan saat logout");
    }
  };

  const refreshSession = async () => {
    try {
      await update();
    } catch (error) {
      console.error("Session refresh error:", error);
    }
  };

  return {
    // Session data
    user: session?.user,
    session,

    // Loading states
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",

    // Auth methods
    login,
    loginWithGoogle,
    logout,
    refreshSession,

    // Tokens (if available)
    accessToken: session?.accessToken,
    refreshToken: session?.refreshToken,
    googleAccessToken: session?.googleAccessToken,
  };
}
