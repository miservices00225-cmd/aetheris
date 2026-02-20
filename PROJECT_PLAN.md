# AETHERIS — Project Plan (WHAT vs HOW)

**Principes:**
1. ✅ Contient détails spécifiques du **QUOI** et du **COMMENT**
2. ✅ Focus sur le **QUOI** (objectifs/livrables), Copilot gère le **COMMENT** (implémentation)
3. ✅ Longueur d'onde commune (contexte complet, zéro malentendus)

---

## PHASE 1: MVP — Infrastructure & Compliance (7-8 sprints)

### QUOI (Objectifs & Livrables)

**Phase 1 = Trading Platform Fonctionnel avec 900+ brokers, 200+ KPIs, Multi-comptes, RLS Compliance**

#### Sprint 0 (Setup) — QUOI à Livrer

| Livrable | Définition de Complétude | Critère de Succès |
|----------|--------------------------|-------------------|
| **Repository Scaffolding** | backend/, frontend/, docs/, tests/ avec structure correcte | `npm install` fonctionne dans les deux dossiers |
| **Supabase Project Setup** | AETHERIS project créé, credentials en .env.local | `VITE_SUPABASE_URL` et clés accessibles |
| **Express Server Template** | Server démarrant sur localhost:3001, GET /health retourne 200 | `npm run dev` lance sans erreurs |
| **React Vite Template** | Vite dev server sur localhost:3000, HMR fonctionne | Edit src/App.tsx → change visible sans F5 |
| **TypeScript Config** | tsconfig.json avec strict mode activé | `npm run type-check` passe sans erreurs |
| **Git + CI/CD Skeleton** | .github/workflows/ci.yml avec lint + build + test | Push → GitHub Actions runs (même si tests vides) |

**COMMENT (Implémentation):** Copilot gérera la création des répertoires, templates, configuration. L'utilisateur n'a rien à faire manuellement.

---

#### Sprint 1-2 (Broker Sync) — QUOI à Livrer

| Livrable | Définition de Complétude | Critère de Succès |
|----------|--------------------------|-------------------|
| **IBrokerConnector Interface** | Interface abstraite + MockConnector pour tests | `npm run test -- BrokerConnector` passe |
| **MT4 Broker Implementation** | Connecte MT4 sandbox, fetch 10+ trades, deduplique | `POST /api/v1/brokers/sync` returns 10 trades |
| **Broker Sync API Endpoint** | POST /api/v1/brokers/sync/{accountId} + status check | Sync complète en < 10s, trades sauvegardées en BD |
| **Supabase Schema (Partial)** | Tables: users, accounts, broker_connections, trades, sync_logs créées | Schema visible dans Supabase dashboard |
| **Deduplication Logic** | broker_trade_id UNIQUE, ignore duplicates | Relancer sync 2x = même trade count (pas de doublons) |

**COMMENT:** Copilot implémentera les connecteurs, l'API, la logique de dedup. Vous confirmez: MT4 suffisant ou tester aussi FIX/REST?

---

#### Sprint 2-3 (Heatmap Component) — QUOI à Livrer

| Livrable | Définition de Complétude | Critère de Succès |
|----------|--------------------------|-------------------|
| **Heatmap 7×5 Grid** | Grille calendrier (7 jours × 5 semaines) affichée | 35 cases visibles, responsive mobile |
| **Color Gradient** | Émeraude (profit) ↔ Rouge (perte) ↔ Gris (zéro) | Couleurs match AETHERIS palette exactement |
| **Hover Tooltips** | +24.5%, 150 trades, Win 60% apparaît au hover | Info précise et lisible |
| **Date Range Selector** | Sélectionner mois/année, heatmap update | Change août → sept = données correctes |
| **Mobile Responsive** | Heatmap visible sur petit écran sans scroll horizontal | Teste sur 375px (iPhone) |

**COMME:** Couleurs dans tailwind.config.js. Données from Supabase daily_snapshots. Mobile: Tailwind responsive classes.

---

#### Sprint 3-4 (P/L Metrics Engine) — QUOI à Livrer

