import dotenv from 'dotenv';
dotenv.config({ path: '.copilot/.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .copilot/.env.local'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
