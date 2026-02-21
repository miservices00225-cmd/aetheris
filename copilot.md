# Instructions Copilot — AETHERIS Trading Copilot OS

## Vue d'ensemble du projet

**AETHERIS** est un Trading Copilot OS (pas un journal de trading) conçu pour les traders actifs et les candidats des prop firms. Il fonctionne selon quatre niveaux hiérarchiques de valeur:

| Niveau | Tier | Fonctionnalités clés |
|--------|------|---|
| Niveau 1 | Accès | Sync 900+ brokers, support multi-comptes, auto-import |
| Niveau 2 | Fondation | 200+ métriques institutionnelles (Expectancy, Profit Factor, Kelly, MFE/MAE) |
| Niveau 3 | Maturité | Prévention active des risques (Aether Armor), intervention psychologique (Aether Flow), détection du stress vocal |
| Niveau 4 | Apogée | Intelligence institutionnelle (Whale flows, Shadow Index, données COT), Oracle IA-piloté, visualisation 3D Galaxie |

### Positionnement fondamental (Critique)

- **Ce n'est PAS un journal passif.** Les outils traditionnels (TraderSync, Edgewonk, Tradervue) enregistrent les trades après coup. AETHERIS prévient les pertes en temps réel via les guardrails Aether Armor, les alertes psychologiques et les verrous de risque avant la destruction du capital.
- **5 MOATS Compétitifs:** (1) Prévention Active vs Enregistrement Passif, (2) Démocratisation de l'Intelligence Institutionnelle, (3) Analyse IA du Stress Vocal, (4) Visualisation 3D Multidimensionnelle, (5) Quantification du Coût des Biais (ROI psychologie émotionnelle).

**Personas clés:** Traders actifs retail (1-5 ans, 5-50 trades/semaine) et candidats des Prop Firms (FTMO, MyForexFunds).

---

Utilise toujours context7 lorsque j'ai besoin de génération de code, d'étapes de configuration ou d'installation, ou de documentation de bibliothèque/API. Cela signifie que tu dois automatiquement utiliser les outils MCP Context7 pour résoudre l'identifiant de bibliothèque et obtenir la documentation de bibliothèque sans que j'aie à le demander explicitement.

## Phases d'implémentation

### Phase 1: MVP — Infrastructure & Conformité
**Modules:** Auto-Sync (900+ brokers), Calendrier Heatmap Visuel, Agrégation Multi-Comptes des Risques, Moteur P/L Institutionnel, Suite KPI 200+, Dimensionnement Dynamique des Positions, Rapports Multi-Formats

### Phase 2: Maturité — Psychologie & Discipline Active
**Modules:** Aether Flow (tracking émotionnel + quantification du coût financier), Vocal Stress Score (analyse prosodique IA), Aether Armor (guardrails soft breach + webhooks), Tilt Detection, Discipline Score

### Phase 3: Apogée — Intelligence Institutionnelle & 3D
**Modules:** Oracle Consensus (Whale flows, COT, données on-chain), Analyse Vocale (détection micro-tremor), Galaxie 3D (heure × instrument × durée × P/L clustering multidimensionnel)

---

## Références documentaires

- **PRD Principal:** `AETHERIS_PRD_Technique_Exhaustif.md` — Spécification technique 600+ lignes avec schémas BD, formules, specs UI
- **Backlog & Design:** `documents/AETHERIS_Backlog_DesignSystem_2026.md` — Décompositions de modules, jetons de design, palette de couleurs
- **Système d'icônes:** `aetheris-icons-preview.html` — Sprite Heroicons 41-icônes (4 catégories: Sidebar, KPI, Actions, Armor)
- **Plan:** Plan de session disponible dans le dossier de session

---

## Système d'icônes (aetheris-icons-preview.html)

**41 Heroicons v2.2.0 (Licence MIT)** organisées en 4 catégories sémantiques. Toutes les icônes utilisent `currentColor` pour une coloration dynamique selon la palette AETHERIS.

