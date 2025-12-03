
import { createClient } from '@supabase/supabase-js';

// Polyfill for TypeScript build without @types/node
declare const process: { env: { SUPABASE_URL: string; SUPABASE_KEY: string } };

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
