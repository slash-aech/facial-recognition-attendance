// frontend/src/types.ts
export interface LoginResponse {
  accessToken: string;
  role: string; // one of: 'admin' | 'manager' | 'editor' | 'user' | 'guest'
}