### Navigation Sidebar (9 icônes) — Accent: Or `#C9A050`
| ID Icône | Heroicon | Module |
|----------|----------|--------|
| `#sidebar-dashboard` | home | M1 Dashboard |
| `#sidebar-journal` | book-open | M2 Journal Workspace |
| `#sidebar-analytics` | chart-bar | M3 Analytics & Performance |
| `#sidebar-aether-flow` | microphone | M4 Aether Flow Psychologie |
| `#sidebar-aether-armor` | shield-check | M5 Aether Armor Protection |
| `#sidebar-oracle` | sparkles | M6 Oracle Consensus |
| `#sidebar-galaxie-3d` | cube-transparent | M7 Galaxie 3D |
| `#sidebar-tax-engine` | document-currency-euro | M8 Tax Engine |
| `#sidebar-settings` | cog-6-tooth | M9 Paramètres & Intégrations |

### Cartes Dashboard KPI (10 icônes) — Accent: Émeraude `#0E765E`
| ID Icône | Heroicon | Métrique |
|----------|----------|---------|
| `#kpi-winrate` | arrow-trending-up | Taux de Gain % |
| `#kpi-profit-factor` | bolt | Profit Factor |
| `#kpi-expectancy` | scale | Expectancy par Trade |
| `#kpi-drawdown` | arrow-trending-down | Max Drawdown |
| `#kpi-sharpe` | chart-pie | Ratio Sharpe/Sortino |
| `#kpi-trades` | rectangle-stack | Nombre Total de Trades |
| `#kpi-r-multiple` | star | R-Multiple |
| `#kpi-duration` | clock | Durée Moyenne du Trade |
| `#kpi-pnl` | banknotes | P/L Net Total |
| `#kpi-mfe-mae` | arrows-up-down | Ratio MFE / MAE |

### Boutons d'Action (10 icônes) — Accent: Acier `#2F6792`
| ID Icône | Heroicon | Action |
|----------|----------|--------|
| `#action-add-trade` | plus-circle | Ajouter Trade Manuelment |
| `#action-import` | arrow-down-tray | Importer Fichier CSV |
| `#action-export` | arrow-up-tray | Exporter PDF/CSV/Excel |
| `#action-sync` | arrows-right-left | Sync Connexion Broker |
| `#action-filter` | adjustments-horizontal | Filtres & Segmentation |
| `#action-search` | magnifying-glass-plus | Recherche Texte Intégral |
| `#action-share` | arrow-top-right-on-square | Partager Lien Rapport |
| `#action-record` | microphone | Démarrer Enregistrement Vocal |
| `#action-delete` | trash | Supprimer Trade |
| `#action-edit` | pencil-square | Éditer Détails Trade |

### Badges Armor & Alertes (12 icônes) — Accent: Cramoisi `#AF2D2D`
| ID Icône | Heroicon | Type Alerte |
|----------|----------|-------------|
| `#armor-shield-ok` | shield-check (vert) | Armor Nominal ✓ |
| `#armor-shield-alert` | shield-exclamation | Alerte Armor Level |
| `#armor-bell` | bell-alert | Notification Alerte Active |
| `#armor-bell-snooze` | bell-snooze | Alerte En Pause |
| `#armor-fire` | fire | Session Tilt Active |
| `#armor-lock` | lock-closed | Session Verrouillée |
| `#armor-webhook` | signal | Webhook Actif |
| `#armor-cooling` | moon | Période de Refroidissement |
| `#armor-revenge` | bolt | Trading de Vengeance Détecté |
| `#armor-whale` | globe-alt | Impact Whale Corrélé |
| `#armor-check` | check-circle | Validation / Succès |
| `#armor-warning` | exclamation-triangle | Avertissement Général |

