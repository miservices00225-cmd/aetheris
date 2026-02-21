# OpenSpec Change: scaffold-backend-frontend

## Metadata
```yaml
change_id: scaffold-backend-frontend
type: Implementation
phase: Phase 0 (MVP Foundation)
status: in_progress
priority: CRITICAL
author: AETHERIS Copilot
created_at: 2026-02-20T18:16:55Z
```

---

## Purpose (QUOI)

**Scaffolder une architecture moderne scalable pour AETHERIS:**
- Backend: Node.js 22 LTS + Express 4.21 + TypeScript 5.7 + @supabase/supabase-js 2.50
- Frontend: React 18.3 + Vite 5.4 + Tailwind 3.4 + Zustand 4.5  
- Tous fichiers de configuration (tsconfig strict, ESLint v8.56.0, Prettier, vite.config)
- Intégration GitHub: CI/CD workflow, .gitignore avec .env.local protection
- OpenSpec specification: 6500+ lignes avec 41-icon system documenté

**Objectif:** Fondation prête pour Sprint 1 (broker connectors + metrics engine)

---

## Requirements (OpenSpec Keywords)

### Backend Requirements

**BR-001: Backend Server Initialization**
- SHALL initialize Express 4.21 server listening on :3001
- SHALL load environment variables from .env.local via dotenv
- SHALL initialize Supabase client with credentials (API_URL, ANON_KEY)
- SHALL apply CORS, helmet, morgan middleware
- MUST support hot-reload via ts-node-dev in dev mode
- MUST compile to ES2020 in TypeScript strict mode

**BR-002: Health Check Endpoint**
- SHALL expose GET /health endpoint
- SHALL return {"status":"ok","timestamp":"ISO8601"} on 200 OK
- MUST respond in <100ms
- SHALL be used for uptime monitoring + GitHub Actions validation

**BR-003: TypeScript Configuration**
- SHALL enforce strict mode (strict: true)
- SHALL target ES2020 compatible
- MUST have zero TypeScript errors on `npm run build`
- SHALL support absolute paths via baseUrl + paths

**BR-004: Linting & Formatting**
- SHALL use ESLint v8.56.0 (not v9 due to @typescript-eslint peer deps)
- SHALL have .npmrc with legacy-peer-deps=true
- MUST pass `npm run lint` with zero errors
- SHALL use Prettier for formatting consistency

---

### Frontend Requirements

**FR-001: React Application Initialization**
- SHALL load React 18.3 + Vite 5.4 entry point at src/main.tsx
- SHALL render App.tsx component in #root DOM element
- MUST display "AETHERIS Trading Copilot OS" header on load
- SHALL apply Tailwind CSS globally via src/styles/index.css

**FR-002: Tailwind CSS Integration**
- SHALL configure Tailwind 3.4 with custom AETHERIS color palette
- MUST expose CSS variables: --aetheris-gold, --aetheris-navy, --aetheris-steel, --aetheris-emerald, --aetheris-crimson, --aetheris-slate
- SHALL apply tailwind.config.js with colors object mapping
- MUST support responsive design (mobile-first)

**FR-003: Vite Development Server**
- SHALL expose HMR (Hot Module Replacement) on localhost:5173
- MUST compile JSX/TSX without errors
- SHALL have <100ms page reload on file save
- MUST support TypeScript strict mode

**FR-004: State Management Placeholder**
- SHALL initialize Zustand store (accountStore.ts)
- MUST provide placeholder for account selection context
- SHALL be extensible for future features (Armor, Aether Flow)

**FR-005: Production Build**
- MUST compile to dist/ folder with minification
- SHALL apply code splitting + lazy loading
- MUST output source maps for debugging
- SHALL have zero warnings on `npm run build`

---

## Scenarios (Test Acceptation)

### Scenario 1: Backend Server Startup
**Given:** npm dependencies installed in backend/  
**When:** User runs `npm run dev` in backend/  
**Then:**
- ✅ Terminal displays: "✅ AETHERIS Backend listening on :3001"
- ✅ Server process runs without errors
- ✅ Supabase client initializes (or logs warning if .env.local missing)
- ✅ Port :3001 is listening and accepting connections

