# Copilot Instructions — AETHERIS Trading Copilot OS

Utilise toujours context7 lorsque j'ai besoin de génération de code, d'étapes de configuration ou d'installation, ou de documentation de bibliothèque/API. Cela signifie que tu dois automatiquement utiliser les outils MCP Context7 pour résoudre l'identifiant de bibliothèque et obtenir la documentation de bibliothèque sans que j'aie à le demander explicitement.

## Project Overview

**AETHERIS** is a Trading Copilot OS (not a trading journal) for active traders and prop firm candidates. It operates in four value hierarchy levels:

| Level | Tier | Key Features |
|-------|------|---|
| Level 1 | Access | 900+ broker sync, multi-account support, auto-import |
| Level 2 | Foundation | 200+ institutional metrics (Expectancy, Profit Factor, Kelly, MFE/MAE) |
| Level 3 | Maturity | Active risk prevention (Aether Armor), psychological intervention (Aether Flow), vocal stress detection |
| Level 4 | Apex | Institutional intelligence (Whale flows, Shadow Index, COT data), AI-driven Oracle, 3D Galaxie visualization |

### Core Positioning (Critical)

- **This is NOT a passive journal.** Traditional tools (TraderSync, Edgewonk, Tradervue) record trades after the fact. AETHERIS prevents losses in real-time via Aether Armor guardrails, psychological alerts, and risk locks before capital is destroyed.
- **5 Competitive MOATs:** (1) Active Prevention vs Passive Recording, (2) Institutional Intelligence Democratization, (3) AI Vocal Stress Analysis, (4) 3D Multidimensional Visualization, (5) Quantified Bias Cost (emotional psychology ROI).

**Key personas:** Retail active traders (1-5 years, 5-50 trades/week) and Prop Firm candidates (FTMO, MyForexFunds constraints).

---

## Implementation Phases

### Phase 1: MVP — Infrastructure & Compliance
**Modules:** Auto-Sync (900+ brokers), Visual Calendar Heatmap, Multi-Account Risk Aggregation, Institutional P/L Engine, 200+ KPI Suite, Dynamic Position Sizing, Multi-Format Reporting

### Phase 2: Maturity — Psychology & Active Discipline
**Modules:** Aether Flow (emotion tracking + financial cost quantification), Vocal Stress Score (AI prosodic analysis), Aether Armor (soft breach guardrails + webhooks), Tilt Detection, Discipline Score

### Phase 3: Apex — Institutional Intelligence & 3D
**Modules:** Oracle Consensus (Whale flows, COT, on-chain data), Vocal Analysis (micro-tremor detection), Galaxie 3D (hour × instrument × duration × P/L multidimensional clustering)

---

## Documentation References

- **Main PRD:** `AETHERIS_PRD_Technique_Exhaustif.md` — Complete 600+ line technical specification with database schemas, formulas, UI specs
- **Backlog & Design:** `documents/AETHERIS_Backlog_DesignSystem_2026.md` — Module breakdowns, design tokens, color palette
- **Icon System:** `aetheris-icons-preview.html` — 41-icon Heroicons sprite (4 categories: Sidebar, KPI, Actions, Armor)
- **Plan:** Session plan available at session state folder

---

## Icon System (aetheris-icons-preview.html)

**41 Heroicons v2.2.0 (MIT License)** organized in 4 semantic categories. All icons use `currentColor` for dynamic coloring per AETHERIS palette.

### Sidebar Navigation (9 icons) — Accent: Gold `#C9A050`
| Icon ID | Heroicon | Module |
|---------|----------|--------|
| `#sidebar-dashboard` | home | M1 Dashboard |
| `#sidebar-journal` | book-open | M2 Workspace Journal |
| `#sidebar-analytics` | chart-bar | M3 Analytics & Performance |
| `#sidebar-aether-flow` | microphone | M4 Aether Flow Psychologie |
| `#sidebar-aether-armor` | shield-check | M5 Aether Armor Protection |
| `#sidebar-oracle` | sparkles | M6 Oracle Consensus |
| `#sidebar-galaxie-3d` | cube-transparent | M7 Galaxie 3D |
| `#sidebar-tax-engine` | document-currency-euro | M8 Tax Engine |
| `#sidebar-settings` | cog-6-tooth | M9 Settings & Integrations |

