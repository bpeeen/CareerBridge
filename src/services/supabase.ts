import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Environment variables or provided Supabase project credentials
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://uqweblvhlxudsaxszfqf.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd2VibHZobHh1ZHNheHN6ZnFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NzUxODYsImV4cCI6MjEwNTI1MTE4Nn0.CuhKu__tRuTelQOU7PJPg2gTnPZxNRwXJ32sZIBYmRE';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'));

let client: SupabaseClient | null = null;
if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (e) {
    console.warn('Supabase client init error:', e);
  }
}

export const supabase = client;

export interface AuthUserState {
  user: User | null;
  session: any | null;
}
