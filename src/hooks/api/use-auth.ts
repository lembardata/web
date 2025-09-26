"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession, signIn, signOut } from "next-auth/react";
import { createAuthApiClient, apiClient } from "@/lib/api";
import { toast } from "sonner";
import type {
  RegisterRequest,
  RegisterResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  User,
} from "@/types/api";
import { register } from "module";

// Hook untuk mendapatkan session user
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: !!session,
    signOut: () => signOut({ callbackUrl: "/" }),
  };
}

// Hook untuk register user baru
export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterRequest): Promise<RegisterResponse> => {
      const authClient = createAuthApiClient();
      const response = await authClient.post<RegisterResponse>(
        "/auth/register",
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Registrasi berhasil! Silakan login.");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Registrasi gagal";
      toast.error(message);
    },
  });
}

// Hook untuk login (menggunakan NextAuth signIn)
export function useLogin() {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Login berhasil!");
    },
    onError: (error: any) => {
      toast.error("Email atau password salah");
    },
  });
}

// Hook untuk mendapatkan data user saat ini
export function useCurrentUser() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["current-user"],
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get<User>("/auth/me");
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk change password
export function useChangePassword() {
  return useMutation({
    mutationFn: async (
      data: ChangePasswordRequest,
    ): Promise<ChangePasswordResponse> => {
      const response = await apiClient.post<ChangePasswordResponse>(
        "/auth/change-password",
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password berhasil diubah");
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Gagal mengubah password";
      toast.error(message);
    },
  });
}