| Livrable | Définition de Complétude | Critère de Succès |
|----------|--------------------------|-------------------|
| **Core Metrics** | Expectancy, Profit Factor, Win Rate, Max Drawdown | `npm run test -- MetricsEngine` = 4 tests passant |
| **Advanced Metrics** | Sharpe Ratio, Kelly Criterion, R-Multiple, MFE/MAE | 200+ total KPIs (peut être partial Phase 1) |
| **Calculation Accuracy** | Formules match PRD section 4 exactement | Expectancy = (W% × AvgW) - (L% × AvgL) ✓ |
| **Performance** | Calcul 1000 trades < 100ms | Mesuré avec console.time() |
| **Caching** | Pre-compute daily_snapshots à minuit UTC | Query heatmap < 50ms |

**COMMENT:** Classe MetricsEngine.ts avec méthodes pures (trades[] → MetricsSnapshot). Trigger nightly job via BullMQ (ou setTimeout Phase 1). Tests: mock 100/1000/10k trades.

---

#### Sprint 4-5 (KPI Dashboard) — QUOI à Livrer

| Livrable | Définition de Complétude | Critère de Succès |
|----------|--------------------------|-------------------|
| **10 KPI Cards** | Win Rate, Profit Factor, Expectancy, Drawdown, Sharpe, Trades, R-Multiple, Duration, P/L, MFE/MAE | Tous 10 visibles sur un écran 1920×1080 |
| **Card Styling** | Navy fond, gold titre, emerald/crimson values, icon + trend | Match design mockup exactement |
| **Heroicons Integration** | Chaque KPI a icône Heroicons correcte (4 catégories) | Icone visible, couleur dynamique |
| **Trend Indicators** | ↑ vert / ↓ rouge si métrique améliore/détériore vs. jour précédent | Comparaison automatique daily_snapshots |
| **Sector Benchmark** | "Vs. sector: Top 5%" badge si KPI beat benchmark | Static benchmark Phase 1, dynamic Phase 2 |

**COMMENT:** React component KPICard.tsx réutilisable, Zustand pour metrics cache, recharts pour sparklines mini. Icons via sprite <use href="#kpi-winrate">. Colors via Tailwind + CSS vars.

---

#### Sprint 5-6 (Risk Aggregation Panel) — QUOI à Livrer

| Livrable | Définition de Complétude | Critère de Succès |
|----------|--------------------------|-------------------|
| **Multi-Account View** | Sélecteur compte dropdown, affiche metrics consolidé | Switch compte A → B = données changent |
| **Weighted Drawdown** | Total DD = (Account A DD × % capital) + (Account B DD × % capital) | Formula correcte pour 2-3 comptes |
| **Prop Firm Rules Check** | Compare vs. FTMO/MyForexFunds templates (5% MDL, 10% trailing DD) | "✓ FTMO Compliant" ou "⚠ Drawdown 7% (limit 5%)" |
| **Cross-Account Correlation** | Flag si 2 comptes corrélés (same time trades) | "Trades correlated with Account B: 40%" |
| **Consolidated P/L Summary** | Total P/L, Win Rate (weighted), Average Duration | Recap clair des 2-3+ comptes |

**COMMENT:** Query Supabase with RLS → agrégation backend (ou frontend si données déjà fetched). Composant RiskAggregation.tsx. Zustand store per account.

---

#### Sprint 6 (Position Sizing Calculator) — QUOI à Livrer

| Livrable | Définition de Complétude | Critère de Succès |
|----------|--------------------------|-------------------|
| **Lot Size Input Form** | Inputs: Account risk % (default 2%), Stop Loss pips, ATR value | Form visible, inputs accept numbers |
| **Auto-Calculate Output** | Lot size = (Account equity × risk%) / (stop loss $ equivalent) | Calcul instant on input change |
| **Risk Alert** | Si lot > baseline (100% optimal position), warn: "⚠ 2.5x normal risk" | Alert color = crimson |
| **Kelly Criterion Suggestion** | Optional: suggest lot based on Kelly formula + historical win rate | "Kelly suggests: 0.8 lot" (info only) |

**COMME:** Simple form, input validation (Zod), instant recalc. Store in Zustand. Optional (can skip if time-pressed).

---

#### Sprint 6-7 (Export & Reporting) — QUOI à Livrer

