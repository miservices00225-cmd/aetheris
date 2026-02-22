import dotenv from 'dotenv';

// Load .env.local before any tests run
dotenv.config({ path: '.env.local' });

// Verify critical env vars
beforeAll(() => {
  const required = ['VITE_SUPABASE_URL', 'SERVICE_KEY', 'VITE_SUPABASE_ANON_KEY'];
  for (const env of required) {
    if (!process.env[env]) {
      throw new Error(`Missing required environment variable: ${env}`);
    }
  }
});