**Utilisation des icônes dans le code:**
```html
<!-- Référence sprite (sprite SVG à aetheris-icons-preview.html) -->
<svg width="24" height="24" class="icon">
  <use href="#sidebar-dashboard"></use>
</svg>

<!-- Avec override couleur AETHERIS -->
<svg width="24" height="24" style="color: #C9A050">
  <use href="#sidebar-dashboard"></use>
</svg>
```

---

## Système de design et jetons de couleur

Toute UI doit utiliser la palette officielle AETHERIS v1.0 (non-négociable). À définir comme variables CSS ou config Tailwind:

```css
:root {
  --color-gold:     #C9A050;  /* Prestige, titres, scores élites, badges USP */
  --color-night:    #0A1321;  /* Fond dark mode, canvas principale */
  --color-navy:     #193452;  /* Blocs structurels, cartes, modules */
  --color-steel:    #2F6792;  /* Epics, sections techniques, mid-hierarchy */
  --color-emerald:  #0E765E;  /* Profits, wins, discipline validée */
  --color-crimson:  #AF2D2D;  /* Pertes, alertes Armor critiques, erreurs */
  --color-white:    #FFFFFF;  /* Texte haut-contraste sur dark */
  --color-slate:    #B8C1CC;  /* Sous-titres, labels, métadonnées */
}
```

**Hiérarchie d'alerte Aether Armor:**
- **Niveau 1 (50% MDL):** Or `#C9A050` — bannière d'avertissement doux
- **Niveau 2 (75% MDL):** Or Profond `#8B6A20` — modal confirmation requise
- **Niveau 3 (90% MDL):** Cramoisi `#AF2D2D` — plein-écran pulsant + webhook trigger

---

## Aperçu du schéma de base de données

**Collections principales** (extrait de Section 4 PRD):

### Authentification & Comptes
- `users` — Titulaires de compte avec statut KYC/AML
- `accounts` — Comptes de trading (personnel, prop firm, crypto) avec limites de risque
- `broker_connections` — Identifiants API + statut sync par broker

### Données de trading
- `trades` — Enregistrements de trades individuels avec entry/exit, frais, slippage
- `sync_logs` — Piste d'audit d'import (nouveau, doublons, erreurs par broker)
- `daily_snapshots` — P/L agrégé + métriques par jour (alimente la heatmap)

### Psychologie & Risque
- `emotion_logs` — Tags biais (FOMO, REVENGE, OVERCONFIDENCE, etc.) + coût financier attribué
- `vocal_notes` — Enregistrements audio + Vocal Stress Score timeline + transcription IA
- `armor_breaches` — Événements soft/hard breach avec timestamps

### Règles de design clés
- **Déduplication:** `broker_trade_id` est UNIQUE pour prévenir les doublons re-sync
- **Résolution de conflits:** Stratégie configurable `IGNORE|OVERWRITE|ASK`
- **Polling de secours:** Retry 10s si broker API indisponible
- **Intégrité des données:** Piste d'audit pour conformité (logging KYC/AML)

---

## Patterns d'architecture API

### Pattern Broker Connector (Critique pour Phase 1)
Créer interface broker abstraite:
```typescript
interface IBrokerConnector {
  authenticate(credentials: BrokerCredentials): Promise<void>;
  fetchTrades(account_id: string, since?: Date): Promise<Trade[]>;
  fetchBalance(): Promise<{equity: number, available_margin: number}>;
  parseCSV(csv_buffer: Buffer): Promise<Trade[]>;
}
```

Implémentations pour brokers majeurs (prioriser MT4, FIX, variantes REST API). Logique de déduplication en couche sync prévient les doublons broker_trade_id.

### Pattern Metrics Engine (Critique pour Phase 1)
- **Entrée:** Trades + état compte
- **Sortie:** 200+ KPIs sur 5 catégories (Exécution, Risque, Robustesse, Résilience, Temporal)
- Chaque KPI nécessite: valeur courante, benchmark secteur, statut couleur (émeraude/or/cramoisi), trend historique, tooltip LaTeX