### KPI Dashboard Cards (10 icons) — Accent: Emerald `#0E765E`
| Icon ID | Heroicon | Metric |
|---------|----------|--------|
| `#kpi-winrate` | arrow-trending-up | Win Rate % |
| `#kpi-profit-factor` | bolt | Profit Factor |
| `#kpi-expectancy` | scale | Expectancy per Trade |
| `#kpi-drawdown` | arrow-trending-down | Max Drawdown |
| `#kpi-sharpe` | chart-pie | Sharpe/Sortino Ratio |
| `#kpi-trades` | rectangle-stack | Total Trades Count |
| `#kpi-r-multiple` | star | R-Multiple |
| `#kpi-duration` | clock | Avg Trade Duration |
| `#kpi-pnl` | banknotes | P/L Net Total |
| `#kpi-mfe-mae` | arrows-up-down | MFE / MAE Ratio |

### Action Buttons (10 icons) — Accent: Steel `#2F6792`
| Icon ID | Heroicon | Action |
|---------|----------|--------|
| `#action-add-trade` | plus-circle | Add Trade Manual Entry |
| `#action-import` | arrow-down-tray | Import CSV File |
| `#action-export` | arrow-up-tray | Export PDF/CSV/Excel |
| `#action-sync` | arrows-right-left | Sync Broker Connection |
| `#action-filter` | adjustments-horizontal | Filters & Segmentation |
| `#action-search` | magnifying-glass-plus | Full-Text Search |
| `#action-share` | arrow-top-right-on-square | Share Report Link |
| `#action-record` | microphone | Start Vocal Recording |
| `#action-delete` | trash | Delete Trade |
| `#action-edit` | pencil-square | Edit Trade Details |

### Armor & Alert Badges (12 icons) — Accent: Crimson `#AF2D2D`
| Icon ID | Heroicon | Alert Type |
|---------|----------|------------|
| `#armor-shield-ok` | shield-check (green) | Armor Nominal ✓ |
| `#armor-shield-alert` | shield-exclamation | Armor Alert Level |
| `#armor-bell` | bell-alert | Active Alert Notification |
| `#armor-bell-snooze` | bell-snooze | Alert Snoozed |
| `#armor-fire` | fire | Tilt Session Active |
| `#armor-lock` | lock-closed | Session Locked |
| `#armor-webhook` | signal | Webhook Active |
| `#armor-cooling` | moon | Cooling Period |
| `#armor-revenge` | bolt | Revenge Trading Detected |
| `#armor-whale` | globe-alt | Whale Impact Correlated |
| `#armor-check` | check-circle | Validation / Success |
| `#armor-warning` | exclamation-triangle | General Warning |

**Icon Usage in Code:**
```html
<!-- Sprite reference (SVG sprite at aetheris-icons-preview.html) -->
<svg width="24" height="24" class="icon">
  <use href="#sidebar-dashboard"></use>
</svg>

<!-- With AETHERIS color override -->
<svg width="24" height="24" style="color: #C9A050">
  <use href="#sidebar-dashboard"></use>
</svg>
```

---

## Design System & Color Tokens

All UI must use the official AETHERIS Palette v1.0 (non-negotiable). Define as CSS variables or Tailwind config:

```css
:root {
  --color-gold:     #C9A050;  /* Prestige, titles, elite scores, USP badges */
  --color-night:    #0A1321;  /* Dark mode background, main canvas */
  --color-navy:     #193452;  /* Structural blocks, cards, modules */
  --color-steel:    #2F6792;  /* Epics, technical sections, mid-hierarchy */
  --color-emerald:  #0E765E;  /* Profits, wins, validated discipline */
  --color-crimson:  #AF2D2D;  /* Losses, critical Armor alerts, errors */
  --color-white:    #FFFFFF;  /* High-contrast text on dark */
  --color-slate:    #B8C1CC;  /* Subtitles, labels, metadata */
}
```