| Livrable | Définition de Complétude | Critère de Succès |
|----------|--------------------------|-------------------|
| **Export PDF** | "Download Report" → PDF avec heatmap, KPI summary, monthly P/L | File: aetheris-report-2025-02.pdf (readable) |
| **Export CSV** | All trades + metrics → trades_2025-02.csv (Excel compatible) | Open in Excel, columns correct |
| **Export Excel** | Same as CSV but .xlsx with formatting (optional) | Sheets: Trades, Daily Summary, KPIs |
| **Secure Share Link** | Generate link (expires 7 days), share report without download | Link: aetheris.app/share/abc123xyz → PDF preview |
| **Email Report** | (Optional) Schedule daily/weekly email to user | Cron job sends report email |

**COMME:** Backend PDF generation (pdfkit or similar), CSV native. Share = temp file storage + URL mapping. Email = BullMQ job optional.

---

#### Sprint 7 (Authentication & Dashboard) — QUOI à Livrer

| Livrable | Définition de Complétude | Critère de Succès |
|----------|--------------------------|-------------------|
| **Login Page** | Email + password form, "Sign In" button, error messages | Submit → Supabase Auth, JWT stored in localStorage |
| **2FA TOTP Setup (Optional)** | QR code display, user scans in Google Authenticator, verify | 6-digit code accepted, session created |
| **Protected Routes** | Unauthorized users redirected to /login | Navigate to /dashboard without auth → /login |
| **Dashboard Layout** | Sidebar (9 nav items in gold), main content (heatmap + KPIs), header (user + logout) | All visible, responsive, click nav items = page change |
| **Account Selector** | Dropdown in header, switch between connected accounts | Select Account B → all data refreshes |
| **Logout** | Button clears JWT, redirects to /login | localStorage cleared, can't access dashboard |

**COMME:** Supabase SDK pour auth. JWT in localStorage. useAuth hook global. React Router protégé avec PrivateRoute. Mobile: hamburger menu pour sidebar.

---

#### Sprint 7-8 (Testing & Documentation) — QUOI à Livrer

| Livrable | Définition de Complétude | Critère de Succès |
|----------|--------------------------|-------------------|
| **Backend Unit Tests** | MetricsEngine, BrokerConnectors, validators tested | `npm run test` = 20+ tests passing (80%+ coverage) |
| **Backend API Tests** | Supertest: POST /trades, GET /metrics, POST /brokers/sync | 10+ endpoint tests (happy path + error cases) |
| **Frontend Component Tests** | KPICard, Heatmap, RiskPanel tested (React Testing Library) | 10+ component tests passing |
| **E2E Smoke Test** | Manual: login → import trades → view heatmap → export PDF | All steps work, no console errors |
| **README.md (Backend)** | Project setup, folder structure, API endpoints, environment vars | Dev can run `npm run dev` without questions |
| **README.md (Frontend)** | Project setup, Vite config, Tailwind tokens, component patterns | Dev understands where to add new features |
| **CHANGELOG.md** | Summarize all Phase 1 features, known issues, next Phase 2 features | Clear progress record |

**COMME:** Jest + Supertest templates. React Testing Library patterns. GitHub Actions runs tests on push. README = copy-paste setup instructions.

---

### COMMENT (Implementation Strategy)

**Copilot handles:**
- All code generation (TypeScript, React, Express)
- Git commits with co-author trailer
- Testing frameworks setup
- CI/CD configuration
- Supabase schema creation (SQL)
- Package.json dependencies

**User actions:**
- Review code PRs (semantic correctness only)
- Confirm open questions (BullMQ?, Prisma?, etc.)
- Test in browser (happy path + edge cases)
- Approve deployment to staging/prod

---

## PHASE 2: Maturity — Psychology & Active Risk Prevention (4-5 sprints)

### QUOI (High-Level Objectives)

**Phase 2 = Copilot devient ACTIF (prévient losses en temps réel)**

| Module | QUOI à Livrer | Livrable | Critère |
|--------|---------------|----------|---------|
| **Aether Armor** | Real-time breach detection (MDL 5%, trailing DD 10%) | Alert Level 1-3 system (banner → modal → fullscreen pulse) | Alarm < 2s après détection |
| **Aether Flow** | Track emotional biases (FOMO, REVENGE, etc.) + coût financier | UI pour tagger trades, analytics page | Voir: "Revenge cost -$500 this month" |
| **Vocal Stress Score** | Record voice clips → AI Whisper STT + prosody analysis | VSS 0-100 (Calm-Vigilant-Tilt) timeline | Audio chiffré S3, VSS stocké |
| **Tilt Detection** | Auto-detect overtrading, revenge trading, risk drift | Session_tilt_flag + cool-down period | Cooling mode = no new trades allowed |

