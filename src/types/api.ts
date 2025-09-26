// API Response Types
export interface User {
  id: string;
  email: string;
  name: string;
  plan: "free" | "starter" | "professional" | "business" | "enterprise";
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface CreateAIQueryRequest {
  prompt: string;
  query_type: "formula" | "analysis" | "explanation" | "optimization";
  provider?: "openai" | "gemini" | "deepseek";
  spreadsheet_id?: string;
  language?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface AIQuery {
  id: string;
  prompt: string;
  response: string;
  query_type: string;
  provider: string;
  tokens_used: number;
  cost: number;
  created_at: string;
}

export interface CreateAIQueryResponse extends AIQuery {}

export interface GetQueriesResponse {
  queries: AIQuery[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface AIStatsResponse {
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

export interface CreateSpreadsheetRequest {
  title: string;
  description?: string;
}

export interface Spreadsheet {
  id: string;
  title: string;
  description: string;
  spreadsheet_id: string;
  url: string;
  created_at: string;
}

export interface CreateSpreadsheetResponse extends Spreadsheet {}

export interface ReadSpreadsheetRequest {
  range: string;
}

export interface ReadSpreadsheetResponse {
  range: string;
  values: string[][];
}

export interface WriteSpreadsheetRequest {
  range: string;
  values: string[][];
}

export interface WriteSpreadsheetResponse {
  updated_range: string;
  updated_rows: number;
  updated_columns: number;
  updated_cells: number;
}

export interface CreateAPIKeyRequest {
  name: string;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  key_preview?: string;
  last_used: string | null;
  created_at: string;
}

export interface CreateAPIKeyResponse extends APIKey {}

export interface ListAPIKeysResponse {
  api_keys: Omit<APIKey, "key">[];
}

export interface ApiError {
  error: string;
  message?: string;
  details?: any;
}