**Aether Armor Alert Hierarchy:**
- **Level 1 (50% MDL):** Gold `#C9A050` — soft warning banner
- **Level 2 (75% MDL):** Deep Gold `#8B6A20` — modal confirmation required
- **Level 3 (90% MDL):** Crimson `#AF2D2D` — full-screen pulsing + webhook trigger

---

## Database Schema Overview

**Core Collections** (from PRD Section 4):

### Authentication & Accounts
- `users` — Account holders with KYC/AML status
- `accounts` — Trading accounts (personal, prop firm, crypto) with risk limits
- `broker_connections` — API credentials + sync status per broker

### Trading Data
- `trades` — Individual trade records with entry/exit, fees, slippage
- `sync_logs` — Import audit trail (new, duplicates, errors per broker)
- `daily_snapshots` — Aggregated P/L + metrics per day (feeds heatmap)

### Psychology & Risk
- `emotion_logs` — Bias tags (FOMO, REVENGE, OVERCONFIDENCE, etc.) + financial cost attributed
- `vocal_notes` — Audio recordings + Vocal Stress Score timeline + AI transcription
- `armor_breaches` — Soft/hard breach events with timestamps

### Key Design Rules
- **Deduplication:** `broker_trade_id` is UNIQUE to prevent re-sync duplicates
- **Conflict resolution:** Configurable `IGNORE|OVERWRITE|ASK` strategy
- **Fallback polling:** 10s retry if broker API unavailable
- **Data integrity:** Audit trail for compliance (KYC/AML logging)

---

## API Architectural Patterns

### Broker Connector Pattern (Critical for Phase 1)
Create abstract broker interface:
```typescript
interface IBrokerConnector {
  authenticate(credentials: BrokerCredentials): Promise<void>;
  fetchTrades(account_id: string, since?: Date): Promise<Trade[]>;
  fetchBalance(): Promise<{equity: number, available_margin: number}>;
  parseCSV(csv_buffer: Buffer): Promise<Trade[]>;
}
```

Implementations for major brokers (prioritize MT4, FIX, REST API variants). Deduplication logic in sync layer prevents broker_trade_id duplicates.

### Metrics Engine Pattern (Critical for Phase 1)
- **Input:** Trades + account state
- **Output:** 200+ KPIs across 5 categories (Execution, Risk, Robustness, Resilience, Temporal)
- Each KPI needs: current value, sector benchmark, color status (emerald/gold/crimson), historical trend, LaTeX tooltip

Key formulas in PRD Annexe Section 4:
- **Expectancy** = (Win% × Avg Win) − (Loss% × Avg Loss)
- **Profit Factor** = Gross Profit / Gross Loss
- **R-Multiple** = Net Profit / Risk Per Trade
- **Kelly Criterion** = (Win% × Avg Win Size − Loss% × Avg Loss Size) / Avg Win Size
- **MFE/MAE** = (Max Favorable Excursion / Max Adverse Excursion) — execution efficiency

### Risk Aggregation Pattern
Multi-account risk roll-up:
```
GET /api/v1/risk/aggregated
  → total_drawdown (weighted by capital)
  → cross_account_correlation_alerts
  → prop_firm_rule_violations (MDL, trailing DD, etc.)
```

---

## Frontend Architecture Conventions

### Component Structure
- **Pages:** Dashboard, Trade Log, Analytics, Reports, Settings
- **Modules:** 
  - Visual Calendar Heatmap (GitHub contribution style, 7×5 grid, bi-directional color gradient green/red)
  - Risk Aggregation Panel (multi-account consolidated view)
  - Metrics Grid (10 KPI cards with color-coded status)
  - Alert Center (Armor breach notifications, Level 1-3 hierarchy)