---

## PHASE 3: Apex — Institutional Intelligence & 3D (3-4 sprints)

### QUOI (High-Level Objectives)

**Phase 3 = Intelligence Edge (Oracle consensus, Whale flows, 3D viz)**

| Module | QUOI à Livrer | Livrable | Critère |
|--------|---------------|----------|---------|
| **Oracle Consensus** | Pre-trade scoring (whale flows + COT + on-chain) | Score 0-100, user sees before entry | Accuracy tracked vs outcome |
| **Vocal Analysis** | Micro-tremor detection (stress micro-expressions) | Predict high-risk trades from voice | Experimental, for feedback |
| **Galaxie 3D** | Interactive 3D visualization (hour × instrument × duration × P/L) | Rotate/zoom 1000s points 60fps | Reveal clusters invisible in 2D |

---

## DECISIONS FINALES (Appliquées)

### ✅ Decision 1: Broker Sync = SYNCHRONOUS (Phase 1)

**DÉCISION:** POST /api/v1/brokers/sync blocks 3-5s, returns trades immediately

**POURQUOI:** Simpler code, MVP focus. Add BullMQ async in Phase 2 si bottleneck.

**IMPACT:**
- Backend: No Redis needed Phase 1
- API: POST endpoint waits for sync completion
- UX: User sees "Syncing..." spinner 3-5s, then success

---

### ✅ Decision 2: Database Client = SUPABASE SDK ONLY (Phase 1)

**DÉCISION:** Direct @supabase/supabase-js queries, NO Prisma Phase 1

**POURQUOI:** Fewer dependencies, faster iteration, sufficient for MVP schema.

**IMPACT:**
- No Prisma setup
- Queries: `supabase.from('trades').select().eq('account_id', id)`
- Types: Generate from Supabase schema via `supabase gen types`
- Phase 2: Migrate to Prisma if queries become complex

---

### ✅ Decision 3: Redis = OPTIONAL / SKIPPED (Phase 1)

**DÉCISION:** No Redis Phase 1 (no BullMQ, no cache layer)

**POURQUOI:** Simpler MVP, sync broker import sufficient, add Redis in Phase 2 if needed

**IMPACT:**
- No Redis installation
- No BullMQ job queue
- Broker sync = synchronous (blocks API)
- Daily metrics: compute on-demand (or timestamp cache in Supabase)

---

### ✅ Decision 4: Armor Level 3 = EMAIL + WEBHOOK

**DÉCISION:** When critical risk (90% MDL), send BOTH email AND webhook POST

**POURQUOI:** Professional, flexible integrations (Discord, Slack, etc.)

**IMPACT:**
- Backend: EMAIL job (SendGrid integration)
- Backend: WEBHOOK job (user-defined URL, retry logic)
- Schema: Add webhook_url field to accounts table
- Phase 2: Add SMS option

---

### ✅ Decision 5: Heatmap Data = DAILY P/L

**DÉCISION:** Heatmap 7×5 grid shows Daily Net P/L per day

**COMME:**
- Emerald: profit (P/L > 0)
- Crimson: loss (P/L < 0)
- Slate: neutral/no trades (P/L = 0)

**POURQUOI:** Intuitive, matches user performance directly

**IMPACT:**
- Data source: daily_snapshots.net_pnl
- Tooltip: "+$250.50, 12 trades, 60% win rate"
- Mobile: responsive 35 cells visible

---

## Summary: What User Controls vs Copilot

| Item | User (QUOI) | Copilot (COMMENT) |
|------|-------------|-------------------|
| **Decisions made** | ✓ 5 decisions finalized | ✓ Applies to implementation |
| **Features to build** | ✓ Defines (e.g., "heatmap shows P/L") | ✓ Implements (React component, data query) |
| **Data structure** | ✓ Defines (e.g., "15 tables, RLS") | ✓ Implements (SQL schema, migrations) |
| **APIs & endpoints** | ✓ Defines (e.g., "GET /metrics") | ✓ Implements (Express routes, validation) |
| **Acceptance criteria** | ✓ Defines (e.g., "< 2s latency") | ✓ Verifies in code + tests |
| **Code quality** | ✓ Reviews (semantic correctness) | ✓ Ensures (linting, tests, types) |
| **Immediate next** | → Confirm ready for Sprint 0? | → Scaffold repo, create Supabase project |

