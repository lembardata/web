import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password harus mengandung huruf besar, kecil, dan angka",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Password saat ini wajib diisi"),
    new_password: z
      .string()
      .min(8, "Password baru minimal 8 karakter")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password harus mengandung huruf besar, kecil, dan angka",
      ),
    confirm_new_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirm_new_password"],
  });

export const aiQuerySchema = z.object({
  prompt: z.string().min(10, "Prompt minimal 10 karakter"),
  query_type: z.enum(["formula", "analysis", "explanation", "optimization"]),
  provider: z.enum(["openai", "gemini", "deepseek"]).optional(),
  spreadsheet_id: z.string().optional(),
  language: z.string().optional().default("id"),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  max_tokens: z.number().min(1).max(4000).optional().default(1000),
});

export const createSpreadsheetSchema = z.object({
  title: z.string().min(1, "Judul spreadsheet wajib diisi"),
  description: z.string().optional(),
});

export const createAPIKeySchema = z.object({
  name: z.string().min(1, "Nama API key wajib diisi"),
});

export const readSpreadsheetSchema = z.object({
  range: z.string().min(1, "Range wajib diisi (contoh: Sheet1!A1:C10)"),
});

export const writeSpreadsheetSchema = z.object({
  range: z.string().min(1, "Range wajib diisi"),
  values: z.array(z.array(z.string())).min(1, "Data values wajib diisi"),
});

// Type inference dari schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type AIQueryFormData = z.infer<typeof aiQuerySchema>;
export type CreateSpreadsheetFormData = z.infer<typeof createSpreadsheetSchema>;
export type CreateAPIKeyFormData = z.infer<typeof createAPIKeySchema>;
export type ReadSpreadsheetFormData = z.infer<typeof readSpreadsheetSchema>;
export type WriteSpreadsheetFormData = z.infer<typeof writeSpreadsheetSchema>;