### Component Icon Associations
- **Sidebar:** Use gold accent icons for main navigation
- **KPI Cards:** Use emerald accent icons with dark navy `#193452` backgrounds
- **Action Bars:** Use steel accent icons for button groups (import, export, sync, filter, record)
- **Alert Zones:** Use crimson accent icons for Armor breaches, warnings, fire states

### State Management
- Auth context (JWT + role-based access)
- Account selection (filter all data by selected account)
- Date range selection (powers heatmap, metrics, exports)

### Design Patterns
- **Heatmap:** GitHub-style 7×5 grid, gradient relative to monthly max P/L (emerald positive, crimson negative, slate inactive)
- **Metrics cards:** Use `--color-navy` backgrounds, `--color-gold` headings, conditional `--color-emerald` (positive) / `--color-crimson` (negative) values
- **Alerts:** Banner (Level 1), Modal (Level 2), Full-screen pulse (Level 3)
- **Icon hover states:** Sidebar icons → gold, KPI icons → emerald, Action icons → steel, Armor icons → crimson

---

## Build & Test Commands (When Code Exists)

> *This section will be updated once backend/frontend scaffolding is established. Expected stack decisions:*
> - Backend: Node.js/Express, Python/FastAPI, or Go
> - Frontend: React + Vite, Vue 3, or Next.js
> - Database: PostgreSQL (recommended for compliance audit trails)
> - Testing: Jest (frontend), pytest/Mocha (backend)

**Placeholder commands:**
```bash
# Backend tests (run specific test file)
npm run test -- --testNamePattern="Broker Sync"

# Frontend component tests
npm run test:ui -- src/components/HeatmapCalendar

# Linting
npm run lint
npm run format:check

# Build
npm run build
npm run build:docker
```

---

## Security & Secrets Management

### Never Commit These Files
- `.env.local` (in .gitignore) — Local environment variables
- `.copilot/.env.local` (in .gitignore) — Copilot-specific secrets
- Broker API keys — Always use database encryption or secure environment variables
- AWS credentials, OAuth tokens, OpenAI API keys

### Reference Documentation
- **SECURITY_SECRETS.md** — Complete secrets management strategy
- **CREDENTIAL_ROTATION_CHECKLIST.md** — Step-by-step credential rotation procedures
- **.env.example** — Safe template to commit (no real values)

### Pre-Commit Hooks (git-secrets)

Prevent accidental commits of secrets using git-secrets:

```bash
# Install git-secrets
brew install git-secrets  # macOS
# or apt-get install git-secrets  # Linux
# or download from https://github.com/awslabs/git-secrets

# Configure for AETHERIS
git secrets --install
git secrets --register-aws
git secrets --add 'sk-.*'  # OpenAI API key pattern
git secrets --add 'FTMO_.*'  # Prop firm API keys
git secrets --add 'broker_.*_key'  # Broker-specific patterns

# Scan entire repo for secrets
git secrets --scan
```

### Environment Variable Pattern
```bash
# .env.example (commit this)
BROKER_API_KEY=your_broker_api_key_here
DATABASE_URL=postgres://user:password@localhost/dbname
OPENAI_API_KEY=sk-...

# .env.local (gitignored, never commit)
BROKER_API_KEY=sk_live_abc123xyz...
DATABASE_URL=postgres://prod_user:SecurePassword123@db.prod.com/aetheris_prod
OPENAI_API_KEY=sk-real-key-here
```

### Broker Credential Storage Best Practice
1. **At Rest:** Encrypt broker credentials in database using application-level encryption (AES-256)
2. **In Transit:** Always use HTTPS; validate SSL certificates
3. **Access:** Use environment variables for DB encryption keys, never hardcode
4. **Rotation:** Implement credential rotation checklist quarterly (see CREDENTIAL_ROTATION_CHECKLIST.md)
5. **Audit:** Log all credential access attempts to audit trail

### Compliance Notes
- KYC/AML audit trail required for all credential changes
- Soft breach events logged when credentials expire or rotation fails
- Webhook notification on unusual credential access patterns

---

## Key Conventions & Gotchas

