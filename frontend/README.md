# AETHERIS Frontend

## Context
React 18.3 + Vite 5.4 SPA with Tailwind CSS 3.4.

## Quick Start
```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

## Project Structure
- `src/components/` — Reusable React components
- `src/pages/` — Page-level components (Dashboard, Journal, Analytics, etc.)
- `src/context/` — Zustand stores for state management
- `src/hooks/` — Custom React hooks
- `src/utils/` — Utility functions
- `src/styles/` — Global CSS

## Scripts
- `npm run dev` — Start Vite dev server (HMR enabled)
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — ESLint check
- `npm run lint:fix` — Auto-fix linting issues
- `npm run format` — Prettier formatting
- `npm run test` — Run Jest tests

## Environment Variables
Required in `.copilot/.env.local`:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase public API key
- `VITE_API_URL` — Backend API URL (default: http://localhost:3001/api)
- `VITE_CORS_ORIGIN` — Allowed CORS origins

## Color Palette (Tailwind)
- `bg-aetheris-gold` (#C9A050) — Prestige, titles
- `bg-aetheris-night` (#0A1321) — Dark background
- `bg-aetheris-navy` (#193452) — Cards, blocks
- `bg-aetheris-steel` (#2F6792) — Technical sections
- `bg-aetheris-emerald` (#0E765E) — Profits, wins
- `bg-aetheris-crimson` (#AF2D2D) — Losses, alerts
- `text-aetheris-slate` (#B8C1CC) — Subtitles, labels

## Testing
```bash
npm run test         # Run tests
npm run test:watch  # Watch mode
```

## Tech Stack
- **Framework:** React 18.3
- **Build Tool:** Vite 5.4 (esbuild, 14x faster)
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS 3.4
- **State:** Zustand 4.5
- **Icons:** Heroicons 2.1 (41-icon sprite)
- **Testing:** Jest 29.7 + React Testing Library 14.2