Formules clés en Section Annexe 4 PRD:
- **Expectancy** = (Win% × Avg Win) − (Loss% × Avg Loss)
- **Profit Factor** = Gross Profit / Gross Loss
- **R-Multiple** = Net Profit / Risk Per Trade
- **Kelly Criterion** = (Win% × Avg Win Size − Loss% × Avg Loss Size) / Avg Win Size
- **MFE/MAE** = (Max Favorable Excursion / Max Adverse Excursion) — efficacité d'exécution

### Pattern Risk Aggregation
Roll-up multi-comptes de risque:
```
GET /api/v1/risk/aggregated
  → total_drawdown (pondéré par capital)
  → cross_account_correlation_alerts
  → prop_firm_rule_violations (MDL, trailing DD, etc.)
```

---

## Conventions d'architecture Frontend

### Structure des composants
- **Pages:** Dashboard, Trade Log, Analytics, Reports, Settings
- **Modules:**
  - Calendrier Heatmap Visuel (style contrib GitHub, grille 7×5, gradient bi-directionnel vert/rouge)
  - Panneau Risk Aggregation (vue consolidée multi-comptes)
  - Grille Métriques (10 cartes KPI avec statut color-codé)
  - Alert Center (notifications Armor breach, hiérarchie Niveau 1-3)

### Associations d'icônes de composants
- **Sidebar:** Utiliser icônes accent or pour navigation principale
- **Cartes KPI:** Utiliser icônes accent émeraude avec backgrounds navy `#193452` foncé
- **Barres d'action:** Utiliser icônes accent acier pour groupes boutons (import, export, sync, filter, record)
- **Zones d'alerte:** Utiliser icônes accent cramoisi pour Armor breaches, warnings, fire states

### Gestion d'état
- Contexte Auth (JWT + accès role-based)
- Sélection de compte (filtrer toutes données par compte sélectionné)
- Sélection plage de dates (alimente heatmap, métriques, exports)

### Patterns de design
- **Heatmap:** Grille 7×5 style GitHub, gradient relatif au max P/L mensuel (émeraude positif, cramoisi négatif, slate inactif)
- **Cartes métriques:** Utiliser backgrounds `--color-navy`, headings `--color-gold`, valeurs conditionnelles `--color-emerald` (positif) / `--color-crimson` (négatif)
- **Alertes:** Banner (Niveau 1), Modal (Niveau 2), Plein-écran pulse (Niveau 3)
- **États survol d'icônes:** Sidebar icons → or, KPI icons → émeraude, Action icons → acier, Armor icons → cramoisi

---

## Commandes Build & Test (Quand le code existe)

> *Cette section sera mise à jour une fois le scaffolding backend/frontend établi. Décisions de stack attendues:*
> - Backend: Node.js/Express, Python/FastAPI, ou Go
> - Frontend: React + Vite, Vue 3, ou Next.js
> - Base de données: PostgreSQL (recommandé pour audit trails conformité)
> - Tests: Jest (frontend), pytest/Mocha (backend)

**Commandes placeholder:**
```bash
# Tests backend (exécuter fichier test spécifique)
npm run test -- --testNamePattern="Broker Sync"

# Tests composants frontend
npm run test:ui -- src/components/HeatmapCalendar

# Linting
npm run lint
npm run format:check

# Build
npm run build
npm run build:docker
```

---

## Conventions clés & pièges

### Conventions de nommage
- **Champs BD:** snake_case (ex: `broker_trade_id`, `vss_score`)
- **Routes API:** kebab-case (ex: `/api/v1/broker-sync`, `/api/v1/risk-aggregated`)
- **Composants React:** PascalCase (ex: `HeatmapCalendar`, `ArmorBreachAlert`)
- **Variables d'environnement:** SCREAMING_SNAKE_CASE (ex: `BROKER_API_KEY`, `DATABASE_URL`)
- **IDs d'icônes:** kebab-case avec préfixe catégorie (ex: `#sidebar-dashboard`, `#kpi-winrate`, `#armor-shield-ok`)