### Naming Conventions
- **Database fields:** snake_case (e.g., `broker_trade_id`, `vss_score`)
- **API routes:** kebab-case (e.g., `/api/v1/broker-sync`, `/api/v1/risk-aggregated`)
- **React components:** PascalCase (e.g., `HeatmapCalendar`, `ArmorBreachAlert`)
- **Environment variables:** SCREAMING_SNAKE_CASE (e.g., `BROKER_API_KEY`, `DATABASE_URL`)
- **Icon IDs:** kebab-case with category prefix (e.g., `#sidebar-dashboard`, `#kpi-winrate`, `#armor-shield-ok`)

### Phase-Gated Features
- **Phase 1 ONLY:** Do NOT implement vocal stress analysis, Whale flows, or 3D visualization yet
- **Phase 2+ Features** should be feature-flagged or behind permission checks to prevent scope creep
- Use feature flags in code: `if (FEATURE_FLAGS.PHASE_2_PSYCHOLOGY) { ... }`

### Compliance & Audit
- Every trade import logs: `sync_logs.trades_new, trades_duplicate, trades_error`
- User actions triggering risk changes must log to audit trail for KYC/AML
- Soft breach events stored in `armor_breaches` with timestamps (prevents claim disputes)

### Broker API Integration
- Always implement **retry logic** (exponential backoff: 1s → 2s → 4s → fallback polling)
- Cache broker metadata (instrument lists, commission schedules) for 1 hour to reduce API calls
- Map broker-specific fields to canonical trade schema before storing

### Metrics Calculation
- **Do NOT calculate live during UI load.** Pre-compute in `daily_snapshots` or cache results
- For real-time P/L widgets, only sum open position states (fast query)
- Store historical metric snapshots (daily) to avoid recalculating 1000s of trades on every view

### Vocal Stress Analysis (Phase 2)
- Audio files encrypted at rest (S3 bucket encryption)
- VSS (Vocal Stress Score) computed on-device or secure cloud (OpenAI Whisper + custom prosodic model)
- Never expose raw audio in logs; only store transcript + VSS timeline

### Icon Implementation
- Load SVG sprite once at app mount (cache in memory)
- Use `<use href="#icon-id">` pattern for all icon references
- Always wrap in `<svg>` wrapper to control size (default 24x24px)
- Apply color dynamically via `style="color: var(--color-gold)"` on the wrapper, NOT the use element
- Test icon rendering at 16px, 24px, 32px sizes (common UI scales)

---

## Copilot Permissions

Your actions are scoped by `.copilot/settings.local.json`. Currently allowed:
- File operations: Read, Write, Edit
- Git operations: init, add, commit, remote, branch, push, status, diff, log
- Build tools: Bash (grep, find, python, pytest, ruff, touch, chmod, cat, mkdir, mv)
- External: WebFetch (any domain), GitHub CLI (gh issue view), Skill(*)

---

## Getting Started on Implementation

1. **Confirm tech stack** (Node/Python, React/Vue, PostgreSQL/MongoDB)
2. **Scaffold repository structure:** `backend/`, `frontend/`, `docs/`, `tests/`
3. **Copy/embed icon sprite:** Reference `aetheris-icons-preview.html` SVG sprite or export as standalone
4. **Create database schema** from PRD Section 4 (users, accounts, broker_connections, trades, etc.)
5. **Build broker connector abstraction** (Phase 1 MVP blocker)
6. **Implement metrics engine** (Expectancy, Profit Factor, KPI suite)
7. **Build Visual Calendar Heatmap** (critical early deliverable for UX validation)

---

## Questions or Ambiguities?

If implementation details conflict with this document, PRD takes precedence. Refer to:
- **Section 3 (Exigences Fonctionnelles par Phase)** for module specs
- **Section 4 (Annexe Technique)** for metric formulas
- **Section 5 (UI/UX Design System)** for component specifications
- **Section 6 (Logique d'Implémentation Détaillée)** for workflow sequences
- **aetheris-icons-preview.html** for icon system reference and all 41 symbols