---

## Timeline & Commitment

**Phase 1 MVP:** 2-3 months solo (150 hours total)
- Sprint 0: 16h (setup)
- Sprints 1-7: ~20h/sprint × 7 = 140h

**Phase 1 Quality:** 
- No manual testing → all CI/CD green
- No technical debt → proper types, tests, docs
- No time pressure → steady velocity

---

## Success Metrics (Phase 1 Complete)

✅ All 16 Phase 1 todos marked `done` in SQL  
✅ GitHub repo with clean commit history  
✅ 80%+ test coverage (unit + integration)  
✅ Zero TypeScript errors (`npm run type-check`)  
✅ Manual testing: all 8 sprints features work  
✅ README + ARCHITECTURE + CHANGELOG updated  
✅ Ready for Phase 2 (psychology features)

---

## Sprint 0: Project Scaffolding (Copilot-Driven)

**Status:** ✅ Supabase credentials already configured in `.copilot/.env.local`
- VITE_SUPABASE_URL = `https://fqkvljxdfjwcbxflilhy.supabase.co`
- VITE_SUPABASE_ANON_KEY = configured
- DATABASE_URL = configured

**Immediate Execution (No More Manual Steps):**

1. ✅ **Scaffold backend/** (Express + Node.js 22)
   - [ ] Copy template: `backend/package.json`, `backend/tsconfig.json`, `backend/src/server.ts`
   - [ ] Install deps: `npm install @supabase/supabase-js express typescript`
   - [ ] Setup ESLint, Prettier, Jest
   - [ ] Create `src/config/supabase.ts` (uses .env.local credentials)
   - [ ] Create `src/routes/health.ts` → GET /health returns 200

2. ✅ **Scaffold frontend/** (React + Vite)
   - [ ] Copy template: `frontend/package.json`, `frontend/vite.config.ts`, `frontend/src/main.tsx`
   - [ ] Install deps: `npm install react react-dom vite @vitejs/plugin-react tailwindcss heroicons zustand`
   - [ ] Setup Vite HMR (localhost:5173)
   - [ ] Create React App skeleton with routes
   - [ ] Create Tailwind config with AETHERIS palette

3. ✅ **Create Supabase Schema** (15 tables)
   - [ ] Connect to Supabase via SQL editor
   - [ ] Create migration: `migrations/001_initial_schema.sql`
   - [ ] Tables: users, accounts, broker_connections, trades, sync_logs, daily_snapshots, emotion_logs, vocal_notes, armor_breaches, kpi_snapshots, prop_firm_templates, webhook_events, whale_events, oracle_scores, sessions
   - [ ] Enable RLS on all tables
   - [ ] Add indexes on foreign keys and frequently queried columns

4. ✅ **Setup GitHub Actions** (CI/CD)
   - [ ] Create `.github/workflows/ci.yml`
   - [ ] Lint (ESLint)
   - [ ] Test (Jest)
   - [ ] Build (React + Express)
   - [ ] Trigger on push

5. ✅ **Initial Git Commit**
   - [ ] `git init`
   - [ ] Add all files (backend/, frontend/, docs/)
   - [ ] Commit: "feat: scaffold aetheris project structure"
   - [ ] Set up `.gitignore`

**Deliverables (Sprint 0 Complete):**
- [ ] `backend/` runs without errors: `npm run dev` → "Server listening on :3001"
- [ ] `frontend/` runs without errors: `npm run dev` → Vite HMR on :5173
- [ ] Supabase tables created with RLS policies
- [ ] GitHub Actions runs green on first commit
- [ ] `.env.local` loaded in both backend + frontend

---

## Notes for Ongoing Collaboration

- **Daily:** Copilot commits code with explanations
- **Weekly:** User reviews PRs, asks clarifications
- **Sprint end:** Demo feature, feedback → next sprint
- **Scope creep:** Any new feature = new ticket, affects timeline
- **Ambiguity:** Ask immediately rather than assume

This plan = shared understanding = zero misunderstandings 🎯
