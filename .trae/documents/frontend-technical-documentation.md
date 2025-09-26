# SpreadsheetAI Frontend - Dokumentasi Teknis Tim Frontend

**Versi**: 1.0  
**Tanggal**: 25 Desember 2024  
**Project**: SpreadsheetAI - Frontend Next.js TypeScript  
**Status**: Active  

---

## 1. Overview Teknologi Stack

### 1.1 Core Technologies
- **Framework**: Next.js 15.5.4 dengan App Router
- **React**: 19.1.0+ dengan TypeScript
- **UI Framework**: shadcn/ui dengan Tailwind CSS
- **State Management**: React Query (TanStack Query) v5
- **Form Management**: React Hook Form dengan Zod validation
- **HTTP Client**: Axios dengan interceptors
- **Authentication**: JWT via Cookies

### 1.2 Project Structure (Next.js App Router)
```
frontend/
├── src/
│   ├── app/                # App Router (Next.js 13+)
│   │   ├── (auth)/         # Route groups
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/    # Protected routes group
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── ai-queries/
│   │   │   │   └── page.tsx
│   │   │   ├── sheets/
│   │   │   │   └── page.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   ├── api/            # API routes
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   ├── loading.tsx     # Global loading UI
│   │   ├── error.tsx       # Global error UI
│   │   ├── not-found.tsx   # 404 page
│   │   └── page.tsx        # Home page
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── forms/         # Form components
│   │   ├── layout/        # Layout components
│   │   └── providers/     # Context providers
│   ├── hooks/             # Custom React hooks
│   │   ├── api/           # API hooks with React Query
│   │   └── use-auth.ts    # Authentication hooks
│   ├── lib/               # Utility libraries
│   │   ├── api.ts         # API client configuration
│   │   ├── auth.ts        # NextAuth configuration
│   │   ├── utils.ts       # General utilities
│   │   └── validations.ts # Zod schemas
│   ├── types/             # TypeScript type definitions
│   │   ├── api.ts         # API response types
│   │   ├── auth.ts        # Authentication types
│   │   └── sheets.ts      # Google Sheets types
│   └── middleware.ts      # Next.js middleware
├── public/                # Static assets
├── next.config.js         # Next.js configuration
└── package.json          # Dependencies
```

---

## 2. API Endpoints dan TypeScript Interfaces

### 2.1 Authentication Endpoints

#### Register User
```typescript
// POST /api/v1/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    plan: 'free' | 'premium';
    created_at: string;
  };
}
```

#### Login User
```typescript
// POST /api/v1/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    plan: 'free' | 'premium';
  };
}
```

#### Refresh Token
```typescript
// POST /api/v1/auth/refresh
interface RefreshTokenRequest {
  refresh_token: string;
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}
```

#### Get Current User
```typescript
// GET /api/v1/auth/me
// Headers: Authorization: Bearer <token>
interface UserResponse {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'premium';
  usage_count: number;
  created_at: string;
  updated_at: string;
}
```

#### Change Password
```typescript
// PUT /api/v1/auth/change-password
// Headers: Authorization: Bearer <token>
interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

interface ChangePasswordResponse {
  message: string;
}
```

### 2.2 AI Query Endpoints

#### Create AI Query
```typescript
// POST /api/v1/ai/generate
// Headers: Authorization: Bearer <token>
interface CreateAIQueryRequest {
  prompt: string;
  query_type: 'formula' | 'analysis' | 'explanation' | 'optimization';
  provider?: 'openai' | 'gemini' | 'deepseek';
  spreadsheet_id?: string;
  language?: string;
  temperature?: number;
  max_tokens?: number;
}

interface CreateAIQueryResponse {
  id: string;
  prompt: string;
  response: string;
  query_type: string;
  provider: string;
  tokens_used: number;
  cost: number;
  created_at: string;
}
```

