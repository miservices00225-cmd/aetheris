# ⬡ PROJECT BLUEPRINT: AETHERIS (v2026)

> **Status:** Production-Ready Architecture
> **Category:** Copilote de Trading de Précision — Trading Copilot OS (FinTech SaaS)
> **Target:** Retail Traders · Prop Firm Candidates
> **Phases:** 3 · **Modules:** 17 · **Sprints estimés:** 14
> **Document:** Source de vérité pour GitHub Copilot, équipe engineering et Technical PMs

---

## SOMMAIRE

1. [Vision Produit & MOAT Concurrentiel](#1-vision-produit--moat-concurrentiel)
2. [Target Personas](#2-target-personas)
3. [Architecture Technique](#3-architecture-technique)
4. [Design System Officiel](#4-design-system-officiel)
5. [Collections de Données — Schéma Complet](#5-collections-de-données--schéma-complet)
6. [Formules Mathématiques Institutionnelles](#6-formules-mathématiques-institutionnelles)
7. [Modules Fonctionnels par Phase](#7-modules-fonctionnels-par-phase)
8. [Roadmap & Sprints](#8-roadmap--sprints)
9. [Conventions de Codage & Documentation](#9-conventions-de-codage--documentation)

---

---

# 1. VISION PRODUIT & MOAT CONCURRENTIEL

## Positionnement Fondamental

**AETHERIS n'est pas un journal de trading.**

Les journaux existants (TraderSync, Edgewonk, Tradervue, TradesViz, TradeZella) opèrent en mode **enregistrement passif post-mortem**. AETHERIS opère en mode **Copilote OS** : il accompagne, prévient, intervient et augmente la prise de décision en temps réel.

```
Niveau 4 — Apogée    → Intelligence institutionnelle démocratisée
                        Oracle / Whale Impact / Shadow Index / Galaxie 3D

Niveau 3 — Maturité  → Intervention psychologique active
                        Armor / Aether Flow / Discipline Score

Niveau 2 — Fondation → Analytics quantitatifs institutionnels
                        200+ métriques / MFE-MAE / R-Multiple / Kelly

Niveau 1 — Accès     → Infrastructure sans friction
                        900+ brokers / Auto-sync / Multi-compte
```

> **Catégorie revendiquée : Trading Copilot OS** — nouvelle catégorie, pas un journal amélioré.

---

## Les 5 MOAT Concurrentiels

### MOAT `#01` — Prévention Active vs Enregistrement Passif
**Aether Armor** intervient AVANT la violation via les Soft Breach Guardrails, webhooks de verrouillage et détection du tilt en temps réel. AETHERIS **protège le capital** plutôt que de l'autopsier.

> vs concurrence : TraderSync · Edgewonk · Tradervue = journaux passifs. Plancana = guardrails basiques sans IA contextuelle.

### MOAT `#02` — Intelligence Institutionnelle Démocratisée
Premier journal retail à intégrer flux Whale, Shadow Index (rééquilibrages ETFs) et données COT dans l'Oracle Consensus Pre-Trade. Information de niveau hedge fund pour chaque trade retail.

> vs concurrence : Aucun concurrent n'intègre données on-chain, COT ou Shadow Flow.

### MOAT `#03` — Psychologie 3.0 — Analyse de Stress Vocale
Journal vocal avec détection IA des micro-tremors et variations de pitch. Le trader ne peut pas mentir à son journal vocal — l'IA détecte l'état émotionnel réel.

> vs concurrence : TradeZella = journal textuel uniquement. Aucun concurrent = analyse prosodique IA.

### MOAT `#04` — Visualisation 3D — Clusters Invisibles en 2D
Galaxie 3D révèle des patterns multidimensionnels (heure × instrument × durée × P/L) structurellement invisibles en 2D.

> vs concurrence : MyTradeVision explore la 3D sans profondeur analytique. Tous les autres = 2D exclusivement.

### MOAT `#05` — ROI Psychologique Quantifié
**Aether Flow** calcule : *« Le FOMO vous a coûté 2 340€ ce mois »*. Choc cognitif quantifié = levier de changement comportemental.

> vs concurrence : Edgewonk = Tiltmeter qualitatif. Aucun outil ne calcule le coût financier précis par biais.

---

---

# 2. TARGET PERSONAS

## Persona A — Trader Retail Actif

| Attribut | Valeur |
|---|---|
| Âge | 25–45 ans |
| Expérience | 1–5 ans de trading actif |
| Capital | 5 000€ – 100 000€ |
| Instruments | Forex, Crypto, CFD sur indices |
| Fréquence | 5–50 trades/semaine (Day Trader à Swing) |

### Douleurs Prioritaires

**Infrastructure** — La saisie manuelle (50+ trades/semaine) est une friction insurmontable. Connexions broker instables. Multi-compte chaotique.

**Analytics** — Les outils existants : Win Rate + P/L total seulement. Pas d'Expectancy, pas de Profit Factor, pas de Kelly Criterion. Le trader ignore si sa stratégie est mathématiquement viable.

**Psychologie** — Sait qu'il trade par FOMO ou Revenge mais ne peut pas l'intercepter dans l'instant. Journal écrit abandonné lors des sessions intenses.

**Protection** — Les journées de ruine (perd en 30 minutes ce qu'il a construit en semaines) = douleur #1 citée sur Reddit/Discord.

### Jobs To Be Done
- Importer tous mes trades automatiquement sans effort
- Voir mes patterns de performance en un coup d'œil (calendrier, heures, instruments)
- Savoir si ma stratégie est mathématiquement viable
- Être protégé avant de détruire mon compte en état de tilt
- Quantifier l'impact financier de mes émotions

---

## Persona B — Candidat Prop Firm (Trader Financé)

| Attribut | Valeur |
|---|---|
| Âge | 22–40 ans |
| Statut | En évaluation FTMO · MyForexFunds · True Forex Funds · Funded Next |
| Capital | 10 000€ – 200 000€ (compte financé) |
| Enjeu | Perte du compte financé = perte prime versée (jusqu'à 1 000€+) |
| Pression | Règles MDL 5% · Trailing DD 10% · Objectif +10% · Délai limité |

### Douleurs Spécifiques Prop Firm

**Conformité Rules-Based** — Violer une règle = perte immédiate du compte. Besoin de monitoring en temps réel, pas de reporting a posteriori.

**Pression Psychologique Amplifiée** — Chaque trade sur compte financé = pression existentielle. Amplifie FOMO, Revenge Trading, Fear Trading.

**Multi-Challenge** — Gestion simultanée de 2 à 4 challenges (différentes Prop Firms, différentes tailles de compte). Vue agrégée critique.

**Reporting Professionnel** — Exports au format prop firm avec toutes les métriques standardisées.

### Templates Prop Firm Requis (MVP)

| Firm | MDL | Trailing DD | Objectif Profit |
|---|---|---|---|
| FTMO Challenge | 5% | 10% | +10% |
| FTMO Verification | 5% | 10% | +5% |
| MyForexFunds | Variable | Variable | Variable |
| True Forex Funds | Variable | Variable | Variable |
| Funded Next | Variable | Variable | Variable |

---

---

# 3. ARCHITECTURE TECHNIQUE

## Stack Frontend

```
Framework    : Next.js 15 (App Router) + TypeScript strict
Styling      : Tailwind CSS + tokens CSS AETHERIS (custom properties)
UI Library   : shadcn/ui — customisé palette AETHERIS
State        : Zustand (global) + React Query (server state)
Charts 2D    : Recharts
Charts 3D    : Three.js r128 + React Three Fiber (Galaxie 3D — target 60 FPS)
Animations   : Framer Motion (transitions) + CSS keyframes (Armor pulse)
Realtime     : WebSocket natif + FCM (Firebase Cloud Messaging — push)
Audio        : Web Audio API + OpenAI Whisper (Speech-to-Text)
```

## Stack Backend

```
Runtime      : Node.js 22 LTS + TypeScript strict
API          : REST v1 + WebSocket (realtime armor / broker sync)
Queue        : BullMQ (Webhook deliveries · background jobs · analytics recalc)
Cache        : Redis 7 (armor breach state · sessions · anti-spam notifications)
Auth         : JWT + TOTP 2FA + RBAC (propriétaire compte uniquement)
```

## Base de Données

```
Primary DB   : PostgreSQL 16 (ACID · relations · JSONB columns)
Cache / RT   : Redis 7 (breach_level en mémoire — aucune requête DB par trade)
File Storage : AWS S3 / GCS (audio vocaux · screenshots · exports PDF)
Search       : Elasticsearch (Phase 3 — full-text transcriptions vocales)
```

## Services Externes

```
Whale Data   : Whale Alert API (on-chain movements > 10M$)
COT Data     : CFTC public data + Quandl / Nasdaq Data Link
Social       : Twitter API v2 + Reddit PRAW + Discord Bot
Options Flow : Unusual Whales / Market Chameleon / Benzinga Pro
STT          : OpenAI Whisper (défaut) · Google STT · Azure STT
Fiscal       : IRS e-file output + TurboTax .txf format
```

## Principes d'Architecture Cross-Cutting

### Sécurité
- Credentials broker chiffrés **AES-256** au repos (`api_credentials_encrypted`)
- Clés API intégrations chiffrées **AES-256** (`api_key_encrypted`)
- **HMAC-SHA256** sur tous les Webhooks sortants (header `X-Aetheris-Signature`)
- Protection **SSRF** sur URL Webhook (blacklist IP privées 10.x · 192.168.x · 127.x)
- **RBAC** : seul le propriétaire peut modifier ses règles de risque
- **Audit trail** sur toutes les modifications critiques (MDL · règles Armor)
- **2FA TOTP** disponible pour tous les comptes

### Performance
- `breach_level` Armor calculé en mémoire **Redis** — zéro requête DB par trade
- Analytics lourds (Strategy Stats · 3D coordinates) précalculés via **jobs quotidiens**
- `React.memo` sur tous les composants du bandeau Armor (hot path)
- Lazy loading des pages L2 non-actives
- Assets au format **WebP** avec lazy loading

### Scalabilité
- Microservice **Armor Monitor** indépendant (scalable horizontalement)
- Queue **BullMQ** pour Webhooks (résilience aux pics de charge)
- Cache Redis partagé pour breach states (**multi-instance safe**)
- Collections analytiques séparées des collections transactionnelles (OLAP vs OLTP)

### Real-time First
- Toute mise à jour P/L → bandeau Armor mis à jour **< 2s**
- WebSocket channel : `user:{userId}:armor-status`
- Message format : `{ pnl, mdrPct, riskScore, level }`
- Reconnexion automatique avec **exponential backoff**

---

---

# 4. DESIGN SYSTEM OFFICIEL

## Palette AETHERIS v1.0

> Référentiel unique. Tous les tokens doivent être utilisés via CSS custom properties ou variables Tailwind. Aucune couleur hors palette sans validation design.

| Token CSS | Hex | Nom | Rôle Sémantique | Usage Interface |
|---|---|---|---|---|
| `--color-gold` | `#C9A050` | Or AETHERIS | Prestige · Élite · Récompense | Scores · Badges USP · Titres de phase |
| `--color-night` | `#0A1321` | Bleu Nuit Profond | Background principal | Fond global · Headers · Canvas principal |
| `--color-navy` | `#193452` | Bleu Marine | Structure secondaire | Cards · Blocs · Tooltips · Tableaux |
| `--color-steel` | `#2F6792` | Bleu Acier | Hiérarchie intermédiaire | Épics · Sections techniques · Boutons |
| `--color-emerald` | `#0E765E` | Vert Émeraude | Gains · Succès · Discipline | Jours profitables · KPIs positifs |
| `--color-crimson` | `#AF2D2D` | Rouge Crimson | Pertes · Alertes · Danger | Pertes · Alertes Armor · Erreurs |
| `--color-white` | `#FFFFFF` | Blanc | Contraste maximal | Texte sur fonds sombres |
| `--color-slate` | `#B8C1CC` | Gris Ardoise | Informations secondaires | Sous-titres · Labels · Métadonnées |

### Couleurs Dérivées

| Token CSS | Hex | Contexte |
|---|---|---|
| `--color-gold-deep` | `#8B6A20` | Alerte Armor Niveau 2 (Or Profond) |
| `--color-night-light` | `#0F1E35` | Blocs contextuels légèrement éclairés |
| `--color-emerald-light` | `#D4F0E8` | Fond success blocks |
| `--color-crimson-light` | `#FAE0E0` | Fond douleur / alerte blocks |

## Hiérarchie Chromatique — Soft Breach Armor

| Niveau | Seuil MDL | Couleur | Hex | Comportement UI |
|---|---|---|---|---|
| Nominal | 0% | Vert Émeraude | `#0E765E` | Bouclier vert · Bandeau compact |
| Niveau 1 | 50% | Or AETHERIS | `#C9A050` | Bandeau ambre · Notification discrète |
| Niveau 2 | 75% | Or Profond | `#8B6A20` | Modal interruptif · Confirmation |
| Niveau 3 | 90% | Rouge Crimson | `#AF2D2D` | Overlay CSS `pulse` plein écran · Webhook |

## Tokens Sémantiques par Composant

```css
/* KPI Cards */
.kpi-positive { color: #0E765E; }  /* Gains · Win Rate élevé · PF > 1.5 */
.kpi-warning  { color: #C9A050; }  /* Valeur limite · attention requise */
.kpi-negative { color: #AF2D2D; }  /* Pertes · PF < 1.0 · MDD > 20% */
.kpi-neutral  { color: #B8C1CC; }  /* Informations secondaires */

/* Aether Score Badges */
.badge-apprentice   { background: #B8C1CC; }
.badge-practitioner { background: #2F6792; }
.badge-master       { background: #0E765E; }
.badge-elite        { background: #C9A050; color: #0A1321; }

/* Profit Factor — affichage conditionnel */
/* PF < 1.0  → #AF2D2D  |  PF 1.0-1.5 → #C9A050  |  PF > 1.5 → #0E765E */
```

## Navigation Sidebar L1

| Icône SVG | ID Module | Module | Phase | USP |
|---|---|---|---|---|
| `#sidebar-dashboard` | M1 | Dashboard | 1 | — |
| `#sidebar-journal` | M2 | Workspace Journal | 1 | — |
| `#sidebar-analytics` | M3 | Analytics & Performance | 1 | — |
| `#sidebar-aether-flow` | M4 | Aether Flow — Psychologie | 2 | ★ |
| `#sidebar-aether-armor` | M5 | Aether Armor — Protection | 2 | ★★ |
| `#sidebar-oracle` | M6 | Oracle Consensus | 3 | ★★ |
| `#sidebar-galaxie-3d` | M7 | Galaxie 3D | 3 | — |
| `#sidebar-tax-engine` | M8 | Tax Engine | 3 | — |
| `#sidebar-settings` | M9 | Paramètres & Intégrations | 1→3 | — |

> Icônes : Heroicons 24px Outline — fichier `aetheris-icons.svg` (sprite SVG, 41 symbols · 4 catégories).
> Usage : `<svg width="24" height="24"><use href="aetheris-icons.svg#sidebar-dashboard"/></svg>`

## Système d'Icônes — Inventaire Complet (41 symbols)

### Catégorie : Sidebar Navigation (9 icônes)
`#sidebar-dashboard` · `#sidebar-journal` · `#sidebar-analytics` · `#sidebar-aether-flow` · `#sidebar-aether-armor` · `#sidebar-oracle` · `#sidebar-galaxie-3d` · `#sidebar-tax-engine` · `#sidebar-settings`

### Catégorie : KPI Cards Dashboard (10 icônes)
`#kpi-winrate` · `#kpi-profit-factor` · `#kpi-expectancy` · `#kpi-drawdown` · `#kpi-sharpe` · `#kpi-trades` · `#kpi-r-multiple` · `#kpi-duration` · `#kpi-pnl` · `#kpi-mfe-mae`

### Catégorie : Actions (10 icônes)
`#action-add-trade` · `#action-import` · `#action-export` · `#action-sync` · `#action-filter` · `#action-search` · `#action-share` · `#action-record` · `#action-delete` · `#action-edit`

### Catégorie : Aether Armor (12 icônes)
`#armor-shield-ok` · `#armor-shield-alert` · `#armor-bell` · `#armor-bell-snooze` · `#armor-fire` · `#armor-lock` · `#armor-webhook` · `#armor-cooling` · `#armor-revenge` · `#armor-whale` · `#armor-check` · `#armor-warning`

## UX Principles

- **HUD Aesthetic** — Interface type cockpit d'avion pour les modules de session active
- **Feedback Visuel** — Animation CSS `pulse` sur le bouclier Armor au Niveau 3 (`#AF2D2D`, opacity 95%)
- **Real-time First** — Tout P/L mis à jour < 2s sur le bandeau Armor via WebSocket
- **Non-bloquant** — Les alertes et Webhooks n'interrompent jamais le flow principal de l'application

---

---

# 5. COLLECTIONS DE DONNÉES — SCHÉMA COMPLET

## Collection : `users`

```
user_id              UUID          PK
email                VARCHAR(255)  UNQ — hashé pour RGPD
display_name         VARCHAR(100)
trading_style        ENUM          SCALPER|DAY_TRADER|SWING|POSITION
timezone             VARCHAR(50)   IANA (ex: Europe/Paris)
currency             VARCHAR(3)    EUR|USD|GBP...
plan                 ENUM          IDX — FREE|PRO|ELITE
plan_expires_at      TIMESTAMPTZ
totp_enabled         BOOLEAN
created_at           TIMESTAMPTZ
```

## Collection : `accounts`

```
account_id                UUID          PK
user_id                   UUID          IDX — FK vers users
name                      VARCHAR(100)  Ex: FTMO Challenge 100K
broker                    VARCHAR(100)  Ex: FTMO · Interactive Brokers
account_type              ENUM          IDX — PERSONAL|PROP_FIRM|DEMO
prop_firm_template        VARCHAR(100)  Template Prop Firm appliqué
initial_capital           DECIMAL(14,4)
current_capital           DECIMAL(14,4) Mis à jour via sync
currency                  VARCHAR(3)
api_credentials_encrypted TEXT          AES-256
last_sync_at              TIMESTAMPTZ
sync_status               ENUM          OK|ERROR|SYNCING|PENDING
is_active                 BOOLEAN       IDX
```

## Collection : `trades` ← Collection centrale

```
trade_id                       UUID          PK
user_id                        UUID          IDX — FK vers users
account_id                     UUID          IDX — FK vers accounts
broker_trade_id                VARCHAR(100)  UNQ — déduplication inter-sync
symbol                         VARCHAR(20)   IDX (EURUSD · BTC/USD · AAPL)
asset_class                    ENUM          IDX — FOREX|FUTURES|CRYPTO|STOCKS|OPTIONS
direction                      ENUM          LONG|SHORT
entry_price                    DECIMAL(18,8)
exit_price                     DECIMAL(18,8)
stop_loss                      DECIMAL(18,8)
take_profit                    DECIMAL(18,8)
quantity                       DECIMAL(18,4) Lots · contrats · actions
pnl_gross                      DECIMAL(12,4) P/L brut avant commissions
pnl_net                        DECIMAL(12,4) P/L net après toutes commissions
commission                     DECIMAL(10,4)
slippage                       DECIMAL(10,4) Exécuté − Demandé
r_multiple                     DECIMAL(8,4)  Calculé automatiquement
mfe                            DECIMAL(12,4) Max Favorable Excursion
mae                            DECIMAL(12,4) Max Adverse Excursion
open_time                      TIMESTAMPTZ   IDX (UTC)
close_time                     TIMESTAMPTZ   IDX (UTC)
duration_seconds               INTEGER
strategy                       VARCHAR(100)  IDX
setup_quality                  INTEGER       1–5 étoiles
bias_tags                      TEXT[]        IDX — ['FOMO','REVENGE'...]
on_plan                        BOOLEAN       Conforme au plan de trading
notes                          TEXT          Journal textuel
vocal_note_id                  UUID          FK vers vocal_notes (null si absent)
pre_trade_mood                 INTEGER       1–10
post_trade_mood                INTEGER       1–10
whale_impact_flag              BOOLEAN       IDX
whale_event_id                 UUID          FK vers whale_events
oracle_score_at_entry          INTEGER       Score Oracle au moment d'entrée (0–100)
armor_active_at_entry          BOOLEAN
armor_breach_level_at_entry    INTEGER       Niveau Armor 0–3
session_tilt_flag              BOOLEAN       IDX — Trade en période de tilt détectée
screenshots                    TEXT[]        URLs captures d'écran
created_at                     TIMESTAMPTZ
updated_at                     TIMESTAMPTZ
```

## Collection : `broker_connections`

```
connection_id         UUID          PK
user_id               UUID          IDX
account_id            UUID          IDX
broker_name           VARCHAR(100)
connection_type       ENUM          API_DIRECT|CSV_IMPORT|MANUAL
api_key_encrypted     TEXT          AES-256
api_secret_encrypted  TEXT          AES-256
last_sync_at          TIMESTAMPTZ
sync_status           ENUM          OK|ERROR|SYNCING|PENDING
trades_imported       INTEGER
error_message         TEXT
```

## Collection : `sync_logs`

```
log_id               UUID          PK
connection_id        UUID          IDX — FK vers broker_connections
sync_start           TIMESTAMPTZ
sync_end             TIMESTAMPTZ
trades_new           INTEGER       Nouveaux trades importés
trades_duplicate     INTEGER       Doublons ignorés (broker_trade_id UNQ)
trades_error         INTEGER       Trades en erreur de parsing
```

## Collection : `armor_configs`

```
armor_config_id      UUID          PK
account_id           UUID          IDX — Config par compte (indépendante)
mdl_type             ENUM          FIXED|PERCENTAGE
mdl_value            DECIMAL(12,4) Valeur MDL (€ ou %)
mdl_base_capital     DECIMAL(12,2) Capital de référence pour calcul %
threshold_l1_pct     DECIMAL(4,2)  Défaut 50
threshold_l2_pct     DECIMAL(4,2)  Défaut 75
threshold_l3_pct     DECIMAL(4,2)  Défaut 90
notify_channels      TEXT[]        ['PUSH','EMAIL','SMS']
revenge_sensitivity  ENUM          SENSITIVE|MODERATE|STRICT
trading_style        ENUM          SCALPER|DAY_TRADER|SWING
prop_firm_template   VARCHAR(100)
lock_during_session  BOOLEAN       Défaut TRUE — bloque modif en session
updated_at           TIMESTAMPTZ
```

## Collection : `armor_events`

```
event_id             UUID          PK
user_id              UUID          IDX
account_id           UUID          IDX
event_type           ENUM          IDX — BREACH_L1|BREACH_L2|BREACH_L3|
                                         REVENGE_DETECTED|WEBHOOK_SENT|
                                         WEBHOOK_FAILED|RULE_VIOLATED
breach_pct           DECIMAL(5,2)  % MDL atteint au moment de l'event
current_pnl          DECIMAL(12,4)
revenge_score        INTEGER       0–100 (null si non Revenge)
webhook_status       INTEGER       Code HTTP (null si pas de webhook)
webhook_delivery_id  UUID          UNQ — Idempotency key anti-doublon
session_date         DATE          IDX
occurred_at          TIMESTAMPTZ   IDX
```

## Collection : `cooling_periods`

```
cooling_id             UUID          PK
user_id                UUID          IDX
trigger_type           ENUM          MANUAL|AUTO_BREACH|AUTO_REVENGE
trigger_event_id       UUID          FK vers armor_events
duration_planned_sec   INTEGER
duration_actual_sec    INTEGER
status                 ENUM          IDX — COMPLETED|ABORTED|ACTIVE
pnl_before             DECIMAL(12,4)
pnl_after              DECIMAL(12,4)
activities_used        TEXT[]        ['BREATHING','PLAN_REVIEW','LOSS_ANALYSIS']
started_at             TIMESTAMPTZ   IDX
ended_at               TIMESTAMPTZ
```

## Collection : `vocal_notes`

```
vocal_note_id      UUID          PK
trade_id           UUID          IDX (null si note de session générale)
user_id            UUID          IDX
audio_url          TEXT          S3/GCS — chiffré au repos
duration_seconds   INTEGER       Max 300s
transcript         TEXT          Transcription complète Whisper API
vss_score          INTEGER       IDX — Vocal Stress Score final (0–100)
vss_timeline       JSONB         [{timestamp_ms, vss_value}] — courbe temps réel
pitch_avg          DECIMAL(8,2)  Hz moyen
speech_rate_wpm    INTEGER       Mots/minute
intensity_avg      DECIMAL(6,2)  dB moyen
ai_interpretation  TEXT          Texte interprétatif généré par LLM
detected_bias_tags TEXT[]        Biais détectés par analyse sémantique + prosodique
recorded_at        TIMESTAMPTZ   IDX
```

## Collection : `emotion_logs`

```
emotion_log_id   UUID          PK
trade_id         UUID          IDX
user_id          UUID          IDX
bias_type        ENUM          IDX — FOMO|REVENGE|OVERCONFIDENCE|
                                     LOSS_AVERSION|ANCHORING
pnl_attributed   DECIMAL(12,4) Coût financier du biais (valeur négative)
detected_method  ENUM          MANUAL_TAG|AI_VOCAL|AI_PATTERN|AUTO_RULE
vss_at_time      INTEGER       VSS au moment de l'événement (0–100)
logged_at        TIMESTAMPTZ   IDX
```

## Collection : `discipline_events`

```
event_id      UUID          PK
user_id       UUID          IDX
event_type    ENUM          IDX — STOP_RESPECTED|STOP_MOVED|ON_PLAN|OFF_PLAN|
                                  SIZE_OK|SIZE_SPIKE|COOLING_DONE|COOLING_ABORTED
trade_id      UUID          IDX — FK vers trade associé
score_impact  INTEGER       Impact sur Aether Score (+/-)
occurred_at   TIMESTAMPTZ   IDX
```

## Collection : `oracle_signals`

```
signal_id          UUID          PK
instrument         VARCHAR(20)   IDX (BTC-USD · EURUSD · SPY)
timeframe          ENUM          1H|4H|1D|1W
oracle_score       INTEGER       Score global agrégé (0–100)
whale_score        INTEGER       Contribution Whale Alerts (0–100)
cot_score          INTEGER       Contribution données COT (0–100)
social_score       INTEGER       Contribution Sentiment Social (0–100)
options_score      INTEGER       Contribution Options Flow (0–100)
ai_interpretation  TEXT          Texte interprétatif LLM
computed_at        TIMESTAMPTZ   IDX
```

## Collection : `whale_events`

```
whale_event_id   UUID          PK
asset            VARCHAR(20)   IDX (BTC · ETH · XRP)
amount_usd       DECIMAL(20,2) IDX — Montant USD équivalent
from_entity      VARCHAR(100)  Entité source (ex: Coinbase Institutional)
to_entity        VARCHAR(100)  Entité destination (ex: Unknown Wallet)
tx_hash          VARCHAR(66)   UNQ — Hash transaction on-chain
whale_alert_id   VARCHAR(100)  UNQ — ID Whale Alert API
occurred_at      TIMESTAMPTZ   IDX
```

## Collection : `shadow_index_events`

```
rebalance_id          UUID          PK
index_name            VARCHAR(100)  IDX (S&P 500 · Russell 2000 · MSCI EM)
instrument_affected   VARCHAR(20)   IDX — Instrument potentiellement impacté
expected_flow_pct     DECIMAL(8,4)  Flux estimé en % du volume daily
direction             ENUM          BUY|SELL
rebalance_date        DATE          IDX — Date prévue du rééquilibrage
is_confirmed          BOOLEAN       Rééquilibrage confirmé (post-facto)
source                VARCHAR(100)  Bloomberg · Reuters · CFTC...
```

## Collection : `daily_snapshots`

```
snapshot_id         UUID          PK
user_id             UUID          IDX
account_id          UUID          IDX
snapshot_date       DATE          IDX
total_pnl_net       DECIMAL(12,4)
total_pnl_gross     DECIMAL(12,4)
win_rate            DECIMAL(5,4)  0.0→1.0
profit_factor       DECIMAL(8,4)
expectancy_r        DECIMAL(8,4)
expectancy_eur      DECIMAL(10,4)
max_drawdown_pct    DECIMAL(6,4)
sharpe_ratio        DECIMAL(8,4)
sortino_ratio       DECIMAL(8,4)
avg_r_multiple      DECIMAL(8,4)
nb_trades           INTEGER
armor_breach_level  INTEGER       IDX — Niveau max Armor atteint (0–3)
armor_alerts_count  INTEGER
discipline_score    INTEGER       0–100
vocal_stress_avg    INTEGER       0–100 (null si module non actif)
```

## Collection : `trade_coordinates` (cache Galaxie 3D)

```
coord_id          UUID          PK
trade_id          UUID          IDX — FK vers trades
user_id           UUID          IDX
x_value           FLOAT         Valeur normalisée axe X (0.0→1.0)
y_value           FLOAT         Valeur normalisée axe Y (0.0→1.0)
z_value           FLOAT         Valeur normalisée axe Z (0.0→1.0)
sphere_size       FLOAT         Taille sphère ∝ |P/L|
color_hex         VARCHAR(7)    Couleur calculée (#0E765E · #AF2D2D · #B8C1CC)
strategy_group    VARCHAR(100)  IDX — Groupe de constellation
computed_at       TIMESTAMPTZ   Invalidé si trade mis à jour
```

## Collection : `tax_lots`

```
tax_lot_id              UUID          PK
trade_id                UUID          IDX
user_id                 UUID          IDX
fiscal_year             INTEGER       IDX
jurisdiction            ENUM          USA|FR|UK|DE|CA
asset_class             ENUM          EQUITY|OPTION|FUTURE|CRYPTO|FOREX
acquisition_date        DATE
disposition_date        DATE
cost_basis              DECIMAL(14,4)
proceeds                DECIMAL(14,4)
gross_gain_loss         DECIMAL(14,4)
term                    ENUM          SHORT|LONG|MIXED_1256
is_wash_sale            BOOLEAN       IDX
wash_sale_adjustment    DECIMAL(12,4)
section_1256_eligible   BOOLEAN
lt_portion_pct          DECIMAL(4,2)  60.00 pour futures (Section 1256)
form_8949_box           ENUM          A|B|C|D|E|F
computed_at             TIMESTAMPTZ
```

---

---

# 6. FORMULES MATHÉMATIQUES INSTITUTIONNELLES

> Chaque fonction de calcul doit être documentée avec TSDoc incluant la formule LaTeX, les types TypeScript stricts et les seuils d'affichage colorés. Les formules sont affichées via tooltip pédagogique dans l'interface.

---

### Expectancy (E) — Espérance Mathématique par Trade

$$E = (Win\% \times Avg\_Win) - (Loss\% \times Avg\_Loss)$$

| Seuil | Interprétation | Couleur | Hex |
|---|---|---|---|
| `E < 0` | Stratégie perdante | Crimson | `#AF2D2D` |
| `E 0–0.5R` | Viable, à améliorer | Or | `#C9A050` |
| `E > 0.5R` | Excellent | Émeraude | `#0E765E` |

**Exemple :** Win 55% · Avg Win 200€ · Avg Loss 150€ → E = (0.55 × 200) − (0.45 × 150) = **+42.5€ / trade**

---

### Profit Factor (PF) — Facteur de Profit Brut

$$PF = \frac{\sum Gross\_Profits}{\sum Gross\_Losses}$$

| Valeur PF | Interprétation | Couleur | Hex |
|---|---|---|---|
| `< 1.0` | Stratégie perdante | Crimson | `#AF2D2D` |
| `1.0 – 1.5` | Viable, marginal | Or | `#C9A050` |
| `> 1.5` | Robuste | Émeraude | `#0E765E` |
| `> 2.0` | Exceptionnel | Émeraude bold | `#0E765E` |

---

### R-Multiple (R) — Performance Normalisée au Risque

$$R = \frac{Exit\_Price - Entry\_Price}{Entry\_Price - Stop\_Loss}$$

> Objectif : R moyen > 1.0. Un trade à 2R = profit 2× le risque initial.

---

### Ratio de Sharpe (S)

$$S = \frac{R_p - R_f}{\sigma_p}$$

> Benchmarks : S > 1.0 = acceptable · S > 2.0 = excellent · S > 3.0 = niveau hedge fund

---

### Ratio de Sortino (So) — Volatilité Négative Uniquement

$$So = \frac{R_p - R_f}{\sigma_d}$$

> `σd` = écart-type des rendements négatifs uniquement. Préférer Sortino pour stratégies momentum asymétriques.

---

### Kelly Criterion (f*) — Taille de Position Optimale

$$f^* = \frac{b \times p - q}{b}$$

> `b` = ratio Win/Loss moyen · `p` = Win Rate · `q` = Loss Rate (1-p)
> En production : utiliser **Half Kelly** (50% de f*) pour réduire la variance.

---

### Maximum Drawdown (MDD)

$$MDD = \frac{Trough - Peak}{Peak} \times 100\%$$

| Zone | Seuil | Couleur | Hex |
|---|---|---|---|
| Saine | `< 10%` | Émeraude | `#0E765E` |
| Vigilance | `10% – 20%` | Or | `#C9A050` |
| Critique | `> 20%` | Crimson | `#AF2D2D` |

---

### MFE / MAE — Qualité d'Exécution

$$MFE = \max(High_{trade} - Entry) \quad MAE = \max(Entry - Low_{trade})$$

**Exit Efficiency :**

$$Exit\_Efficiency = \frac{Exit - Entry}{MFE} \times 100\%$$

> Benchmark : > 70% = excellent · < 40% = early exits systématiques → réviser la stratégie de sortie

---

### Position Sizing Dynamique

```
Inputs  : capital (€), risk_pct (%), stop_loss (pips/€/$), volatility_atr (optionnel)
Outputs : lot_size_recommended, notional_value, pct_capital_at_risk, kelly_fraction
Alert   : si lot_size > baseline_avg × 1.5 → warning (#AF2D2D)
```

---

---

# 7. MODULES FONCTIONNELS PAR PHASE

---

## PHASE 1 · MVP — Standard de Conformité `Q1–Q2 2026`

> **Objectif :** Parité avec TraderSync (900+ brokers) · TradesViz (600 stats) · Tradervue (80+ brokers).

---

### `#01` — AUTO-SYNC UNIVERSEL MULTI-BROKER

🔴 **DOULEUR** — La saisie manuelle est la principale cause d'abandon. 50+ trades/jour = impossible à journaliser manuellement.

✅ **VALEUR** — Connexion API directe à 900+ courtiers (Actions · Options · Futures · Forex · Crypto). Import CSV universel avec mapping intelligent. Sync automatique P/L net (commissions + slippage + fees).

📊 **DATA LOGIC** — Collections : `broker_connections` · `sync_logs` · `trades`

```
Règles métier :
- Déduplication par broker_trade_id (contrainte UNIQUE)
- Stratégie de conflit configurable : IGNORE|OVERWRITE|ASK
- Fallback polling 10s si API broker indisponible (latence acceptable < 5s)
- Mapping colonnes CSV sauvegardé par broker pour futurs imports
```

---

### `#02` — VISUAL TRADING CALENDAR HEATMAP

🔴 **DOULEUR** — Le trader ne visualise pas ses cycles de performance. Ignore ses jours statistiquement perdants ou ses meilleures fenêtres.

✅ **VALEUR** — Vue mensuelle GitHub-style. Vert `#0E765E` (profit · intensité ∝ gain) · Rouge `#AF2D2D` (perte · intensité ∝ perte) · Ardoise `#B8C1CC` 40% (inactif). Cliquable → filtre Journal.

📊 **DATA LOGIC** — Collection : `daily_snapshots`

```
UI Specs :
- Grille 7×5 · gradient adaptatif (max du mois = intensité max)
- Tooltip hover : fond #193452 · P/L #C9A050/#AF2D2D · nb trades · Win Rate
- Meilleur/pire trade du jour · Armor alerts du jour
- Navigation mois ← → · Vue semaine sur mobile
```

---

### `#03` — MULTI-ACCOUNT RISK AGGREGATION

🔴 **DOULEUR** — Vision fragmentée sur N comptes. Un profit sur un compte masque une perte catastrophique sur un autre.

✅ **VALEUR** — Dashboard consolidé : drawdown global pondéré · marge disponible · règles Prop Firm en temps réel. Alertes cross-comptes si corrélation de positions sur le même instrument.

📊 **DATA LOGIC** — Calcul agrégé pondéré par capital sur `accounts` · API : `GET /api/v1/risk/aggregated`

---

### `#04` — MOTEUR P/L INSTITUTIONNEL

🔴 **DOULEUR** — Les journaux basiques affichent un P/L brut sans intégrer les frais réels. Le trader surestime la profitabilité de sa stratégie.

✅ **VALEUR** — Calcul exact du P/L net incluant : commissions broker, slippage (différence prix demandé vs exécuté), fees exchange, taxes implicites. Calcul automatique des métriques institutionnelles : Expectancy, Profit Factor, R-Multiple, Kelly Criterion, Sharpe/Sortino, MDD, MFE/MAE.

📊 **DATA LOGIC** — Collection : `trades` (champs `pnl_gross`, `pnl_net`, `commission`, `slippage`, `r_multiple`, `mfe`, `mae`)

```
Règles métier :
- pnl_net = pnl_gross − commission − slippage − exchange_fees
- r_multiple = (exit_price − entry_price) / (entry_price − stop_loss)
- mfe et mae calculés depuis les données OHLC de l'intervalle du trade
- Tous les calculs en devise de base du compte (currency account)
- Recalcul automatique si stop_loss ou entry_price corrigé manuellement
```

---

### `#05` — TRACKING KPI INSTITUTIONNELS COMPLET

🔴 **DOULEUR** — Les outils standards présentent Win Rate et P/L total. Les KPI institutionnels (Expectancy, Profit Factor, Sharpe, Sortino, MFE/MAE, Kelly) sont absents.

✅ **VALEUR** — Suite complète de 200+ métriques couvrant 5 catégories :

| Catégorie | Indicateurs |
|---|---|
| **Exécution** | MFE · MAE · Exit Efficiency · Slippage moyen |
| **Risque** | R-Multiple moyen · Kelly Criterion · Risk per Trade % |
| **Robustesse** | Profit Factor · Expectancy · Win Rate · Loss Rate |
| **Résilience** | Sharpe Ratio · Sortino Ratio · Max Drawdown |
| **Temporel** | Performance par Heure · Jour de semaine · Session · Actif |

Chaque KPI affiché avec : valeur actuelle · benchmark sectoriel · indicateur coloré (rouge/ambre/vert) · évolution temporelle · tooltip pédagogique avec formule LaTeX.

📊 **DATA LOGIC** — Agrégation sur `trades` · `daily_snapshots` — jobs précalculés quotidiens.

```
Icônes associées (sprite aetheris-icons.svg) :
#kpi-winrate · #kpi-profit-factor · #kpi-expectancy · #kpi-drawdown
#kpi-sharpe · #kpi-trades · #kpi-r-multiple · #kpi-duration
#kpi-pnl · #kpi-mfe-mae
```

---

### `#06` — POSITION SIZING DYNAMIQUE

🔴 **DOULEUR** — Les traders calculent leur taille de lot manuellement sans tenir compte de la volatilité. Résultat : sur-risque fréquent, tailles incohérentes, violations du plan.

✅ **VALEUR** — Calculateur intégré suggérant la taille de lot optimale selon risque %, stop loss en points et volatilité ATR. Alertes si la taille dépasse le seuil historique du trader (baseline 30 jours). Calcul Half Kelly disponible.

📊 **DATA LOGIC** — Calcul stateless (pas de collection dédiée) · résultat loggé dans `trades.quantity` au moment de la création du trade.

```
API : POST /api/v1/calculator/position-size
Inputs  : capital, risk_pct, stop_loss, volatility_atr (opt)
Outputs : lot_size_recommended, notional_value, pct_capital_at_risk, kelly_fraction
Alert   : lot_size > baseline_avg × 1.5 → warning #AF2D2D
```

---

### `#07` — REPORTING MULTI-FORMAT

🔴 **DOULEUR** — Les brokers, coaches et prop firms demandent des rapports variés. Génération manuelle fastidieuse et source d'erreurs.

✅ **VALEUR** — Génération automatique PDF · CSV · Excel avec métriques complètes sur la période. Rapports personnalisables par stratégie/instrument/compte. Partage sécurisé par lien unique (read-only · expire 7 jours). Envoi programmé hebdomadaire/mensuel. Format spécifique Prop Firm (FTMO · MyForexFunds).

📊 **DATA LOGIC** — Agrégation multi-collections · export via job BullMQ · stockage PDF sur S3/GCS.

```
Icônes : #action-export · #action-share
API    : POST /api/v1/reports/generate · GET /api/v1/reports/:id/download
```

---

## PHASE 2 · MATURITÉ — Psychologie & Discipline Active `Q3–Q4 2026`

> **Objectif :** Transformer AETHERIS en coach disciplinaire actif. Passer de l'analyse rétrospective à l'intervention en temps réel.

---

### `#08` — AETHER FLOW — JOURNAL ÉMOTIONNEL IA ★ USP

🔴 **DOULEUR** — Les traders ignorent le coût financier réel de leurs biais émotionnels. Savoir qu'on trade par FOMO ne suffit pas — il faut quantifier pour créer le choc cognitif.

✅ **VALEUR** — Tracking des biais comportementaux par trade (FOMO · Revenge · Overconfidence · Loss Aversion · Anchoring). Calcul automatique du coût financier cumulé de chaque biais : *« Le FOMO vous a coûté 2 340€ ce mois »*. Corrélation biais → drawdown. Détection IA en temps réel des comportements dangereux (Overtrading · Risk Drift).

📊 **DATA LOGIC** — Collection : `emotion_logs`

```
Méthodes de détection :
- MANUAL_TAG    : trader tag le biais manuellement post-trade
- AI_VOCAL      : détection par analyse prosodique + sémantique (vocal_notes)
- AI_PATTERN    : détection algorithmique (accélération position sizing, trades consécutifs)
- AUTO_RULE     : règle configurable (ex: "trade < 2min après une perte = REVENGE")
```

---

### `#09` — SPEECH-TO-TEXT — ANALYSE DE STRESS VOCALE ★★ USP RARE

🔴 **DOULEUR** — Pendant une session intense, taper des notes est impossible. Le trader ne capture pas son état émotionnel réel. Les journaux écrits post-session sont biaisés.

✅ **VALEUR** — Journalisation vocale par microphone. IA d'analyse prosodique détectant les micro-variations de pitch (Hz), débit de parole (mots/min) et intensité vocale (dB). **Vocal Stress Score (VSS) 0–100** en temps réel (maj toutes les 500ms). Transcription automatique (OpenAI Whisper). Détection de biais par analyse sémantique + prosodique combinée.

📊 **DATA LOGIC** — Collection : `vocal_notes`

| Plage VSS | État Émotionnel | Couleur | Hex |
|---|---|---|---|
| 0–30 | Sérénité — Conditions optimales | Émeraude | `#0E765E` |
| 31–60 | Vigilance — Attention requise | Or | `#C9A050` |
| 61–100 | Tilt — Intervention recommandée | Crimson | `#AF2D2D` |

```
Icône : #action-record
API   : POST /api/v1/vocal-notes/upload · GET /api/v1/vocal-notes/:id/analysis
STT   : OpenAI Whisper (défaut) · fallback Google STT · Azure STT
```

---

### `#10` — AETHER ARMOR — SYSTÈME DE PRÉVENTION DE RUINE ★★ USP

🔴 **DOULEUR** — Le tilt émotionnel détruit en 30 minutes ce qui a été construit en semaines. Les journaux enregistrent l'erreur après, pas avant.

✅ **VALEUR** — **Système de Soft Breach Hiérarchisé** sur 3 niveaux progressifs. Monitoring MDL en temps réel via Redis. Détection algorithmique du Revenge Trading. Timer Cooling Period interactif. Webhook cross-plateforme vers la plateforme de trading.

📊 **DATA LOGIC** — Collections : `armor_configs` · `armor_events` · `cooling_periods`

```
Hiérarchie des Alertes :
Niveau 1 (50% MDL) → Bandeau Or #C9A050 · notification discrète
Niveau 2 (75% MDL) → Modal interruptif #8B6A20 · confirmation requise
Niveau 3 (90% MDL) → Overlay plein écran pulse #AF2D2D · Webhook déclenché

Détection Revenge Trading :
- ≥ 2 trades dans les 5 minutes suivant une perte ≥ 1R
- Score revenge calculé : fréquence × magnitude × deviation_sizing
- Sensibilité configurable : SENSITIVE|MODERATE|STRICT (par style de trading)

WebSocket channel : user:{userId}:armor-status
Message format   : { pnl, mdrPct, riskScore, level }
Latence max      : < 2s entre trade exécuté et bandeau mis à jour

Icônes : #armor-shield-ok · #armor-shield-alert · #armor-bell · #armor-fire
         #armor-lock · #armor-webhook · #armor-cooling · #armor-revenge
         #armor-whale · #armor-check · #armor-warning · #armor-bell-snooze
```

---

### `#11` — SOFT BREACH GUARDRAILS — RÈGLES DU PLAN DE TRADING

🔴 **DOULEUR** — Les règles du plan de trading sont définies hors session puis ignorées sous pression émotionnelle. Pas de mécanisme de rappel actif dans l'instant.

✅ **VALEUR** — Constructeur de règles visuelles IF/THEN : *« Pas de trade > 14h »* · *« Stop max 2% du capital »* · *« Maximum 3 trades perdants consécutifs »*. Alertes en temps réel si règle sur le point d'être violée. Score de conformité quotidien en dashboard. Historique des violations pour analyse comportementale.

📊 **DATA LOGIC** — Extension de `armor_configs` · événements loggés dans `armor_events` (type `RULE_VIOLATED`)

```
Structure règle IF/THEN :
{
  condition_type : TIME|TRADES_COUNT|CONSECUTIVE_LOSSES|POSITION_SIZE|PNL_TARGET,
  operator       : GT|LT|EQ|GTE|LTE,
  value          : number,
  action         : WARN|BLOCK|REQUIRE_CONFIRM,
  message        : string  // Message affiché au trader
}
```

---

### `#12` — AETHER SCORE — SYSTÈME DE DISCIPLINE GAMIFIÉ

🔴 **DOULEUR** — La discipline trading est un muscle difficile à développer sans feedback positif. Les journaux ne récompensent que les P/L, pas les bons comportements.

✅ **VALEUR** — Score de discipline composite (0–100) mesurant 5 critères pondérés.

📊 **DATA LOGIC** — Collection : `discipline_events`

| Critère | Description | Poids |
|---|---|---|
| Stops Respectés | % trades clôturés au SL défini (vs sortie manuelle anticipée) | 25% |
| Sizing Conforme | % trades avec taille ±10% du calculateur recommandé | 20% |
| On-Plan Ratio | % trades validés conformes au plan de trading | 25% |
| Heures Respectées | % sessions terminées à l'heure planifiée | 15% |
| Cooling Compliance | % Cooling Periods effectués entièrement | 15% |

| Niveau | Nom | Couleur | Hex | Seuil |
|---|---|---|---|---|
| 1 | Apprentice | Gris Ardoise | `#B8C1CC` | 0–40 |
| 2 | Practitioner | Bleu Acier | `#2F6792` | 41–65 |
| 3 | Master | Émeraude | `#0E765E` | 66–85 |
| 4 | **Aetheris Elite** | **Or AETHERIS** | **`#C9A050`** | 86–100 |

```
Badges CSS : .badge-apprentice · .badge-practitioner · .badge-master · .badge-elite
```

---

## PHASE 3 · APOGÉE — IA & Intelligence Institutionnelle `Q1–Q2 2027`

> **Objectif :** Positionner AETHERIS comme leader technologique mondial — exploiter les angles morts que la concurrence n'a pas.

---

### `#13` — ORACLE CONSENSUS PRE-TRADE ★★ USP

🔴 **DOULEUR** — Le trader retail prend ses décisions avec une fraction de l'information. Il ignore le sentiment institutionnel, les positions COT et les mouvements on-chain au moment d'entrer.

✅ **VALEUR** — Score de probabilité pré-trade (0–100) calculé par IA agrégeant 4 sources d'intelligence institutionnelle. Le score contextualise sans invalider la décision du trader — **éduque et contextualise, n'ordonne pas**.

📊 **DATA LOGIC** — Collection : `oracle_signals`

| Source | Description | Contribution Oracle |
|---|---|---|
| 🐋 Whale Alerts on-chain | Mouvements capitaux > 10M$ | Score 0–100 |
| 📜 Données COT | Positions nettes institutionnelles CFTC | Score 0–100 |
| 💬 Sentiment Social | Twitter/Reddit/Discord ratio bull/bear | Score 0–100 |
| 📊 Options Flow | Put/Call ratio · unusual activity · vol skew | Score 0–100 |

```
Zones Oracle :
Score < 35  → Crimson #AF2D2D — Divergence institutionnelle
Score 35–64 → Ardoise #B8C1CC — Signal neutre
Score > 65  → Émeraude #0E765E — Convergence institutionnelle

Icône : #sidebar-oracle
API   : GET /api/v1/oracle/:instrument/:timeframe
Cache : Redis 5min (recompute si données fraîches disponibles)
```

---

### `#14` — WHALE IMPACT TRACKER ★★ USP

🔴 **DOULEUR** — *« Mon stop a sauté sur une mèche sans raison fondamentale apparente. »* Les traders ignorent que leurs liquidations coïncident souvent avec des transferts massifs on-chain.

✅ **VALEUR** — Intégration temps réel Whale Alert API. Corrélation automatique entre chaque perte/stop et les mouvements institutionnels dans la fenêtre ±30 minutes. Message contextuel : *« Ta position a été liquidée lors d'un transfert de 40 000 BTC vers Binance »*.

📊 **DATA LOGIC** — Collections : `whale_events` · champ `whale_impact_flag` + `whale_event_id` sur `trades`

```
Corrélateur Trade ↔ Whale :
Input   : trade_id
Process : requête whale_events dans [trade.open_time - 30min, trade.close_time + 15min]
Output  : liste événements whale corrélés + probabilité de causalité estimée

Icône : #armor-whale
Seuil : mouvements > 10M$ USD équivalent
```

---

### `#15` — SHADOW INDEX PROFILE ★★★ USP ULTRA RARE

🔴 **DOULEUR** — Les traders ignorent l'impact des rééquilibrages ETFs/indices sur la liquidité. Ces flux passifs créent des mouvements artificiels qui détruisent les positions techniques.

✅ **VALEUR** — Analyse des flux passifs liés aux ETFs et rééquilibrages d'indices (S&P 500, Russell 2000, MSCI). Identification des dates de rééquilibrage à venir et impact probable sur la liquidité. Alertes sur positions ouvertes exposées à un flux passif imminent. **Démocratise un avantage réservé exclusivement aux institutionnels.**

📊 **DATA LOGIC** — Collection : `shadow_index_events`

```
Sources : Bloomberg · Reuters · CFTC · calculs propriétaires AETHERIS
API     : GET /api/v1/shadow-index/upcoming · GET /api/v1/shadow-index/:instrument
Alert   : si position ouverte sur instrument avec rebalance_date dans les 48h suivantes
```

---

### `#16` — GALAXIE 3D — CARTOGRAPHIE DES CONSTELLATIONS

🔴 **DOULEUR** — Les analyses 2D occultent des patterns multidimensionnels. La relation heure × instrument × durée × P/L est structurellement invisible. Les traders avancés ne peuvent pas identifier leur « zone optimale ».

✅ **VALEUR** — Cartographie 3D interactive (Three.js WebGL) de tous les trades selon 3 axes configurables. Identification visuelle des **clusters de succès**. Navigation WebGL avec rotation, zoom, pan, filtres dynamiques. Sélection par lasso pour analyser un cluster.

📊 **DATA LOGIC** — Collection : `trade_coordinates` (cache calculé · jobs quotidiens)

```
Représentation des Trades (Sphères) :
- Couleur  : Vert #0E765E (Win) · Rouge #AF2D2D (Loss) · Gris #B8C1CC (Breakeven)
- Taille   : proportionnelle au |P/L|
- Opacité  : proportionnelle au |R-Multiple|
- Lignes   : constellations → trades même stratégie reliés par lignes de lumière

Axes 3D Configurables :
Axe X (Horizontal) → Heure · Jour · Session · Instrument    [Bleu Acier #2F6792]
Axe Y (Vertical)   → P/L Net · R-Multiple · Oracle Score    [Émeraude→Crimson]
Axe Z (Profondeur) → Durée · Taille position · MFE · MAE    [Ardoise #B8C1CC]

Présets rapides :
- Performance Pure : Heure × P/L × Durée
- Risque           : MAE × R-Multiple × Taille de position
- Psycho           : VSS × P/L × Biais Score

Icône  : #sidebar-galaxie-3d
Tech   : Three.js r128 + React Three Fiber · target 60 FPS
Perf   : coordonnées précalculées — aucun calcul 3D à la volée côté client
```

---

### `#17` — MOTEUR FISCAL ACTIVE TRADER

🔴 **DOULEUR** — La complexité des taxes (Wash Sale Rule, Section 1256, 60/40 split Futures) représente des dizaines d'heures de travail annuel et des erreurs coûteuses.

✅ **VALEUR** — Génération automatique Form 8949 · Schedule D · 1099-B reconciliation. Gestion Wash Sales (règle 30 jours avant/après). Application Section 1256 pour Futures (60% long-term / 40% short-term). Export TurboTax (.txf) · TaxAct. Extensible vers d'autres juridictions (France BNC · UK HMRC · Allemagne · Canada).

📊 **DATA LOGIC** — Collection : `tax_lots`

```
Icône  : #sidebar-tax-engine
API    : GET /api/v1/tax/:year/summary · POST /api/v1/tax/:year/export
Output : .txf (TurboTax) · .pdf (Form 8949) · .csv (raw lots)
```

---

---

# 8. ROADMAP & SPRINTS

## Vue d'Ensemble des 3 Phases

```
PHASE 1 — MVP Standard de Conformité         Q1–Q2 2026
═══════════════════════════════════════════════════════
Durée estimée    : 4–5 mois
Modules          : #01 Auto-Sync · #02 Calendar Heatmap · #03 Multi-Account
                   #04 P/L Engine · #05 KPI Institutionnels · #06 Position Sizing
                   #07 Reporting
Objectif         : Parité avec TraderSync/TradesViz — adoption initiale
Critère de succès: 100% des standards TraderSync 2026 couverts

PHASE 2 — Maturité : Psychologie & Discipline    Q3–Q4 2026
═══════════════════════════════════════════════════════════
Durée estimée    : 4–5 mois
Modules          : #08 Aether Flow · #09 Speech-to-Text VSS · #10 Aether Armor
                   #11 Soft Breach Guardrails · #12 Aether Score
Objectif         : Différenciation majeure — activation du MOAT psychologique
Critère de succès: NPS > 50 · Churn < 5% mensuel

PHASE 3 — Apogée : IA & Intelligence Institutionnelle    Q1–Q2 2027
═══════════════════════════════════════════════════════════
Durée estimée    : 5–6 mois
Modules          : #13 Oracle Consensus · #14 Whale Impact · #15 Shadow Index
                   #16 Galaxie 3D · #17 Tax Engine
Objectif         : Leadership technologique — fossé concurrentiel infranchissable
Critère de succès: Feature coverage 0 équivalents concurrents sur 3 USP Phase 3
```

## Répartition des 17 Modules par Sprint

| # | Module | Phase | Domaine | USP | Sprint |
|---|---|---|---|---|---|
| 01 | Auto-Sync Universel | 1 | Infrastructure | — | S1–S2 |
| 02 | Calendar Heatmap | 1 | Infrastructure | — | S2 |
| 03 | Multi-Account Aggregation | 1 | Infrastructure | — | S3 |
| 04 | P/L Engine Institutionnel | 1 | Métriques | — | S1–S2 |
| 05 | KPI Tracking Complet | 1 | Métriques | — | S3–S4 |
| 06 | Position Sizing Dynamique | 1 | Risk Mgmt | — | S4 |
| 07 | Reporting Multi-Format | 1 | Reporting | — | S5 |
| 08 | Aether Flow | 2 | Psychologie | ★ | S6–S7 |
| 09 | Speech-to-Text VSS | 2 | Psychologie | ★★ | S7–S8 |
| 10 | Aether Armor | 2 | Protection | ★★ | S6–S8 |
| 11 | Soft Breach Guardrails | 2 | Protection | — | S8 |
| 12 | Aether Score | 2 | Gamification | — | S9 |
| 13 | Oracle Consensus | 3 | IA | ★★ | S10–S12 |
| 14 | Whale Impact Tracker | 3 | IA | ★★ | S10–S11 |
| 15 | Shadow Index | 3 | IA | ★★★ | S11–S12 |
| 16 | Galaxie 3D | 3 | Visualisation | — | S12–S14 |
| 17 | Tax Engine | 3 | Fiscal | — | S13–S14 |

## Détail des Sprints Phase 1 (Aether Armor — référence)

| Sprint | Story Points | Contenu |
|---|---|---|
| S1 (2 semaines) | 18 SP | Infrastructure monitoring + Alertes + Dashboard |
| S2 (2 semaines) | 26 SP | Webhook + Revenge Detection + Cooling Period |

## Risques & Mitigations

| Risque | Probabilité / Impact | Mitigation |
|---|---|---|
| Latence API courtier > 5s pour MAJ P/L | Moyenne / Élevé | Fallback polling 10s + indicateur fraîcheur données |
| Faux positifs Revenge Trading (scalpers) | Haute / Moyen | Mode adaptatif par style + bouton « Ignorer » logué |
| Webhook refusé par plateforme (CORS, firewall) | Moyenne / Élevé | Documentation intégration par plateforme + test obligatoire |
| Résistance Cooling Period (perçu contraignant) | Haute / Faible | Mode 100% optionnel + démonstration ROI analytics |
| Latence Three.js 3D < 60 FPS sur machines modestes | Moyenne / Moyen | Précalcul complet coordonnées · LOD dynamique · WebWorker |

---

---

# 9. CONVENTIONS DE CODAGE & DOCUMENTATION

## Règles Générales

### TypeScript
- Mode **strict** obligatoire sur tout le codebase (`"strict": true` dans `tsconfig.json`)
- Pas de `any` explicite — utiliser `unknown` + type guard si nécessaire
- Interfaces préférées aux types pour les objets complexes
- Enums TypeScript natifs pour les valeurs définies dans les collections (miroir des ENUM PostgreSQL)

### Nommage
- **Fichiers composants React** : `PascalCase.tsx` (ex: `ArmorBandeau.tsx`)
- **Fichiers utilitaires / hooks** : `camelCase.ts` (ex: `useArmorStatus.ts`)
- **Fichiers API routes** : `route.ts` dans le dossier correspondant (App Router Next.js 15)
- **Variables / fonctions** : `camelCase`
- **Constantes** : `SCREAMING_SNAKE_CASE`
- **Tokens CSS** : `--color-{nom}` (miroir palette officielle)

### Fonctions de Calcul Financier — TSDoc Obligatoire
Toute fonction implémentant une formule mathématique (Expectancy, Profit Factor, Sharpe, etc.) **doit** être documentée avec TSDoc incluant :

```typescript
/**
 * Calcule l'espérance mathématique (Expectancy) par trade.
 *
 * @formula E = (Win% × Avg_Win) − (Loss% × Avg_Loss)
 * @latex E = (Win\% \times Avg\_Win) - (Loss\% \times Avg\_Loss)
 *
 * @param winRate  - Taux de trades gagnants (0.0 → 1.0)
 * @param avgWin   - Gain moyen en devise du compte
 * @param avgLoss  - Perte moyenne en devise du compte (valeur positive)
 * @returns Espérance en devise du compte · positif = stratégie viable
 *
 * @thresholds
 * - E < 0   → #AF2D2D (stratégie perdante)
 * - E 0-0.5R → #C9A050 (viable, à améliorer)
 * - E > 0.5R → #0E765E (excellent)
 */
export function calculateExpectancy(
  winRate: number,
  avgWin: number,
  avgLoss: number
): number { ... }
```

### Composants React
- `React.memo()` obligatoire sur tous les composants du bandeau Armor (hot path WebSocket)
- Lazy loading `next/dynamic` sur toutes les pages L2 non-actives
- Assets : format **WebP** uniquement · `loading="lazy"` systématique
- Pas de logique métier dans les composants UI — extraire dans des hooks custom

### API REST
```
GET    /api/v1/{resource}           — liste paginée
GET    /api/v1/{resource}/:id       — détail
POST   /api/v1/{resource}           — création
PATCH  /api/v1/{resource}/:id       — mise à jour partielle
DELETE /api/v1/{resource}/:id       — suppression logique (soft delete)

Pagination  : ?page=1&limit=50
Filtres     : ?account_id=UUID&from=ISO8601&to=ISO8601
Tri         : ?sort=open_time&order=desc
```

### Gestion des Erreurs API
```typescript
// Format standard d'erreur AETHERIS
interface ApiError {
  code    : string   // Ex: "ARMOR_CONFIG_NOT_FOUND"
  message : string   // Message lisible pour le développeur
  details : unknown  // Contexte optionnel
}
```

### Tests
- Tests unitaires : **Vitest** — couverture minimale 80% sur les fonctions de calcul financier
- Tests E2E : **Playwright** — scenarios critiques Armor (breach L1/L2/L3) et Auto-Sync
- Tests d'intégration API : **Supertest** sur les endpoints principaux

---

## ⛔ RÈGLE ABSOLUE — INTERDICTION DE GÉNÉRATION DE FICHIERS MARKDOWN

> **Cette règle s'applique à GitHub Copilot et à tout outil de génération IA utilisé dans ce projet.**

**INTERDICTION STRICTE ET NON-NÉGOCIABLE :**

GitHub Copilot (et tout assistant IA de codage) **ne doit JAMAIS créer automatiquement de fichier `.md` (Markdown)** à l'issue de la génération d'un fichier de code, d'un composant, d'une fonction, d'un module ou de toute autre tâche d'implémentation.

Cela inclut mais ne se limite pas à :
- Les fichiers `README.md` auto-générés après création d'un composant ou d'une feature
- Les fichiers `SUMMARY.md`, `NOTES.md`, `CHANGES.md` ou tout document récapitulatif
- Les fichiers `{NomDuFichier}.md` accompagnant un fichier de code
- Tout rapport ou documentation générée automatiquement en `.md` sans demande explicite

**Comportement attendu :**
Après avoir généré du code, Copilot s'arrête. Aucun fichier `.md` supplémentaire n'est créé. Si de la documentation est nécessaire, elle est demandée explicitement par le développeur.

**Exception unique :** Un fichier `.md` peut être créé UNIQUEMENT si le développeur le demande explicitement avec une instruction claire du type *« crée un README pour ce module »* ou *« génère la documentation de cette fonction »*.

---

## Environnements & Variables d'Environnement

```bash
# .env.local (jamais commité — dans .gitignore)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
ENCRYPTION_KEY=...         # AES-256 pour credentials broker
WHISPER_API_KEY=...        # OpenAI STT
WHALE_ALERT_API_KEY=...    # Whale Impact (Phase 3)
S3_BUCKET=...
S3_REGION=...
NEXT_PUBLIC_WS_URL=...     # WebSocket endpoint (exposé côté client)
```

## Git & Versioning

```
Convention de branches :
main          — production
develop       — intégration continue
feature/#{module}-{description}   — ex: feature/#10-armor-breach-detection
fix/#{issue}-{description}
hotfix/#{issue}-{description}

Convention de commits (Conventional Commits) :
feat(armor): add breach level 3 webhook delivery
fix(sync): handle duplicate broker_trade_id on re-sync
perf(galaxie-3d): precompute coordinates via daily BullMQ job
chore(deps): upgrade Three.js to r128
```

---

*AETHERIS ProjectBlueprint v2026 — Document complété et certifié production-ready.*
*Généré depuis : PRD Technique Exhaustif v1.0 · Icon System Preview v1.0 · Février 2026*
*Source de vérité pour GitHub Copilot, équipe engineering et Technical PMs.*
