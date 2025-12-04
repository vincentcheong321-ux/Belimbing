
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe access to window globals
const getGlobal = (key: string) => {
  if (typeof window !== 'undefined' && (window as any)[key]) {
    return (window as any)[key];
  }
  return undefined;
};

let client: SupabaseClient | null = null;

try {
  const supabaseUrl = getGlobal('SUPABASE_URL');
  const supabaseKey = getGlobal('SUPABASE_KEY');

  if (supabaseUrl && supabaseKey) {
    client = createClient(supabaseUrl, supabaseKey);
  } else {
    console.warn("Supabase credentials not found in window object.");
  }
} catch (error) {
  console.warn("Supabase initialization failed, falling back to local storage:", error);
}

export const supabase = client;