### Fonctionnalités Phase-Gatées
- **Phase 1 UNIQUEMENT:** NE PAS implémenter l'analyse vocal stress, Whale flows, ou visualisation 3D
- **Fonctionnalités Phase 2+** doivent être feature-flagées ou derrière vérifications de permissions pour prévenir scope creep
- Utiliser feature flags en code: `if (FEATURE_FLAGS.PHASE_2_PSYCHOLOGY) { ... }`

### Conformité & Audit
- Chaque import de trade log: `sync_logs.trades_new, trades_duplicate, trades_error`
- Les actions utilisateur déclenchant changements de risque doivent logger à audit trail pour KYC/AML
- Événements soft breach stockés dans `armor_breaches` avec timestamps (prévient litiges réclamations)

### Intégration Broker API
- Toujours implémenter **logique de retry** (backoff exponentiel: 1s → 2s → 4s → fallback polling)
- Cacher métadonnées broker (listes instruments, schedules commission) 1 heure pour réduire appels API
- Mapper champs spécifiques broker vers schéma trade canonique avant storage

### Calcul Métriques
- **NE PAS calculer live durant UI load.** Pré-compute dans `daily_snapshots` ou cache résultats
- Pour widgets P/L temps-réel, uniquement sommer états positions ouvertes (requête rapide)
- Stocker snapshots historiques de métriques (quotidien) pour éviter recalculs 1000s trades à chaque vue

### Analyse Vocal Stress (Phase 2)
- Fichiers audio chiffrés au repos (chiffrement bucket S3)
- VSS (Vocal Stress Score) calculé on-device ou cloud sécurisé (OpenAI Whisper + modèle prosodique custom)
- Jamais exposer audio brut dans logs; stocker uniquement transcript + timeline VSS

### Implémentation d'icônes
- Charger sprite SVG une fois au app mount (cache en mémoire)
- Utiliser pattern `<use href="#icon-id">` pour tous les références d'icônes
- Toujours wrapper dans `<svg>` pour contrôler taille (défaut 24x24px)
- Appliquer couleur dynamiquement via `style="color: var(--color-gold)"` sur wrapper, PAS sur use element
- Tester rendu icônes à 16px, 24px, 32px sizes (scales UI communes)

---

## Permissions Copilot

