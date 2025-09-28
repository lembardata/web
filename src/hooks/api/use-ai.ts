"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import type {
  AIStatsResponse,
  CreateAIQueryRequest,
  CreateAIQueryResponse,
  GetQueriesResponse,
} from "@/types/api";

// Hook untuk membuat AI query baru
export function useCreateAIQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateAIQueryRequest,
    ): Promise<CreateAIQueryResponse> => {
      const response = await apiClient.post<CreateAIQueryResponse>(
        "/ai/generate",
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Query AI berhasil diproses!");
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["ai-queries"] });
      queryClient.invalidateQueries({ queryKey: ["ai-stats"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Gagal memproses query AI";
      toast.error(message);
    },
  });
}

// Hook untuk mendapatkan riwayat AI queries
export function useAIQueries({
  page = 1,
  limit = 10,
  query_type,
}: {
  page?: number;
  limit?: number;
  query_type?: string;
} = {}) {
  return useQuery({
    queryKey: ["ai-queries", { page, limit, query_type }],
    queryFn: async (): Promise<GetQueriesResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(query_type && { query_type }),
      });

      const response = await apiClient.get<GetQueriesResponse>(
        `/ai/queries?${params}`,
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook untuk mendapatkan statistik AI usage
export function useAIStats() {
  return useQuery({
    queryKey: ["ai-stats"],
    queryFn: async (): Promise<AIStatsResponse> => {
      const response = await apiClient.get<AIStatsResponse>("/ai/stats");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk mendapatkan detail AI query berdasarkan ID
export function useAIQuery(id: string) {
  return useQuery({
    queryKey: ["ai-query", id],
    queryFn: async () => {
      const response = await apiClient.get(`/ai/queries/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
