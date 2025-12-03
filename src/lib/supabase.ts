
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Polyfill for TypeScript build without @types/node
declare const process: { env: { SUPABASE_URL: string; SUPABASE_KEY: string } };

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Only create the client if keys are actually present.
// This prevents the "Error: supabaseUrl is required" crash that causes the white screen.
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseKey && supabaseUrl.length > 0 && supabaseKey.length > 0)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (!supabase) {
  console.warn("Supabase keys missing. App will fallback to LocalStorage mode.");
}