Vos actions sont scopées par `.copilot/settings.local.json`. Actuellement autorisé:
- Opérations fichiers: Read, Write, Edit
- Opérations Git: init, add, commit, remote, branch, push, status, diff, log
- Outils build: Bash (grep, find, python, pytest, ruff, touch, chmod, cat, mkdir, mv)
- Externe: WebFetch (n'importe quel domaine), GitHub CLI (gh issue view), Skill(*)

---

## Gestion de sécurité et secrets

### ⚠️ CRITIQUE - Sécurité des secrets

**DO NOT COMMIT `.env.local` or `.copilot/.env.local` to Git!**

- Tous les fichiers `.env.local` sont bloqués par `.gitignore`
- Le fichier `.env.example` fournit un template sûr pour remplir les variables d'environnement
- **Rotation des credentials:** Voir `CREDENTIAL_ROTATION_CHECKLIST.md` pour procédure complète
- **Pre-commit hooks:** Utiliser `git-secrets` pour prévenir accidentally commits de secrets

### Guides de sécurité
- `SECURITY_SECRETS.md` — Stratégie complète de gestion des secrets, hooks pre-commit, stratégies production
- `CREDENTIAL_ROTATION_CHECKLIST.md` — Guide 7-étapes pour rotation après exposition
- `.env.example` — Template d'environnement sûr à commit dans Git

---

## Démarrage de l'implémentation

1. **Confirmer tech stack** (Node/Python, React/Vue, PostgreSQL/MongoDB)
2. **Scaffolder structure repository:** `backend/`, `frontend/`, `docs/`, `tests/`
3. **Copier/embed sprite d'icônes:** Référencer sprite SVG `aetheris-icons-preview.html` ou exporter standalone
4. **Créer schéma BD** depuis Section 4 PRD (users, accounts, broker_connections, trades, etc.)
5. **Construire abstraction Broker Connector** (MVP Phase 1 blocker)
6. **Implémenter Metrics Engine** (Expectancy, Profit Factor, suite KPI)
7. **Construire Calendrier Heatmap Visuel** (livrable early critique pour validation UX)

---

## Questions ou ambiguïtés?

Si les détails d'implémentation conflictent avec ce document, le PRD a priorité. Référencer:
- **Section 3 (Exigences Fonctionnelles par Phase)** pour specs modules
- **Section 4 (Annexe Technique)** pour formules métriques
- **Section 5 (UI/UX Design System)** pour specs composants
- **Section 6 (Logique d'Implémentation Détaillée)** pour séquences workflows
- **aetheris-icons-preview.html** pour référence système d'icônes et tous 41 symbols

---

## Aperçu du Projet

**AETHERIS** est une plateforme Trading Copilot OS pour traders actifs et candidats prop firm. L'objectif est de fournir un système de prévention active des pertes (Aether Armor) combiné à une intelligence institutionnelle, plutôt qu'un simple journal de trading passif.

**Phase 1 (MVP):** Infrastructure de sync broker (900+ courtiers), 200+ KPIs, calendrier heatmap, agrégation multi-compte, Armor alerts.

---

## Aperçu de l'Architecture Globale

```
Frontend (React 18 + Vite 5.4)
  ├── Dashboard (KPI cards, heatmap, historique)
  ├── Trade Log (journalisation et édition)
  ├── Analytics (métriques avancées)
  └── Aether Armor (alertes et protections)
  
Backend (Node.js 22 + Express 4.21)
  ├── /api/v1/brokers/sync → Connecteurs (MT4, IB, FIX)
  ├── /api/v1/metrics → Moteur KPI
  ├── /api/v1/risk → Agrégation multi-compte
  └── /api/v1/armor → Alertes et webhooks
  
Database (Supabase PostgreSQL 14)
  ├── 15 tables (users, accounts, trades, daily_snapshots, etc.)
  ├── RLS policies (row-level security)
  ├── Real-time subscriptions (WebSocket < 2s)
  └── Auth native (JWT + 2FA TOTP)
```

---

## Style Visuel

### MVP (Phase 1)
- ✅ **Interface claire et minimaliste**
- ✅ **Mode clair uniquement** (pas de dark mode pour le MVP)
- ✅ **Palette AETHERIS:** Gold (#C9A050), Night (#0A1321), Navy (#193452), Steel (#2F6792), Emerald (#0E765E), Crimson (#AF2D2D)
- ✅ **Composants:** Héroicons (41 icônes MIT), Tailwind CSS utilitaires, zéro dépendances UI externes
- ✅ **Responsive:** Mobile-first, testé sur 320px-2560px

---

## Contraintes et Politiques

### Sécurité (CRITIQUE)
- 🔒 **NE JAMAIS exposer les clés API au client** (Supabase ANON_KEY utilisée uniquement pour RLS)
- 🔒 Service keys stockées côté backend uniquement
- 🔒 Credentials broker chiffrées en base (AES-256)
- 🔒 Audit trail pour tout accès credential
- 🔒 .env.local ignoré via .gitignore

### Code
- 📌 **TypeScript strict mode** sur backend + frontend
- 📌 **ESLint + Prettier** automatiques
- 📌 **Jest tests** obligatoires pour broker sync + métriques
- 📌 **Zod validation** sur toutes entrées API

### Dépendances
- 📦 **Préférer les composants existants** plutôt que d'ajouter de nouvelles librairies UI
- 📦 Minimiser les dépendances (Zustand 2KB vs Redux)
- 📦 Réutiliser Tailwind + Héroicons pour UI
- 📦 Demander avant d'ajouter nouvelle dépendance

---

## Frontend: Tests et Acceptance Criteria

À la fin de **chaque développement impliquant l'interface graphique:**

1. **Responsivité**
   - ✅ Testé sur mobile (320px), tablet (768px), desktop (1920px)
   - ✅ Pas de scrollbar horizontal
   - ✅ Touch-friendly (min 44x44px buttons)

2. **Fonctionnalité**
   - ✅ Playwright tests pour user journeys critiques
   - ✅ Zéro console errors/warnings
   - ✅ Performance: Largest Contentful Paint < 2.5s

3. **Répondre au besoin**
   - ✅ Acceptance criteria du sprint satisfaits
   - ✅ Pas de régression vs features existantes
   - ✅ Design system respecté (couleurs, spacing, typography)

**Commande test:**
```bash
cd frontend && npm run test
# ou
playwright-skill: test la UI critique
```

---

## Documentation

### Références Obligatoires
- 📄 **@PRD.md** — PRD technique complet (600+ lignes)
- 📄 **@ARCHITECTURE.md** — Stack tech, DB schema, API patterns
- 📄 **@PROJECT_PLAN.md** — Sprint breakdown (0-7), WHAT vs HOW
- 📄 **aetheris-icons-preview.html** — Système icônes (41 Héroicons, 4 catégories)

### Pour chaque feature:
- Ajouter docstring API (@params, @returns, @throws)
- Commenter logique complexe (formules métriques, retry logic)
- README.md par module (backend/, frontend/)

---

## Context7 - Documentation Automatique

**Directive critique:** Utilise TOUJOURS Context7 lorsque tu as besoin de:
- 🔍 Génération de code (implementation patterns)
- 🔍 Étapes de configuration/installation
- 🔍 Documentation bibliothèque/API

**Processus automatique:**
1. User demande: "Ajoute validation Zod au endpoint"
2. Copilot exécute: `context7-resolve-library-id(query="zod validation", libraryName="zod")`
3. Copilot exécute: `context7-query-docs(libraryId="/zod", query="runtime type validation examples")`
4. Copilot génère code avec exemples officiels

**Ne pas demander explicitement.** Je le fais auto.

---

## Spécifications OpenSpec

**Langue:** Toutes les spécifications doivent être rédigées en **FRANÇAIS**, y compris:
- Purpose (Objectif)
- Scenarios (Cas d'usage)
- Acceptance criteria (Critères d'acceptation)

**Format:** Seuls les titres Requirements restent en anglais avec mots-clés OpenSpec:
- `SHALL` (obligation stricte)
- `MUST` (obligation fonctionnelle)
- `SHOULD` (recommandé)
- `MAY` (optionnel)

**Exemple:**
```
# Métrique Expectancy — Spécification

**Purpose (Objectif):**
Calculer l'espérance mathématique par trade pour identifier la profitabilité moyenne attendue.

**Scenarios (Cas d'usage):**
1. Utilisateur voir l'Expectancy sur dashboard KPI
2. Système agrège les derniers 100 trades
3. Système compare vs benchmark sectoriel

## Requirements

- The system SHALL calculate Expectancy = (Win% × Avg Win) − (Loss% × Avg Loss)
- The system MUST cache result in daily_snapshots table
- The system SHOULD display benchmark comparison (top 10% traders)
```

---

## Workflow Copilot

Quand tu développes une feature:

1. **Planification** (`[[PLAN]]`)
   - Demande clarifications si besoin
   - Propose plan avec WHAT vs HOW
   - User approuve via `exit_plan_mode`

2. **Implémentation**
   - Utilise Context7 auto pour libs
   - Tests + linting intégrés
   - Commits avec trailer Copilot

3. **Validation**
   - Frontend: Playwright tests
   - Backend: Jest + Supertest
   - Documentation mise à jour

4. **Git**
   - "Pousse ce changement sur GitHub"
   - Copilot gère commit + push
   - GitHub Actions CI/CD valide
