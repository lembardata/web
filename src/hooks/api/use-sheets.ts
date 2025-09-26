"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import type {
  CreateSpreadsheetRequest,
  CreateSpreadsheetResponse,
  ReadSpreadsheetRequest,
  ReadSpreadsheetResponse,
  WriteSpreadsheetRequest,
  WriteSpreadsheetResponse,
  Spreadsheet,
} from "@/types/api";

// Hook untuk membuat spreadsheet baru
export function useCreateSpreadsheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateSpreadsheetRequest,
    ): Promise<CreateSpreadsheetResponse> => {
      const response = await apiClient.post<CreateSpreadsheetResponse>(
        "/sheets/create",
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Spreadsheet berhasil dibuat!");
      // Invalidate spreadsheets list
      queryClient.invalidateQueries({ queryKey: ["spreadsheets"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error || "Gagal membuat spreadsheet";
      toast.error(message);
    },
  });
}

// Hook untuk mendapatkan daftar spreadsheets user
export function useSpreadsheets() {
  return useQuery({
    queryKey: ["spreadsheets"],
    queryFn: async (): Promise<Spreadsheet[]> => {
      const response = await apiClient.get<Spreadsheet[]>("/sheets");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk membaca data dari spreadsheet
export function useReadSpreadsheet(spreadsheetId: string) {
  return useMutation({
    mutationFn: async (
      data: ReadSpreadsheetRequest,
    ): Promise<ReadSpreadsheetResponse> => {
      const response = await apiClient.post<ReadSpreadsheetResponse>(
        `/sheets/${spreadsheetId}/read`,
        data,
      );
      return response.data;
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error || "Gagal membaca data spreadsheet";
      toast.error(message);
    },
  });
}

// Hook untuk menulis data ke spreadsheet
export function useWriteSpreadsheet(spreadsheetId: string) {
  return useMutation({
    mutationFn: async (
      data: WriteSpreadsheetRequest,
    ): Promise<WriteSpreadsheetResponse> => {
      const response = await apiClient.post<WriteSpreadsheetResponse>(
        `/sheets/${spreadsheetId}/write`,
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(
        `Berhasil menulis ${data.updated_cells} sel ke spreadsheet`,
      );
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error || "Gagal menulis data ke spreadsheet";
      toast.error(message);
    },
  });
}

// Hook untuk mendapatkan detail spreadsheet
export function useSpreadsheet(id: string) {
  return useQuery({
    queryKey: ["spreadsheet", id],
    queryFn: async (): Promise<Spreadsheet> => {
      const response = await apiClient.get<Spreadsheet>(`/sheets/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