#### Get User AI Queries
```typescript
// GET /api/v1/ai/queries?page=1&limit=20&type=formula
// Headers: Authorization: Bearer <token>
interface GetQueriesResponse {
  queries: {
    id: string;
    prompt: string;
    response: string;
    query_type: string;
    provider: string;
    tokens_used: number;
    cost: number;
    created_at: string;
  }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

#### Get AI Query Stats
```typescript
// GET /api/v1/ai/stats
// Headers: Authorization: Bearer <token>
interface AIStatsResponse {
  total_queries: number;
  total_tokens: number;
  total_cost: number;
  queries_by_type: {
    formula: number;
    analysis: number;
    explanation: number;
    optimization: number;
  };
  queries_by_provider: {
    openai: number;
    gemini: number;
    deepseek: number;
  };
}
```

### 2.3 Google Sheets Endpoints

#### Create Spreadsheet
```typescript
// POST /api/v1/sheets
// Headers: Authorization: Bearer <token>
interface CreateSpreadsheetRequest {
  title: string;
  description?: string;
}

interface CreateSpreadsheetResponse {
  id: string;
  title: string;
  description: string;
  spreadsheet_id: string;
  url: string;
  created_at: string;
}
```

#### Read Spreadsheet Data
```typescript
// POST /api/v1/sheets/{id}/read
// Headers: Authorization: Bearer <token>
interface ReadSpreadsheetRequest {
  range: string; // e.g., "Sheet1!A1:C10"
}

interface ReadSpreadsheetResponse {
  range: string;
  values: string[][];
}
```

#### Write Spreadsheet Data
```typescript
// POST /api/v1/sheets/{id}/write
// Headers: Authorization: Bearer <token>
interface WriteSpreadsheetRequest {
  range: string;
  values: string[][];
}

interface WriteSpreadsheetResponse {
  updated_range: string;
  updated_rows: number;
  updated_columns: number;
  updated_cells: number;
}
```

### 2.4 API Key Management

#### Create API Key
```typescript
// POST /api/v1/api-keys
// Headers: Authorization: Bearer <token>
interface CreateAPIKeyRequest {
  name: string;
}

interface CreateAPIKeyResponse {
  id: string;
  name: string;
  key: string;
  created_at: string;
}
```

#### List API Keys
```typescript
// GET /api/v1/api-keys
// Headers: Authorization: Bearer <token>
interface ListAPIKeysResponse {
  api_keys: {
    id: string;
    name: string;
    key_preview: string; // First 8 chars + "..."
    last_used: string | null;
    created_at: string;
  }[];
}
```

---

## 3. React Query Implementation

### 3.1 NextAuth.js Configuration
```typescript
// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiClient } from './api';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();
          
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            plan: data.user.plan,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.plan = user.plan;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user.plan = token.plan;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
};

// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

### 3.2 API Client Setup
```typescript
// src/lib/api.ts
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk menambahkan token dari NextAuth
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor untuk handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // NextAuth akan handle refresh token secara otomatis
      // Redirect ke login jika session expired
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    // Show error toast
    const errorMessage = error.response?.data?.error || 'Terjadi kesalahan';
    if (typeof window !== 'undefined') {
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);
```

### 3.3 React Query Setup
```typescript
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### 3.4 Authentication Hooks dengan NextAuth
```typescript
// src/hooks/use-auth.ts
import { useSession, signIn, signOut } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const login = async (credentials: { email: string; password: string }) => {
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });
      
      if (result?.error) {
        toast.error('Login gagal. Periksa email dan password Anda.');
        return { success: false, error: result.error };
      }
      
      toast.success('Login berhasil!');
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      toast.error('Terjadi kesalahan saat login');
      return { success: false, error: 'Unknown error' };
    }
  };
  
  const logout = async () => {
    try {
      await signOut({ redirect: false });
      queryClient.clear();
      toast.success('Logout berhasil');
      router.push('/login');
    } catch (error) {
      toast.error('Terjadi kesalahan saat logout');
    }
  };
  
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    login,
    logout,
  };
};

export const useRegister = () => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registrasi gagal');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast.success('Registrasi berhasil! Silakan login.');
      router.push('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registrasi gagal');
    },
  });
};

