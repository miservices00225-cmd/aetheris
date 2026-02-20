# AETHERIS Backend

## Context
Node.js 22 LTS + Express 4.21 API server.

## Quick Start
```bash
cd backend
npm install
npm run dev  # Runs on http://localhost:3001
```

## Project Structure
- `src/config/` — Supabase client initialization
- `src/routes/` — API endpoints
- `src/middleware/` — Custom Express middleware
- `src/utils/` — Helper functions

## Scripts
- `npm run dev` — Start development server (tsx watch)
- `npm run build` — Compile TypeScript
- `npm run lint` — ESLint check
- `npm run lint:fix` — Auto-fix linting issues
- `npm run format` — Prettier formatting

## Environment Variables
Required in `.copilot/.env.local`:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase public API key
- `DATABASE_URL` — PostgreSQL connection string
- `NODE_ENV` — `development` or `production`
- `PORT` — Server port (default: 3001)

## API Endpoints (Sprint 0)
- `GET /health` — Server health check (returns 200 + status JSON)

## Testing
```bash
npm run test          # Run tests
npm run test:watch   # Watch mode
```

## Tech Stack
- **Runtime:** Node.js 22 LTS
- **Framework:** Express 4.21
- **Language:** TypeScript 5.7
- **Database Client:** @supabase/supabase-js 2.50
- **Testing:** Jest 29.7 + Supertest 6.3
- **Linting:** ESLint 9 + Prettier 3.3
