# Plan d'Implémentation — AETHERIS Trading Copilot OS

**Version:** 2.0 (Complet basé sur PRD + Blueprint + Icon System)  
**Statut:** Prêt pour implémentation Phase 1  
**Références:** AETHERIS_PRD_Technique_Exhaustif.md + AETHERIS_ProjectBlueprint_v2026.md + aetheris-icons-preview.html

---

## Vue d'ensemble exécutive

**AETHERIS** est un **Trading Copilot OS** (non un journal) fonctionnant sur 4 niveaux hiérarchiques:

- **Niveau 1 (Accès):** Infrastructure sans friction — 900+ brokers, auto-sync, multi-comptes
- **Niveau 2 (Fondation):** 200+ métriques institutionnelles (Expectancy, Profit Factor, Kelly, MFE/MAE)
- **Niveau 3 (Maturité):** Psychologie active — Aether Armor, Aether Flow, détection stress vocal
- **Niveau 4 (Apogée):** Intelligence institutionnelle — Oracle Consensus, Whale flows, Galaxie 3D

**5 MOAT compétitifs:**
1. Prévention active vs enregistrement passif
2. Intelligence institutionnelle démocratisée (Whale, COT, Shadow Index)
3. Analyse IA du stress vocal (VSS prosodique)
4. Visualisation 3D multidimensionnelle
5. Quantification du coût émotionnel (biais → €)

---

## Personas clés

### Persona A: Trader Retail Actif
- 25–45 ans, 1–5 ans d'expérience, 5–50 trades/semaine (Day to Swing)
- Douleurs: friction manuelle, manque métriques institutionnelles, protection contre tilt, psychologie

### Persona B: Candidat Prop Firm
- 22–40 ans, en évaluation FTMO/MyForexFunds/True Forex Funds, multi-challenge (2–4 simultanés)
- Douleurs: conformité MDL 5%/Trailing DD 10%, pression psychologique, reporting pro

---

## Stack technique recommandé

- **Backend:** Node.js/Express + TypeScript (async + WebSocket natif)
- **Frontend:** React 18+ with Vite (performant real-time)
- **BD:** PostgreSQL 14+ (compliance, audit trails, RLS)
- **Real-time:** WebSocket (Armor < 2s) + Redis (cache breach states)
- **Infrastructure:** Docker + Kubernetes (scalabilité)
- **Audio:** OpenAI Whisper (STT) + TensorFlow Lite (VSS prosodique)
- **Webhooks:** BullMQ queue (résilience peaks)
- **Icons:** Heroicons 41 sprite SVG (4 catégories)

**Palette AETHERIS v1.0 (non-negotiable):**
```
Gold:    #C9A050 | Night: #0A1321 | Navy: #193452 | Steel: #2F6792
Emerald: #0E765E | Crimson: #AF2D2D | White: #FFFFFF | Slate: #B8C1CC
```

---

## Roadmap — 3 Phases × 14–16 sprints

### PHASE 1: MVP — Infrastructure & Conformité (7–8 sprints)

| Sprint | Module | Tâches clés | Livrables |
|--------|--------|-----------|-----------|
| 1–2 | **M1: Broker Sync** | IBrokerConnector abstraction, MT4/FIX/REST, déduplication broker_trade_id, retry exponential backoff | Auto-sync 900+ brokers |
| 2–3 | **M2: Heatmap** | Grille 7×5, gradient bidirectionnel (Émeraude ↔ Crimson), tooltips, navigation, responsive mobile | Calendar component React |
| 3 | **M3: Risk Agg** | Dashboard consolidé N comptes, drawdown pondéré, marge agrégée, cross-account alerts | Risk panel component |
| 4–5 | **M4: P/L Engine** | Calcul net (commissions/slippage), Expectancy, Profit Factor, Kelly, Sharpe, MDD, MFE/MAE | Metrics engine TypeScript |
| 5–6 | **M5: KPI Suite** | 200+ métriques, 5 catégories, grille 10 cards, trend historique, tooltips LaTeX | KPI dashboard |
| 6 | **M6: Position Sizing** | Calculateur lot optimal, inputs risk%/stop/ATR, alerts si > baseline | Sizing component |
| 6–7 | **M7: Reporting** | Export PDF/CSV/Excel, templates Prop Firm, partage secure link (expire 7j), auto-email | Report generator |
| 7–8 | **M8: Dashboard** | Landing page, settings, auth JWT+2FA TOTP, RLS PostgreSQL, lazy loading, WebP assets | MVP dashboard launchable |

**Phase 1 Output:** MVP complet — Sync + Heatmap + KPIs + Risk + Auth (niveau accès)

---

### PHASE 2: Maturité — Psychologie & Discipline Active (4–5 sprints)