export const useCurrentUser = () => {
  const { data: session } = useSession();
  
  return {
    data: session?.user,
    isLoading: false,
    error: null,
  };
};
```

### 3.5 AI Query Hooks
```typescript
// src/hooks/api/useAI.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface CreateAIQueryData {
  prompt: string;
  query_type: 'formula' | 'analysis' | 'explanation' | 'optimization';
  provider?: 'openai' | 'gemini' | 'deepseek';
  spreadsheet_id?: string;
  language?: string;
  temperature?: number;
  max_tokens?: number;
}

export const useCreateAIQuery = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateAIQueryData) => {
      const response = await apiClient.post('/api/v1/ai/generate', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-queries'] });
      queryClient.invalidateQueries({ queryKey: ['ai-stats'] });
      toast.success('Query AI berhasil diproses!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Query AI gagal');
    },
  });
};

export const useAIQueries = (page = 1, limit = 20, type?: string) => {
  return useQuery({
    queryKey: ['ai-queries', page, limit, type],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(type && { type }),
      });
      const response = await apiClient.get(`/api/v1/ai/queries?${params}`);
      return response.data;
    },
  });
};

export const useAIStats = () => {
  return useQuery({
    queryKey: ['ai-stats'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/ai/stats');
      return response.data;
    },
  });
};
```

---

## 4. React Hook Form Implementation

### 4.1 Zod Validation Schemas
```typescript
// src/lib/validations.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password harus mengandung huruf besar, kecil, dan angka'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

