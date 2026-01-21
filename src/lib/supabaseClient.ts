import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate Supabase URL format
const isValidSupabaseUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('.supabase.co') && urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const hasSupabaseConfig = Boolean(
  supabaseUrl && 
  supabaseKey && 
  isValidSupabaseUrl(supabaseUrl) &&
  supabaseKey.startsWith('eyJ')
);

export const supabase: SupabaseClient | null = hasSupabaseConfig
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

if (!hasSupabaseConfig) {
  if (supabaseUrl || supabaseKey) {
    console.warn(
      'Supabase configuration is incomplete or invalid. Running in local-only mode. Please check your .env file.'
    );
  } else {
    console.info(
      'Supabase env vars not set. Running in local-only mode; set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable syncing.'
    );
  }
}