| Sprint | Module | Tâches clés | Livrables |
|--------|--------|-----------|-----------|
| 8–9 | **M9: Aether Armor ★★** | Monitoring MDL 5%/Trailing DD 10%, Soft Breach Guardrails, Niveaux 1–3 (banner→modal→fullscreen pulse), WebSocket < 2s, session lock, cool-down | Armor React component + microservice |
| 9–10 | **M10: Aether Flow ★** | Tagging biais (FOMO/REVENGE/OVERCONFIDENCE/LOSS_AVERSION/ANCHORING), coût financier auto, corrélation biais→drawdown, détection patterns dangereux (overtrading, risk drift) | Emotion tracking + analytics dashboard |
| 10–11 | **M11: Vocal Stress ★★** | Journalisation vocale live, OpenAI Whisper STT, VSS 0–100 (Sérénité 0–30/Vigilance 31–60/Tilt 61–100), analyse prosodique (pitch Hz, débit wpm, intensité dB), audio chiffré S3 | Recording component + VSS model |
| 11–12 | **M12: Tilt Detection** | Détection surtrading/revenge/perte > seuil, session_tilt_flag, alertes préventives, cool-down period, corrélation tilt→losses | Tilt engine + notifications |

**Phase 2 Output:** Copilote psychologique actif — Armor + Flow + Vocal (niveau maturité + intervention)

---

### PHASE 3: Apogée — Intelligence Institutionnelle & 3D (3–4 sprints)

| Sprint | Module | Tâches clés | Livrables |
|--------|--------|-----------|-----------|
| 12–13 | **M13: Oracle Consensus ★★** | Whale flows (on-chain blockchain), Shadow Index (ETF rééquilibrages), COT data (CME), pre-trade scoring 0–100, context pre-trade | Oracle microservice |
| 13 | **M14: Vocal Analysis ★★** | Micro-tremor detection IA, pitch variance analysis, speech rate variation, corrélation stress→performance, prédiction VSS élevé → trades risqués | Advanced VSS TensorFlow model |
| 13–14 | **M15: Galaxie 3D ★★** | Visualisation 3D (heure × instrument × durée × P/L), clusters invisibles en 2D, zone optimale trader, interactive rotation/zoom, Three.js/Babylon.js, 1000s points 60fps | 3D canvas component |
| 14 | **M16: Tax Engine** | Calcul auto taxes (FR/DE/UK/US/crypto), FIFO/LIFO/ACB methods, export fiscale, audit-ready | Tax calculator engine |

**Phase 3 Output:** Copilote complet — Apogée déverrouillé (niveau 4 intelligence institutionnelle)

---

## Collections BD — 15 tables

1. **users** — Auth + KYC/AML + preferences
2. **accounts** — Comptes multi-brokers + prop firm config
3. **broker_connections** — API credentials encrypted + sync status
4. **trades** ← **Collection centrale** (900+ champs, PK: trade_id)
5. **sync_logs** — Audit trail import (trades_new, trades_duplicate, trades_error)
6. **daily_snapshots** — Pré-computed heatmap + KPIs per day
7. **emotion_logs** — Biais tags + pnl_attributed + detected_method
8. **vocal_notes** — Audio URL + VSS timeline + transcript + pitch/speech_rate/intensity
9. **armor_breaches** — Soft/hard breach events with timestamps
10. **kpi_snapshots** — Historique snapshot 200+ métriques
11. **prop_firm_templates** — FTMO/MyForexFunds rules
12. **webhook_events** — Outgoing webhook events + signatures
13. **whale_events** — Whale impact détecté + corrélation
14. **oracle_scores** — Pre-trade scoring + institutional context
15. **sessions** — Trading sessions + tilt_flag + duration

**RLS:** Row-Level Security (PostgreSQL) — chaque utilisateur voit ses données uniquement.

---

## Dépendances & Critical Path

```
PHASE 1 CRITICAL PATH:
M1 (Broker Sync)
  ↓
M3 (Risk Agg) + M4 (P/L Engine)
  ↓
M5 (KPI Suite) + M2 (Heatmap)
  ↓
M6, M7, M8 (Position Sizing, Reporting, Dashboard)
  ↓
MVP LAUNCHABLE ✓

PHASE 2 DEPENDENCIES:
M9 (Armor) depends-on M1, M3, M4, M8
M10 (Aether Flow) depends-on M4, M9
M11 (Vocal) depends-on M10

PHASE 3 (Parallel OK):
M13 (Oracle) independent (peut démarrer parallel Phase 2)
M14 (Vocal Analysis) depends-on M11
M15 (Galaxie 3D) depends-on M4, M5
M16 (Tax) independent
```

---

## Points de clarification — Décisions en suspens