export const aiQuerySchema = z.object({
  prompt: z.string().min(10, 'Prompt minimal 10 karakter'),
  query_type: z.enum(['formula', 'analysis', 'explanation', 'optimization']),
  provider: z.enum(['openai', 'gemini', 'deepseek']).optional(),
  spreadsheet_id: z.string().optional(),
  language: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().min(1).max(4000).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AIQueryFormData = z.infer<typeof aiQuerySchema>;
```

### 4.2 Login Form Component
```typescript
// src/components/forms/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogin } from '@/hooks/api/useAuth';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { Loader2 } from 'lucide-react';

export const LoginForm = () => {
  const loginMutation = useLogin();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login ke SpreadsheetAI</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              {...register('password')}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || loginMutation.isPending}
          >
            {(isSubmitting || loginMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
```

### 4.3 AI Query Form Component
```typescript
// src/components/forms/AIQueryForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateAIQuery } from '@/hooks/api/useAI';
import { aiQuerySchema, AIQueryFormData } from '@/lib/validations';
import { Loader2 } from 'lucide-react';

export const AIQueryForm = () => {
  const createQueryMutation = useCreateAIQuery();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AIQueryFormData>({
    resolver: zodResolver(aiQuerySchema),
    defaultValues: {
      query_type: 'formula',
      provider: 'openai',
      temperature: 0.7,
      max_tokens: 1000,
    },
  });
  
  const onSubmit = (data: AIQueryFormData) => {
    createQueryMutation.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Buat Query AI Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Masukkan prompt untuk AI..."
              rows={4}
              {...register('prompt')}
              className={errors.prompt ? 'border-red-500' : ''}
            />
            {errors.prompt && (
              <p className="text-sm text-red-500">{errors.prompt.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipe Query</Label>
              <Select
                value={watch('query_type')}
                onValueChange={(value) => setValue('query_type', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formula">Formula</SelectItem>
                  <SelectItem value="analysis">Analisis</SelectItem>
                  <SelectItem value="explanation">Penjelasan</SelectItem>
                  <SelectItem value="optimization">Optimisasi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Provider AI</Label>
              <Select
                value={watch('provider')}
                onValueChange={(value) => setValue('provider', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  <SelectItem value="deepseek">DeepSeek</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || createQueryMutation.isPending}
          >
            {(isSubmitting || createQueryMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Buat Query
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
```

---

## 5. Next.js App Router Setup

### 5.1 Root Layout
```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SpreadsheetAI - AI-Powered Excel & Google Sheets Assistant',
  description: 'Transform your spreadsheet workflow with AI-powered formulas, analysis, and automation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

### 5.2 Providers Component
```typescript
// src/components/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
```

### 5.3 Middleware untuk Authentication
```typescript
// src/middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Redirect authenticated users away from auth pages
    if (req.nextauth.token && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Redirect unauthenticated users to login
    if (!req.nextauth.token && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public pages
        if (req.nextUrl.pathname === '/' || 
            req.nextUrl.pathname === '/login' || 
            req.nextUrl.pathname === '/register') {
          return true;
        }
        
        // Require authentication for protected pages
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*',
    '/ai-queries/:path*',
    '/sheets/:path*',
    '/api-keys/:path*',
    '/profile/:path*',
  ],
};
```

### 5.4 Page Routes Structure
```typescript
// src/app/page.tsx (Home - redirect to dashboard)
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard');
}

// src/app/(auth)/login/page.tsx
import { LoginForm } from '@/components/forms/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login ke SpreadsheetAI</CardTitle>
          <CardDescription>
            Masuk untuk mengakses fitur AI spreadsheet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}

// src/app/(auth)/register/page.tsx
import { RegisterForm } from '@/components/forms/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Daftar SpreadsheetAI</CardTitle>
          <CardDescription>
            Buat akun untuk mulai menggunakan AI spreadsheet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}

// src/app/(dashboard)/layout.tsx
import { MainLayout } from '@/components/layout/MainLayout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}

// src/app/(dashboard)/dashboard/page.tsx
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default function DashboardPage() {
  return <DashboardContent />;
}

// src/app/(dashboard)/ai-queries/page.tsx
import { AIQueriesContent } from '@/components/ai-queries/AIQueriesContent';

export default function AIQueriesPage() {
  return <AIQueriesContent />;
}

// src/app/(dashboard)/sheets/page.tsx
import { SheetsContent } from '@/components/sheets/SheetsContent';

export default function SheetsPage() {
  return <SheetsContent />;
}

// src/app/(dashboard)/profile/page.tsx
import { ProfileContent } from '@/components/profile/ProfileContent';

export default function ProfilePage() {
  return <ProfileContent />;
}
```

### 5.5 Navigation Hook untuk Next.js
```typescript
// src/hooks/use-navigation.ts
import { useRouter, usePathname } from 'next/navigation';

export const useNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const goTo = (path: string) => {
    router.push(path);
  };

  const goBack = () => {
    router.back();
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const refresh = () => {
    router.refresh();
  };

  return {
    goTo,
    goBack,
    isActive,
    refresh,
    currentPath: pathname,
  };
};
```

---

## 6. Layout Components

### 6.1 Main Layout
```typescript
// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
```

### 6.2 Sidebar Navigation
```typescript
// src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Brain, 
  FileSpreadsheet, 
  User, 
  Key,
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Queries', href: '/ai-queries', icon: Brain },
  { name: 'Spreadsheets', href: '/sheets', icon: FileSpreadsheet },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'API Keys', href: '/api-keys', icon: Key },
];

interface SidebarProps {
  user?: {
    name?: string;
    email?: string;
    plan?: string;
  };
}

export const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();
  const { logout } = useAuth();
  
  return (
    <div className="w-64 bg-white shadow-sm border-r">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">SpreadsheetAI</h1>
        {user && (
          <>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
            <div className="mt-2">
              <span className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                user.plan === 'premium' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-gray-100 text-gray-800'
              )}>
                {user.plan === 'premium' ? 'Premium' : 'Free'}
              </span>
            </div>
          </>
        )}
      </div>
      
      <nav className="px-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};
```

---

## 7. Dashboard Implementation

### 7.1 Dashboard Content Component
```typescript
// src/components/dashboard/DashboardContent.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { useAIStats } from '@/hooks/api/useAI';
import { Brain, FileSpreadsheet, DollarSign, TrendingUp } from 'lucide-react';
import { AIQueryForm } from '@/components/forms/AIQueryForm';
import { RecentQueries } from '@/components/dashboard/RecentQueries';

export const DashboardContent = () => {
  const { data: session } = useSession();
  const { data: stats } = useAIStats();
  const user = session?.user;
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Selamat datang, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Kelola spreadsheet Anda dengan kekuatan AI
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_queries || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_tokens || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.total_cost?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user?.plan || 'Free'}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIQueryForm />
        <RecentQueries />
      </div>
    </div>
  );
};
```

---

## 8. Error Handling dan Loading States

### 8.1 Error Boundary
```typescript
// src/components/ErrorBoundary.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Terjadi Kesalahan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Maaf, terjadi kesalahan yang tidak terduga. Silakan refresh halaman atau hubungi support.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Refresh Halaman
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### 8.2 Loading Components
```typescript
// src/components/ui/LoadingSpinner.tsx
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };
  
  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
  );
};

// src/components/ui/LoadingCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingCardProps {
  message?: string;
}

export const LoadingCard = ({ message = 'Memuat...' }: LoadingCardProps) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <LoadingSpinner />
          <span className="text-gray-600">{message}</span>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 9. Environment Configuration

### 9.1 Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_APP_NAME=SpreadsheetAI
NEXT_PUBLIC_APP_VERSION=1.0.0

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Optional: Custom JWT settings
JWT_SIGNING_PRIVATE_KEY=
JWT_VERIFYING_PUBLIC_KEY=

# .env.production
NEXT_PUBLIC_API_BASE_URL=https://api.spreadsheetai.com
NEXT_PUBLIC_APP_NAME=SpreadsheetAI
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXTAUTH_URL=https://spreadsheetai.com
NEXTAUTH_SECRET=your-production-nextauth-secret
```

### 9.2 Environment Types
```typescript
// src/types/env.d.ts
namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_BASE_URL: string;
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_APP_VERSION: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    JWT_SIGNING_PRIVATE_KEY?: string;
    JWT_VERIFYING_PUBLIC_KEY?: string;
  }
}

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      email: string;
      name: string;
      plan: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    plan: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    plan?: string;
  }
}
```

---

## 10. Package.json Dependencies

```json
{
  "name": "spreadsheetai-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next-auth": "^4.24.0",
    "@tanstack/react-query": "^5.8.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "axios": "^1.6.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "lucide-react": "^0.294.0",
    "sonner": "^1.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-config-next": "^14.0.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2"
  }
}
```

---

## 11. Testing Strategy

### 11.1 Testing Setup
```bash
# Install testing dependencies
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
```

### 11.2 Test Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

### 11.3 Example Tests
```typescript
// src/components/forms/__tests__/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../LoginForm';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('LoginForm', () => {
  it('renders login form correctly', () => {
    render(<LoginForm />, { wrapper: createWrapper() });
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
  
  it('shows validation errors for invalid input', async () => {
    render(<LoginForm />, { wrapper: createWrapper() });
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email tidak valid/i)).toBeInTheDocument();
      expect(screen.getByText(/password minimal 8 karakter/i)).toBeInTheDocument();
    });
  });
});
```

---

## 12. Deployment dan Build

### 12.1 Next.js Configuration
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
```

### 12.2 TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 12.3 Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 12.4 Docker Compose untuk Development
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=development-secret
    depends_on:
      - backend

  backend:
    image: spreadsheetai-backend:latest
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=db
      - DB_PORT=3306
      - DB_USER=root
      - DB_PASSWORD=password
      - DB_NAME=spreadsheetai
    depends_on:
      - db

  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=spreadsheetai
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

---

## 13. Testing Strategy

### 13.1 Unit Testing dengan Jest dan React Testing Library
```typescript
// src/hooks/__tests__/use-auth.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { useAuth } from '../use-auth';

// Mock NextAuth
jest.mock('next-auth/react');
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();
const mockUseSession = jest.fn();

(require('next-auth/react') as any).signIn = mockSignIn;
(require('next-auth/react') as any).signOut = mockSignOut;
(require('next-auth/react') as any).useSession = mockUseSession;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <SessionProvider session={null}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
};

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully', async () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
    
    mockSignIn.mockResolvedValueOnce({ error: null });
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    
    await result.current.login({
      email: 'test@example.com',
      password: 'password',
    });
    
    expect(mockSignIn).toHaveBeenCalledWith('credentials', {
      email: 'test@example.com',
      password: 'password',
      redirect: false,
    });
  });

  it('should handle authenticated user', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      plan: 'free',
    };
    
    mockUseSession.mockReturnValue({
      data: { user: mockUser },
      status: 'authenticated',
    });
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });
});
```

### 13.2 Component Testing
```typescript
// src/components/__tests__/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { LoginForm } from '../forms/LoginForm';
import { useAuth } from '@/hooks/use-auth';

// Mock the hook
jest.mock('@/hooks/use-auth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/login',
}));

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return render(
    <SessionProvider session={null}>
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    </SessionProvider>
  );
};

describe('LoginForm', () => {
  const mockLogin = jest.fn();
  
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      logout: jest.fn(),
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  });
  
  it('should render login form', () => {
    renderWithProviders(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
  
  it('should submit form with valid data', async () => {
    renderWithProviders(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
  
  it('should show validation errors for invalid input', async () => {
    renderWithProviders(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/email tidak valid/i)).toBeInTheDocument();
      expect(screen.getByText(/password minimal 6 karakter/i)).toBeInTheDocument();
    });
  });
});
```

### 13.3 E2E Testing dengan Playwright
```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock NextAuth API endpoints
    await page.route('**/api/auth/**', async (route) => {
      const url = route.request().url();
      
      if (url.includes('/session')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ user: null }),
        });
      } else if (url.includes('/signin/credentials')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ 
            url: 'http://localhost:3000/dashboard',
            error: null 
          }),
        });
      } else {
        await route.continue();
      }
    });
  });

  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.locator('h1')).toContainText('Login ke SpreadsheetAI');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
  
  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    
    await page.click('text=Daftar di sini');
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h1')).toContainText('Daftar SpreadsheetAI');
  });
  
  test('should show validation errors', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Email tidak valid')).toBeVisible();
    await expect(page.locator('text=Password minimal 6 karakter')).toBeVisible();
  });
});

test.describe('Dashboard Access', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });
  
  test('should display dashboard for authenticated users', async ({ page }) => {
    // Mock authenticated session
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            plan: 'free',
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }),
      });
    });
    
    await page.goto('/dashboard');
    await expect(page.locator('text=Selamat datang, Test User!')).toBeVisible();
    await expect(page.locator('text=Total Queries')).toBeVisible();
  });
});
```

---

## 14. Best Practices dan Conventions

### 13.1 Code Organization
- Gunakan absolute imports dengan alias `@/`
- Pisahkan business logic ke custom hooks
- Gunakan TypeScript strict mode
- Implement proper error boundaries
- Gunakan React.memo untuk optimisasi performa

### 14.2 Performance Optimization
```typescript
// Dynamic imports dengan Next.js
import dynamic from 'next/dynamic';

// Lazy loading components
const Dashboard = dynamic(() => import('@/components/Dashboard'), {
  loading: () => <div>Loading Dashboard...</div>,
  ssr: false, // Disable SSR jika diperlukan
});

const AIQueryForm = dynamic(() => import('@/components/AIQueryForm'), {
  loading: () => <div>Loading Form...</div>,
});

// Memoization untuk expensive calculations
const ExpensiveComponent = memo(({ data }: { data: any[] }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: heavyCalculation(item),
    }));
  }, [data]);
  
  return <div>{/* render processed data */}</div>;
});

// Image optimization dengan Next.js
import Image from 'next/image';

function UserAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="rounded-full"
      priority={false} // Set true untuk above-the-fold images
    />
  );
}
```

### 14.3 Error Boundaries
```typescript
// Error boundary component untuk Next.js
'use client';

import { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send to error reporting service (Sentry, LogRocket, etc.)
    if (process.env.NODE_ENV === 'production') {
      // reportError(error, errorInfo);
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Terjadi kesalahan
          </h2>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            Terjadi kesalahan yang tidak terduga. Silakan refresh halaman atau hubungi support jika masalah berlanjut.
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={() => window.location.reload()}
              variant="default"
            >
              Refresh Halaman
            </Button>
            <Button 
              onClick={() => this.setState({ hasError: false })}
              variant="outline"
            >
              Coba Lagi
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 p-4 bg-gray-100 rounded-lg max-w-2xl">
              <summary className="cursor-pointer font-medium">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-sm text-red-600 overflow-auto">
                {this.state.error?.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### 14.4 Security Best Practices
```typescript
// Input sanitization
import DOMPurify from 'dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href'],
  });
}

