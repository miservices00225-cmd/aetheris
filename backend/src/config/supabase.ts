import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Initialize Supabase admin client (service role)
 * Used for backend operations, migrations, and admin tasks
 */
function createAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SERVICE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      'Missing VITE_SUPABASE_URL environment variable. Please set it in .env.local'
    );
  }

  if (!serviceKey) {
    throw new Error(
      'Missing SERVICE_KEY environment variable. Please set it in .env.local'
    );
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Initialize Supabase anon client (JWT-based)
 * Used for frontend/user operations with RLS enforcement
 */
function createAnonClient(): SupabaseClient {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      'Missing VITE_SUPABASE_URL environment variable. Please set it in .env.local'
    );
  }

  if (!anonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_ANON_KEY environment variable. Please set it in .env.local'
    );
  }

  return createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Export singletons
export const adminClient = createAdminClient();
export const anonClient = createAnonClient();

export { SupabaseClient };
