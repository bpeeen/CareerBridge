import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://uqweblvhlxudsaxszfqf.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxd2VibHZobHh1ZHNheHN6ZnFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NzUxODYsImV4cCI6MjEwNTI1MTE4Nn0.CuhKu__tRuTelQOU7PJPg2gTnPZxNRwXJ32sZIBYmRE';

export const isServerSupabaseConfigured = Boolean(supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder'));

let serverClient: SupabaseClient | null = null;

if (isServerSupabaseConfigured) {
  try {
    serverClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  } catch (e) {
    console.warn('Server Supabase client init warning:', e);
  }
}

export const serverSupabase = serverClient;
