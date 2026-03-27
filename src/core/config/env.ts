export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  ADMIN_PATH: import.meta.env.VITE_ADMIN_PATH || 'admin-secret-dashboard',
  ADMIN_EMAILS: (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((e: string) => e.trim()).filter(Boolean),
  IS_DEV: import.meta.env.DEV,
}
