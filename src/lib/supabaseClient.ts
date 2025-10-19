import { createClient } from '@supabase/supabase-js';
// Removed incorrect import of 'Database' which is not exported from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mgzmratnndlslnsrcmvt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);