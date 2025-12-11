import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey);

export const supabase: SupabaseClient | null = hasSupabaseConfig
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

if (!hasSupabaseConfig) {
  console.warn(
    'Supabase env vars missing. Running in local-only mode; set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable syncing.'
  );
}
