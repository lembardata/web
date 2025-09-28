"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import type {
  APIKey,
  CreateAPIKeyRequest,
  CreateAPIKeyResponse,
  ListAPIKeysResponse,
} from "@/types/api";

// Hook untuk membuat API key baru
export function useCreateAPIKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateAPIKeyRequest,
    ): Promise<CreateAPIKeyResponse> => {
      const response = await apiClient.post<CreateAPIKeyResponse>(
        "/user/api-keys",
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("API Key berhasil dibuat!");
      // Invalidate API keys list
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Gagal membuat API key";
      toast.error(message);
    },
  });
}

// Hook untuk mendapatkan daftar API keys
export function useAPIKeys() {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: async (): Promise<Omit<APIKey, "key">[]> => {
      const response =
        await apiClient.get<ListAPIKeysResponse>("/user/api-keys");
      return response.data.api_keys;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk menghapus API key
export function useDeleteAPIKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (keyId: string): Promise<void> => {
      await apiClient.delete(`/user/api-keys/${keyId}`);
    },
    onSuccess: () => {
      toast.success("API Key berhasil dihapus");
      // Invalidate API keys list
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Gagal menghapus API key";
      toast.error(message);
    },
  });
}

// Hook untuk regenerate API key
export function useRegenerateAPIKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (keyId: string): Promise<CreateAPIKeyResponse> => {
      const response = await apiClient.post<CreateAPIKeyResponse>(
        `/user/api-keys/${keyId}/regenerate`,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("API Key berhasil di-regenerate");
      // Invalidate API keys list
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Gagal regenerate API key";
      toast.error(message);
    },
  });
}