### Scenario 2: Health Endpoint Validation
**Given:** Backend server running on localhost:3001  
**When:** User executes `curl http://localhost:3001/health`  
**Then:**
- ✅ HTTP 200 OK response
- ✅ Response body: `{"status":"ok","timestamp":"2026-02-20T18:00:00Z"}`
- ✅ Response time: <100ms

### Scenario 3: Backend ESLint & Build
**Given:** npm dependencies installed in backend/  
**When:** User runs `npm run lint` then `npm run build`  
**Then:**
- ✅ ESLint: 0 errors, 0 warnings
- ✅ Build: TypeScript compiles to dist/ without errors
- ✅ dist/server.js exists and is executable

### Scenario 4: Frontend Dev Server Startup
**Given:** npm dependencies installed in frontend/  
**When:** User runs `npm run dev` in frontend/  
**Then:**
- ✅ Terminal displays: "➜ Local: http://localhost:5173/"
- ✅ Port :5173 is listening (Vite HMR ready)
- ✅ No compilation errors in console
- ✅ Server ready for hot module replacement

### Scenario 5: React App Visual Verification
**Given:** Frontend dev server running on localhost:5173  
**When:** User opens http://localhost:5173 in browser  
**Then:**
- ✅ Page loads without 404 errors
- ✅ Header displays: "AETHERIS Trading Copilot OS"
- ✅ Title element shows project name
- ✅ No console JavaScript errors (F12 DevTools)
- ✅ AETHERIS gold color (#C9A050) visible in header

### Scenario 6: Tailwind Colors Applied
**Given:** Frontend dev server running  
**When:** User inspects HTML elements with F12  
**Then:**
- ✅ CSS variables --aetheris-gold, --aetheris-navy available
- ✅ Tailwind classes work: `bg-aetheris-gold`, `text-aetheris-navy`
- ✅ Color palette matches AETHERIS Palette v1.0

### Scenario 7: Frontend ESLint & Build
**Given:** npm dependencies installed in frontend/  
**When:** User runs `npm run lint` then `npm run build`  
**Then:**
- ✅ ESLint: 0 errors, 0 warnings
- ✅ Build: React app compiles to dist/ with minification
- ✅ dist/index.html exists
- ✅ No build warnings (only informational messages OK)

### Scenario 8: GitHub Actions CI/CD
**Given:** Code pushed to https://github.com/miservices00225-cmd/aetheris.git  
**When:** GitHub Actions workflow triggers on push  
**Then:**
- ✅ Workflow runs CI jobs: lint + build (backend + frontend)
- ✅ All jobs complete with status: passed ✅
- ✅ Actions tab shows no failed jobs
- ✅ Deployment ready signal available

---

## Artifacts

### Implementation Artifact ✅ DONE
**Location:** backend/, frontend/, .github/

**Files Created:**
- backend/package.json (Express, Supabase, TypeScript, ESLint v8)
- backend/src/server.ts (Express server + /health)
- backend/src/config/supabase.ts (Supabase client init)
- backend/tsconfig.json (strict mode)
- backend/.eslintrc.json, .prettierrc, .npmrc
- frontend/package.json (React, Vite, Tailwind, Zustand)
- frontend/src/main.tsx, App.tsx
- frontend/src/styles/index.css (Tailwind + AETHERIS palette)
- frontend/vite.config.ts (HMR config)
- frontend/tailwind.config.js (color palette)
- frontend/tsconfig.json (strict mode)
- .github/workflows/ci.yml (GitHub Actions)
- .gitignore (node_modules, .env.local, dist/)

**Verification:**
```bash
git log --oneline | head -1
# 328 files added, 75,150 insertions
# Initial commit with full scaffold
```

---

### Testing Artifact ❌ PENDING

**Tests Required:**

1. **Backend npm install**
   ```bash
   cd backend && npm install --no-fund
   # Verify: node_modules/ created, 150+ packages installed
   ```

2. **Backend npm run dev**
   ```bash
   npm run dev
   # Verify: Server listens :3001, "✅ AETHERIS Backend listening" logged
   ```

3. **Backend health check**
   ```bash
   curl http://localhost:3001/health
   # Verify: 200 response, {"status":"ok","timestamp":"..."}
   ```

4. **Backend lint + build**
   ```bash
   npm run lint     # 0 errors
   npm run build    # dist/ created, no TypeScript errors
   ```

5. **Frontend npm install**
   ```bash
   cd frontend && npm install --no-fund
   # Verify: node_modules/ created, 200+ packages installed
   ```

6. **Frontend npm run dev**
   ```bash
   npm run dev
   # Verify: Vite HMR on :5173, "Local: http://localhost:5173/" logged
   ```

7. **Frontend browser test**
   ```
   Open http://localhost:5173
   - "AETHERIS" header visible ✅
   - No console errors ✅
   - Gold color (#C9A050) applied ✅
   ```

8. **Frontend lint + build**
   ```bash
   npm run lint     # 0 errors
   npm run build    # dist/ created, minified
   ```

9. **GitHub Actions CI/CD**
   ```
   Visit: https://github.com/miservices00225-cmd/aetheris/actions
   - Workflow ran ✅
   - Lint passed ✅
   - Build passed ✅
   ```

---

### Documentation Artifact ⚠️ PENDING

**Files to Create:**

1. **GETTING_STARTED.md**
   - npm install instructions (backend + frontend)
   - npm run dev quick start
   - Health endpoint test
   - Frontend browser verification

2. **Backend Development Guide**
   - Directory structure (src/, config/, routes/)
   - Adding new Express routes
   - Supabase client usage patterns
   - TypeScript strict mode guidelines

3. **Frontend Development Guide**
   - Directory structure (src/, components/, context/)
   - Using Tailwind with AETHERIS palette
   - Zustand store usage
   - React component patterns

4. **Testing Guide**
   - Running jest backend tests
   - Running jest frontend tests
   - Playwright E2E testing (Phase 2)

5. **Update openspec.yaml**
   - Mark `scaffold-backend-frontend` as DONE
   - Link to this change document
   - Update root spec status (Sprint 0 progress)

---

## Dependencies

| Dependency | Status | Blocker? |
|-----------|--------|----------|
| Supabase credentials (.env.local) | ✅ DONE | No |
| GitHub repository initialized | ✅ DONE | No |
| Node.js 22 LTS installed | ✅ ASSUMED | No |
| npm install backend | ❌ PENDING | **YES** |
| npm install frontend | ❌ PENDING | **YES** |

---

## Execution Plan

### Step 1: npm install (BLOCKING - USER)
```bash
cd backend && npm install --no-fund
cd frontend && npm install --no-fund
```
**Estimated time:** 5-10 minutes  
**Blocker:** Nothing else works until this is done

### Step 2: Backend Validation (COPILOT)
```bash
cd backend
npm run dev              # Verify :3001 listen
curl http://localhost:3001/health  # Verify 200
npm run lint            # Verify 0 errors
npm run build           # Verify dist/ created
```

### Step 3: Frontend Validation (COPILOT)
```bash
cd frontend
npm run dev             # Verify :5173 HMR
# Browser: http://localhost:5173 → "AETHERIS" visible
npm run lint            # Verify 0 errors
npm run build           # Verify dist/ created
```

### Step 4: Documentation (COPILOT)
- Create GETTING_STARTED.md
- Create Backend & Frontend dev guides
- Update openspec.yaml status

### Step 5: Archive Change (COPILOT)
```bash
openspec archive scaffold-backend-frontend --update
```

---

## Success Criteria

✅ **All of these must be true:**
- npm install completes in backend/ + frontend/
- Backend server starts on :3001 without errors
- GET /health returns 200 with valid JSON
- Frontend dev server starts on :5173 without errors
- Browser shows "AETHERIS" header with gold color
- `npm run lint` passes: 0 errors (both backend + frontend)
- `npm run build` succeeds: dist/ created (both backend + frontend)
- GitHub Actions workflow shows all jobs passed ✅
- GETTING_STARTED.md created with clear instructions
- All 3 artifacts marked DONE

---

## Next Changes (Dependencies)

This change unlocks:
1. **create-supabase-schema** — Create 15 tables + RLS policies
2. **implement-broker-connector** — MT4 CSV parser + dedup (Sprint 1)
3. **implement-metrics-engine** — 200+ KPIs (Sprint 1)
4. **build-heatmap-component** — Visual Calendar (Sprint 1)

---

**Change Version:** 1.0  
**Last Updated:** 2026-02-20T18:16:55Z  
**OpenSpec Reference:** openspec.yaml
