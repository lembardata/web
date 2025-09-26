"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateAIQuery } from "@/hooks/api";
import { aiQuerySchema, type AIQueryFormData } from "@/lib/validations";

interface AIQueryFormProps {
  onSuccess?: (result: any) => void;
}

export function AIQueryForm({ onSuccess }: AIQueryFormProps) {
  const createAIQueryMutation = useCreateAIQuery();

  const form = useForm<AIQueryFormData>({
    resolver: zodResolver(aiQuerySchema),
    defaultValues: {
      prompt: "",
      query_type: "formula",
      provider: "openai",
      language: "id",
      temperature: 0.7,
      max_tokens: 1000,
    },
  });

  const onSubmit = async (data: AIQueryFormData) => {
    try {
      const result = await createAIQueryMutation.mutateAsync(data);
      form.reset();
      onSuccess?.(result);
    } catch (error) {
      // Error handling sudah dilakukan di hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Buat Query AI Baru
        </CardTitle>
        <CardDescription>
          Gunakan AI untuk menganalisis, membuat formula, atau mengoptimalkan
          spreadsheet Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt / Pertanyaan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Contoh: Buatkan formula untuk menghitung total penjualan berdasarkan kategori produk..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="query_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe Query</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe query" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="formula">Formula</SelectItem>
                        <SelectItem value="analysis">Analisis</SelectItem>
                        <SelectItem value="explanation">Penjelasan</SelectItem>
                        <SelectItem value="optimization">Optimasi</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Provider</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih AI provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI GPT</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                        <SelectItem value="deepseek">DeepSeek</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createAIQueryMutation.isPending}
            >
              {createAIQueryMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Sparkles className="mr-2 h-4 w-4" />
              Proses dengan AI
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