| Décision | Options | Recommandation |
|----------|---------|-----------------|
| Backend | Node.js/Express vs Python/FastAPI vs Go | ✅ Node.js/Express + TypeScript |
| Frontend | React+Vite vs Vue3 vs Next.js | ✅ React 18+Vite |
| BD | PostgreSQL vs MongoDB vs alternatives | ✅ PostgreSQL 14+ (RLS, audit) |
| Auth | JWT vs OAuth2 | ✅ JWT + 2FA TOTP |
| Real-time | WebSocket vs Server-Sent Events | ✅ WebSocket (sub 2s latency Armor) |
| Hosting | AWS vs GCP vs Azure | À décider (affecte services cloud) |
| MVP Target | Quand? | À décider (affecte Phase 2 priorité) |
| Équipe | Taille? Sprint rhythm? | À décider (affecte timeline) |

---

## Actions immédiates (AVANT implémentation)

### ✅ COMPLÉTÉ
- [x] Analyser PRD exhaustif (1629 lignes)
- [x] Analyser Project Blueprint (1332 lignes)
- [x] Analyser Icon System (805 lignes)
- [x] Créer `.github/copilot-instructions.md` (anglais)
- [x] Créer `copilot.md` (français)
- [x] Documenter security/secrets management

### ⏳ À FAIRE (Blocker Sprint 0)
- [ ] **Confirmer stack technologique** finalement (Node? React? PostgreSQL?)
- [ ] **Estimer sprints** par équipe size (1 person = 4w/sprint? 2 people = 2w?)
- [ ] **Scaffolder repo** structure: `backend/` `frontend/` `docs/` `tests/` `.github/`
- [ ] **Créer database schema** (15 tables + migrations)
- [ ] **Setup CI/CD** (GitHub Actions)
- [ ] **Setup dev env** (Docker Compose PostgreSQL + Redis)

### Sprint 1 (Kickoff)
- Backend scaffolding (Express + TypeScript setup)
- Frontend scaffolding (React + Vite + Tailwind)
- PostgreSQL schema creation + Prisma migrations
- Auth setup (JWT + 2FA TOTP library)
- IBrokerConnector interface + mock implementations
- First broker test (FTMO API sandbox)
- GitHub Actions CI (linting, tests, build)

---

## Estimations timeline

**Phase 1 MVP:** 7–8 sprints = **3.5–4 mois** (1 week sprints, équipe 2–3 personnes)

**Phase 1 + Phase 2:** 12–13 sprints = **6–7 mois** (complet copilote psycho)

**Full (Phase 1+2+3):** 16–17 sprints = **8–9 mois** (avec équipe senior)

**Risques majeurs:**
- Complexité Vocal Analysis (ML pipeline, Whisper API costs)
- Scaling WebSocket real-time (thousands concurrent users)
- Broker API fragility (FTMO, IC Markets outages)
- Compliance KYC/AML (documentation, audit trails)

**Opportunités:**
- Phase 1 MVP seul est déjà complet + vendable (infrastructure-only)
- Puis itérer Phase 2 features après feedback utilisateurs
- Modèle freemium possible: Phase 1 free, Phase 2+ premium

---

## Fichiers de référence

- **AETHERIS_PRD_Technique_Exhaustif.md** — Source de vérité 1629 lignes
- **AETHERIS_ProjectBlueprint_v2026.md** — Blueprint architecture 1332 lignes
- **aetheris-icons-preview.html** — Système 41 Heroicons 805 lignes
- **.github/copilot-instructions.md** — Instructions Copilot (anglais)
- **copilot.md** — Instructions Copilot (français)
- **SECURITY_SECRETS.md** — Gestion des secrets
- **.env.example** — Template environnement
- **.gitignore** — Exclusions Git

---

## Conventions de code (cross-project)

- **Database:** snake_case (ex: `broker_trade_id`, `vss_score`)
- **API routes:** kebab-case (ex: `/api/v1/broker-sync`, `/api/v1/risk-aggregated`)
- **React components:** PascalCase (ex: `HeatmapCalendar`, `ArmorBreachAlert`)
- **Env variables:** SCREAMING_SNAKE_CASE (ex: `BROKER_API_KEY`, `DATABASE_URL`)
- **Icon IDs:** kebab-case with category (ex: `#sidebar-dashboard`, `#kpi-winrate`, `#armor-shield-ok`)
- **Commit messages:** feat/fix/docs/test/chore with co-author trailer

---

## Notes finales

1. **Ce plan est vivant** — À mettre à jour après chaque sprint avec learnings
2. **Phase-gating critique** — Ne pas implémenter M9+ (Phase 2) tant que Phase 1 MVP n'est pas stable
3. **Feedback utilisateur** — Planifier early testing (semaine 4–5) avec traders beta
4. **Performance first** — WebSocket latency < 2s est non-négociable pour Armor
5. **Security by default** — RLS, encrypted credentials, audit trails, GDPR compliance
6. **Documentation** — Chaque module = tests + readme + architecture decision records

**Plan créé:** Basé sur analyse exhaustive PRD + Blueprint + Icon System  
**Prochaine étape:** Confirmer tech stack + scaffolder + commencer Sprint 1