// Secure headers dengan Next.js
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

// Environment variable validation
const requiredEnvVars = [
  'NEXT_PUBLIC_API_BASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
] as const;

function validateEnvironment() {
  const missing = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
```

---

## 15. Kesimpulan

Dokumentasi ini menyediakan panduan lengkap untuk pengembangan frontend SpreadsheetAI menggunakan **Next.js 14** dengan **App Router** dan teknologi modern. Tim frontend dapat menggunakan dokumentasi ini sebagai referensi untuk:

### 15.1 Teknologi Stack yang Digunakan
- **Next.js 14+** dengan App Router untuk SSR/SSG
- **NextAuth.js v5** untuk authentication yang aman
- **React Query v5** untuk server state management
- **React Hook Form** dengan validasi Zod
- **shadcn/ui** untuk UI components yang konsisten
- **TypeScript** untuk type safety
- **Tailwind CSS** untuk styling

### 15.2 Fitur Utama yang Dikembangkan
1. **Authentication System**: Login, register, logout dengan NextAuth.js
2. **Dashboard**: Overview user activity dan statistics
3. **AI Query Interface**: Form untuk mengirim query ke AI
4. **Google Sheets Integration**: Koneksi dan manipulasi spreadsheet
5. **API Key Management**: Generate dan manage API keys
6. **User Profile**: Manage user settings dan subscription

### 15.3 Keunggulan Arsitektur
- **Server-Side Rendering**: Performa loading yang cepat
- **Type Safety**: Mengurangi runtime errors dengan TypeScript
- **Optimistic Updates**: UI yang responsive dengan React Query
- **Form Validation**: Client-side validation yang robust
- **Error Handling**: Comprehensive error boundaries dan handling
- **Security**: Built-in security features dari Next.js dan NextAuth.js

### 15.4 Langkah Implementasi
1. **Phase 1**: Setup project dan authentication (Week 1-2)
2. **Phase 2**: Core features development (Week 3-4)
3. **Phase 3**: Google Sheets integration (Week 5-6)
4. **Phase 4**: Testing dan optimization (Week 7-8)
5. **Phase 5**: Production deployment (Week 9-10)

### 15.5 Best Practices yang Diterapkan
- **Component-based Architecture**: Reusable dan maintainable
- **Custom Hooks**: Logic separation dan reusability
- **Error Boundaries**: Graceful error handling
- **Performance Optimization**: Lazy loading dan memoization
- **Security**: Input sanitization dan secure headers
- **Testing**: Comprehensive testing strategy

### 15.6 Resources dan Dokumentasi
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Zod Validation](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### 15.7 Support dan Maintenance
- **Code Review**: Gunakan PR template dan review checklist
- **Documentation**: Update dokumentasi setiap ada perubahan
- **Monitoring**: Implement error tracking dan performance monitoring
- **Updates**: Regular dependency updates dan security patches

**Tim frontend dapat memulai development dengan confidence menggunakan dokumentasi ini sebagai single source of truth untuk semua aspek teknis project SpreadsheetAI.**

---

**Catatan Penting:**
- Dokumentasi ini harus diupdate seiring dengan perubahan API backend
- Semua endpoint harus ditest dengan Postman collection yang sudah disediakan
- Implementasi harus mengikuti design system shadcn/ui
- Gunakan TypeScript strict mode untuk type safety
- Implement proper loading states dan error handling di semua komponen

**Last Updated**: 25 Desember 2024  
**Next Review**: 25 Maret 2025