# ⬡ AETHERIS — PRODUCT REQUIREMENTS DOCUMENT (PRD) TECHNIQUE EXHAUSTIF
### Copilote de Trading de Précision — Version Définitive 2026
> *Document de référence pour développeurs et IA de codage (Copilot) — Basé exclusivement sur les sources : Backlog Produit & Design System v1.0 · Sitemap & Architecture d'Information · Analyse Fonctionnelle · User Stories Aether Armor*

---

## MÉTADONNÉES DU DOCUMENT

| Champ | Valeur |
|---|---|
| **Projet** | AETHERIS |
| **Type** | Product Requirements Document (PRD) — Technique Exhaustif |
| **Version** | 1.0 Définitive |
| **Référentiel Design** | Palette Officielle AETHERIS v1.0 |
| **Statut** | Prêt pour implémentation |
| **Phases** | 3 Phases · 15 Modules · 9 Domaines |
| **Audience cible** | Équipe Engineering · IA de codage · Technical PMs |

---

## SOMMAIRE

1. [Vision Produit & Core Value Proposition](#1-vision-produit--core-value-proposition)
2. [Target Personas](#2-target-personas)
3. [Exigences Fonctionnelles par Phase](#3-exigences-fonctionnelles-par-phase)
   - [Phase 1 — MVP (Infrastructure & Conformité)](#phase-1--mvp--standard-de-conformité)
   - [Phase 2 — Maturité (Psychologie & Discipline Active)](#phase-2--maturité--psychologie--discipline-active)
   - [Phase 3 — Apogée (IA, Flux Institutionnels & 3D)](#phase-3--apogée--ia-flux-institutionnels--3d)
4. [Annexe Technique — Mathématiques & Data](#4-annexe-technique--mathématiques--data)
5. [UI/UX Design System](#5-uiux-design-system)
6. [Logique d'Implémentation Détaillée — Standard Aether Armor](#6-logique-dimplémentation-détaillée--standard-aether-armor)
7. [Roadmap & Stratégie d'Implémentation](#7-roadmap--stratégie-dimplémentation)

---

---

# 1. VISION PRODUIT & CORE VALUE PROPOSITION

## 1.1 Positionnement Fondamental — Le « Copilote OS »

**AETHERIS n'est pas un journal de trading.**

La distinction est fondamentale et doit guider chaque décision d'architecture et de UX. Les journaux de trading existants (TraderSync, Edgewonk, Tradervue, TradesViz, TradeZella) opèrent en mode **enregistrement passif post-mortem** : ils capturent ce qui s'est passé, l'analysent rétrospectivement, et présentent des statistiques. AETHERIS opère en mode **Copilote OS** : il accompagne, prévient, intervient et augmente la prise de décision en temps réel.

### La Hiérarchie de Valeur AETHERIS

```
Niveau 4 (Apogée)    → Intelligence institutionnelle démocratisée
                        Oracle / Whale / Shadow / Galaxie 3D

Niveau 3 (Maturité)  → Intervention psychologique active
                        Armor / Aether Flow / Discipline Score

Niveau 2 (Fondation) → Analytics quantitatifs institutionnels
                        200+ métriques / MFE-MAE / R-Multiple

Niveau 1 (Accès)     → Infrastructure sans friction
                        900+ brokers / Auto-sync / Multi-compte
```

### Catégorie Produit Revendiquée

> **Trading Copilot OS** — pas Trading Journal.

Cette nouvelle catégorie positionne AETHERIS comme un système d'exploitation du trading, intégrant simultanément un moteur de risque, un moteur de psychologie et un moteur d'intelligence institutionnelle dans une interface unifiée.

## 1.2 Les 5 Avantages Concurrentiels Décisifs (MOAT)

### MOAT `#01` — Prévention Active vs Enregistrement Passif
Tous les concurrents enregistrent les erreurs après qu'elles sont commises. **Aether Armor** intervient AVANT la violation via les Soft Breach Guardrails, les webhooks de verrouillage et la détection du tilt en temps réel. AETHERIS est le seul outil qui **protège le capital** plutôt que de l'autopsier.

**vs concurrence :** TraderSync, Edgewonk, Tradervue = journaux passifs. Plancana dispose de guardrails basiques sans IA contextuelle.

### MOAT `#02` — Intelligence Institutionnelle Démocratisée
AETHERIS est le premier journal retail à intégrer les flux Whale, le Shadow Index (rééquilibrages ETFs/indices) et les données COT dans l'Oracle Consensus Pre-Trade. Les traders retail obtiennent une information de niveau hedge fund pour contextualiser chaque perte.

**vs concurrence :** Aucun concurrent n'intègre de données on-chain, COT ou Shadow Flow dans le journal.

### MOAT `#03` — Psychologie 3.0 — Analyse de Stress Vocale
La journalisation vocale avec détection IA des micro-tremors et variations de pitch est une rupture technologique. Le trader ne peut pas mentir à son journal vocal — l'IA détecte l'état émotionnel réel indépendamment de ce qu'il écrit.

**vs concurrence :** TradeZella a une section journal textuelle. Aucun concurrent n'offre d'analyse prosodique IA.

### MOAT `#04` — Visualisation 3D — Clusters Invisibles en 2D
La cartographie Galaxie 3D révèle des patterns multidimensionnels (heure × instrument × durée × P/L) que les graphiques 2D occultent structurellement. Les traders avancés identifient leur zone optimale — la combinaison exacte de conditions où ils sont statistiquement dominants.

**vs concurrence :** MyTradeVision explore la 3D sans la profondeur analytique. Tous les autres sont en 2D exclusivement.

### MOAT `#05` — Coût Financier Quantifié des Biais — ROI Psychologique
Savoir qu'on a du FOMO est inutile sans mesure. **Aether Flow** calcule automatiquement que *« le FOMO vous a coûté 2 340€ ce mois »*. Ce choc cognitif quantifié crée un levier de changement comportemental qu'aucun journal ne peut offrir sans IA de corrélation biais→P/L.

**vs concurrence :** Edgewonk a un Tiltmeter qualitatif. Aucun outil ne calcule le coût financier précis de chaque biais émotionnel sur une période.

---

---

# 2. TARGET PERSONAS

## Persona A — Le Trader Retail Actif

### Profil Démographique
- **Âge :** 25–45 ans
- **Expérience :** 1 à 5 ans de trading actif
- **Capital :** 5 000€ à 100 000€ personnel
- **Instruments :** Forex, Crypto, CFD sur indices
- **Fréquence :** 5 à 50 trades par semaine (Day Trader à Swing Trader)

### Douleurs Prioritaires

**Infrastructure :** La saisie manuelle des trades est une friction insurmontable pour les traders actifs (50+ trades/semaine). Les connexions broker cassent régulièrement. La gestion multi-compte (personnel + crypto + simulation) est chaotique.

**Analytics :** Les outils existants présentent des métriques de base (Win Rate, P/L total) mais ne calculent pas les indicateurs institutionnels (Expectancy, Profit Factor, Kelly Criterion, MFE/MAE). Le trader ignore si sa stratégie est mathématiquement viable.

**Psychologie :** Le trader sait qu'il trade par FOMO ou Revenge après des pertes, mais il ne peut pas le quantifier ni l'intercepter dans l'instant. La journalisation écrite est abandonnée car fastidieuse lors des sessions intenses.

**Protection :** Les journées de ruine — où le trader perd en 30 minutes ce qu'il a construit en semaines — sont universellement identifiées comme la douleur principale sur Reddit/Discord. Aucun outil ne prévient activement ce scénario.

### Jobs To Be Done
- Importer automatiquement tous mes trades sans effort manuel
- Comprendre d'un coup d'œil mes patterns de performance (calendrier, heures, instruments)
- Savoir si ma stratégie est mathématiquement viable
- Être protégé avant que je détruise mon compte en état de tilt
- Quantifier l'impact financier de mes comportements émotionnels

---

## Persona B — Le Candidat Prop Firm (Trader Financé)

### Profil Démographique
- **Âge :** 22–40 ans
- **Statut :** En évaluation FTMO, MyForexFunds, True Forex Funds, Funded Next, etc.
- **Capital sous gestion :** 10 000€ à 200 000€ (compte financé)
- **Pression :** Règles strictes de drawdown, MDL, objectifs de profit et fenêtre de temps limitée
- **Enjeu :** La perte du compte financé = perte de la prime versée (jusqu'à 1 000€+)

### Douleurs Spécifiques aux Prop Firms

**Conformité Rules-Based :** Les Prop Firms imposent des règles non-négociables : Max Daily Loss (5%), Max Trailing Drawdown (10%), objectif de profit (10%), nombre de jours de trading minimum. Violer une règle = perte immédiate du compte. Le trader a besoin d'un monitoring en temps réel de sa conformité, pas d'un reporting a posteriori.

**Pression Psychologique Amplifiée :** Chaque trade sur un compte financé est sous pression existentielle. La peur de perdre le compte amplifie les biais émotionnels (Revenge après une perte, Fear Trading en fin de challenge). Le Vocal Stress Score et l'Aether Armor sont particulièrement critiques pour ce persona.

**Reporting Professionnel :** Les Prop Firms demandent des rapports de performance standardisés. Le trader a besoin d'exports au format prop firm avec toutes les métriques attendues.

**Multi-Challenge :** Les traders sérieux gèrent simultanément 2 à 4 challenges (différentes Prop Firms, différentes tailles de compte). La vue agrégée du risque cross-comptes est essentielle.

### Jobs To Be Done
- Monitorer en temps réel mon MDL et mes règles de Prop Firm sans calculation manuelle
- Être alerté AVANT de violer une règle — pas après
- Exporter des rapports de conformité professionnels
- Gérer plusieurs challenges simultanément depuis une interface unique
- Comparer ma performance actuelle vs les exigences du challenge

### Templates Prop Firm Requis (MVP)
Les templates suivants doivent être pré-configurés dans la bibliothèque :
- **FTMO Challenge** — MDL 5% / Trailing DD 10% / Objectif +10% / Durée illimitée
- **FTMO Verification** — MDL 5% / Trailing DD 10% / Objectif +5%
- **MyForexFunds** — Règles spécifiques par programme
- **True Forex Funds** — Configuration variable
- **Funded Next** — Configuration variable

---

---

# 3. EXIGENCES FONCTIONNELLES PAR PHASE

---

## PHASE 1 · MVP — Standard de Conformité

> **Objectif :** Répondre à 100% des standards attendus par un trader professionnel en 2026. Atteindre et dépasser la parité avec TraderSync (900+ brokers), TradesViz (600 statistiques), Tradervue (80+ brokers, 200 000 users).

---

### MODULE `#01` — AUTO-SYNC UNIVERSEL MULTI-BROKER

**Domaine :** Infrastructure & Synchronisation | **Phase :** 1 | **Priorité :** CRITIQUE

#### Douleur Résolue
La saisie manuelle de centaines de trades est la principale cause d'abandon des journaux de trading. Les traders actifs effectuant 50+ trades/jour ne peuvent physiquement pas journaliser manuellement. L'import CSV manuel est source d'erreurs systématiques. Sans synchronisation automatique, l'adoption est impossible chez les traders actifs.

#### Valeur Apportée
Connexion API directe à **900+ courtiers** couvrant tous les classes d'actifs : Actions, Options, Futures, Forex, Crypto. Import CSV universel avec mapping de colonnes intelligent par broker. Synchronisation automatique du P/L avec intégration précise des commissions, slippage, fees exchange et taxes implicites.

#### Logique de Données

**Collection : `broker_connections`**
```
connection_id        UUID          PK — Identifiant unique de la connexion
user_id              UUID          IDX — FK vers users
account_id           UUID          IDX — FK vers accounts
broker_name          VARCHAR(100)  Nom du courtier (ex: FTMO, Interactive Brokers)
connection_type      ENUM          API_DIRECT|CSV_IMPORT|MANUAL
api_key_encrypted    TEXT          Credentials chiffrés AES-256
api_secret_encrypted TEXT          Secret chiffré AES-256
last_sync_at         TIMESTAMPTZ   Dernier sync réussi
sync_status          ENUM          OK|ERROR|SYNCING|PENDING
trades_imported      INTEGER       Total trades importés via cette connexion
error_message        TEXT          Dernière erreur (null si OK)
```

**Collection : `sync_logs`**
```
log_id               UUID          PK
connection_id        UUID          IDX — FK vers broker_connections
sync_start           TIMESTAMPTZ   Début du sync
sync_end             TIMESTAMPTZ   Fin du sync
trades_new           INTEGER       Nouveaux trades importés
trades_duplicate     INTEGER       Doublons ignorés (broker_trade_id UNQ)
trades_error         INTEGER       Trades en erreur de parsing
```

#### Règles Métier
- Déduplication par `broker_trade_id` (contrainte UNIQUE) pour éviter les doublons sur re-sync
- Stratégie de conflit configurable : `IGNORE|OVERWRITE|ASK`
- Fallback polling toutes les 10s si l'API broker est indisponible (< 5s de latence acceptable)
- Mapping de colonnes CSV sauvegardé par broker pour les futurs imports

---

### MODULE `#02` — VISUAL TRADING CALENDAR HEATMAP

**Domaine :** Infrastructure | **Phase :** 1 | **Priorité :** CRITIQUE

#### Douleur Résolue
Le trader ne visualise pas ses cycles de performance sur le temps. Il ignore ses jours statistiquement perdants ou ses meilleures fenêtres temporelles. Les patterns cycliques (mauvais lundis, bonnes sessions de mardi matin) sont invisibles dans les tableaux classiques.

#### Valeur Apportée
**Point d'entrée visuel principal de l'interface.** Vue mensuelle style GitHub contribution graph avec gradient de couleur bi-directionnel : vert émeraude `#0E765E` pour les jours profitables (intensité proportionnelle au gain), rouge crimson `#AF2D2D` pour les jours perdants (intensité proportionnelle à la perte), ardoise `#B8C1CC` (opacity 40%) pour les jours inactifs.

#### Spécifications UI
- Grille 7 × 5 cases (7 jours × ~5 semaines du mois)
- Gradient adaptatif : le P/L maximum du mois définit l'intensité maximale (échelle relative)
- **Tooltip au survol :** fond `#193452` (Bleu Marine), P/L en `#C9A050` (positif) ou `#AF2D2D` (négatif), nb trades, Win Rate journalier, meilleur/pire trade, Armor alerts du jour
- Cliquable → filtre automatique de la vue Workspace Journal sur ce jour
- Navigation mois par flèches gauche/droite
- Vue semaine disponible en mode compact (mobile)

#### Logique de Données
Alimenté par la collection `daily_snapshots` (voir Annexe Data complète — Section 4).

---

### MODULE `#03` — MULTI-ACCOUNT RISK AGGREGATION

**Domaine :** Infrastructure | **Phase :** 1 | **Priorité :** HAUTE

#### Douleur Résolue
Les traders opérant sur plusieurs comptes (personnel + 2-3 Prop Firms + comptes crypto) ont une vision fragmentée de leur exposition totale au risque réel. Un profit sur un compte peut masquer une perte catastrophique sur un autre.

#### Valeur Apportée
Dashboard consolidé agrégeant le risque sur N comptes simultanément. Vue unifiée du drawdown global, de la marge disponible et des règles de Prop Firm en temps réel. Alertes cross-comptes en cas de corrélation de positions sur le même instrument.

#### Logique de Données
Calcul d'agrégation pondérée par capital sur la collection `accounts`. Le risque agrégé est distinct du risque par compte — il s'agit d'un calcul séparé exposé via une API dédiée (`GET /api/v1/risk/aggregated`).

---

### MODULE `#04` — MOTEUR DE CALCUL P/L INSTITUTIONNEL

**Domaine :** Métriques Quantitatives | **Phase :** 1 | **Priorité :** CRITIQUE

#### Douleur Résolue
Les journaux basiques affichent un P/L brut sans intégrer les frais réels. Le trader ignore son P/L net réel et surestime la profitabilité de sa stratégie.

#### Valeur Apportée
Calcul exact du P/L net incluant : commissions broker, slippage (différence prix demandé vs exécuté), fees exchange, taxes implicites (pour les marchés dérivés). Calcul automatique des métriques institutionnelles : Expectancy, Profit Factor, R-Multiple, Kelly Criterion, Sharpe/Sortino, MDD, MFE/MAE.

Voir **Section 4 — Annexe Technique** pour les formules complètes en LaTeX.

---

### MODULE `#05` — TRACKING KPI INSTITUTIONNELS COMPLET

**Domaine :** Métriques Quantitatives | **Phase :** 1 | **Priorité :** CRITIQUE

#### Douleur Résolue
Les outils standards présentent Win Rate et P/L total. Les KPI institutionnels (Expectancy, Profit Factor, Sharpe, Sortino, MFE/MAE, Kelly) qui définissent vraiment la qualité d'une stratégie sont absents.

#### Valeur Apportée
Suite complète de 200+ métriques couvrant 5 catégories :

| Catégorie | Indicateurs |
|---|---|
| **Exécution** | MFE, MAE, Exit Efficiency, Slippage |
| **Risque** | R-Multiple, Kelly Criterion, Risk per Trade % |
| **Robustesse** | Profit Factor, Expectancy, Win Rate, Loss Rate |
| **Résilience** | Sharpe Ratio, Sortino Ratio, Max Drawdown |
| **Temporel** | Performance par Heure, Jour de semaine, Session, Actif |

Chaque KPI est affiché avec : valeur actuelle, benchmark sectoriel, indicateur coloré (rouge/ambre/vert), évolution temporelle, tooltip pédagogique avec la formule LaTeX.

---

### MODULE `#06` — POSITION SIZING DYNAMIQUE

**Domaine :** Risk Management | **Phase :** 1 | **Priorité :** HAUTE

#### Douleur Résolue
Les traders calculent leur taille de lot manuellement, souvent en mode réactif sans tenir compte de la volatilité actuelle du marché. Résultat : sur-risque fréquent, tailles incohérentes, violations du plan de trading.

#### Valeur Apportée
Calculateur intégré suggérant la taille de lot optimale selon : risque % défini, stop loss en points, volatilité ATR actuelle de l'instrument. Alertes si la taille dépasse le seuil de confort historique du trader (baseline 30 jours). Calcul Kelly Criterion disponible.

#### Inputs / Outputs
```
Inputs  : capital (€), risk_pct (%), stop_loss (pips/€/$), volatility_atr (optionnel)
Outputs : lot_size_recommended, notional_value, pct_capital_at_risk, kelly_fraction
Alert   : si lot_size > baseline_avg × 1.5 → warning (rouge #AF2D2D)
```

---

### MODULE `#07` — REPORTING MULTI-FORMAT

**Domaine :** Reporting & Export | **Phase :** 1 | **Priorité :** HAUTE

#### Douleur Résolue
Les brokers, coaches et prop firms demandent des rapports dans des formats variés. La génération manuelle est fastidieuse et source d'erreurs.

#### Valeur Apportée
Génération automatique de rapports PDF, CSV, Excel avec métriques complètes sur la période sélectionnée. Rapports personnalisables par stratégie, instrument, compte. Partage sécurisé par lien unique (read-only, expire 7 jours) pour les prop firms. Envoi automatique programmé (hebdomadaire/mensuel). Format spécifique Prop Firm (FTMO, MyForexFunds).

---

---

## PHASE 2 · MATURITÉ — Psychologie & Discipline Active

> **Objectif :** Transformer AETHERIS en coach disciplinaire actif — prévenir les erreurs avant qu'elles coûtent de l'argent. Passer de l'analyse rétrospective à l'intervention en temps réel.

---

### MODULE `#08` — AETHER FLOW — JOURNAL ÉMOTIONNEL IA ★ USP

**Domaine :** Intelligence Émotionnelle | **Phase :** 2 | **Priorité :** CRITIQUE

#### Douleur Résolue
Les traders ignorent le coût financier réel de leurs biais émotionnels. Savoir qu'on trade par FOMO ne suffit pas — il faut quantifier la perte associée pour créer un choc cognitif réel capable de modifier le comportement.

#### Valeur Apportée
Tracking des biais comportementaux par trade (FOMO, Revenge Trading, Overconfidence, Loss Aversion, Anchoring). Calcul automatique du **coût financier cumulé** de chaque biais sur la période. Message clé : *« Le FOMO vous a coûté 2 340€ ce mois »*. Corrélation biais → drawdown pour prouver l'impact systémique. Détection IA en temps réel des comportements dangereux (Overtrading, Risk Drift).

#### Logique de Données

**Collection : `emotion_logs`**
```
emotion_log_id   UUID          PK
trade_id         UUID          IDX — FK vers trades
user_id          UUID          IDX — FK vers users
bias_type        ENUM          FOMO|REVENGE|OVERCONFIDENCE|LOSS_AVERSION|ANCHORING
pnl_attributed   DECIMAL(12,4) P/L attribué à ce biais (négatif = coût financier)
detected_method  ENUM          MANUAL_TAG|AI_VOCAL|AI_PATTERN|AUTO_RULE
vss_at_time      INTEGER       VSS au moment de l'événement (0-100)
logged_at        TIMESTAMPTZ   IDX — Horodatage
```

---

### MODULE `#09` — SPEECH-TO-TEXT PSYCHOLOGY — ANALYSE DE STRESS VOCALE ★ USP RARE

**Domaine :** Intelligence Émotionnelle | **Phase :** 2 | **Priorité :** CRITIQUE

#### Douleur Résolue
Pendant une session intense, taper des notes psychologiques est impossible. Le trader ne capture pas son état émotionnel réel dans l'instant — il le reconstruit a posteriori et biaise son analyse. Les traders mentent inconsciemment dans leurs journaux écrits.

#### Valeur Apportée
Journalisation vocale par microphone pendant la session. IA d'analyse prosodique détectant les micro-variations de pitch (Hz), débit de parole (mots/min) et intensité vocale (dB) — indicateurs scientifiques du stress. **Vocal Stress Score (VSS) 0-100** en temps réel, mis à jour toutes les 500ms. Transcription automatique (OpenAI Whisper). Détection de biais par analyse sémantique et prosodique combinée.

#### Vocal Stress Score (VSS) — Zones et Couleurs

| Plage VSS | État Émotionnel | Couleur | Hex |
|---|---|---|---|
| 0 – 30 | Sérénité — Conditions optimales | Vert Émeraude | `#0E765E` |
| 31 – 60 | Vigilance — Attention requise | Or AETHERIS | `#C9A050` |
| 61 – 100 | Tilt — Intervention recommandée | Rouge Crimson | `#AF2D2D` |

#### Logique de Données

**Collection : `vocal_notes`**
```
vocal_note_id      UUID          PK
trade_id           UUID          IDX — FK vers trades (null si note de session)
user_id            UUID          IDX — FK vers users
audio_url          TEXT          URL stockage objet (S3/GCS) — chiffrée au repos
duration_seconds   INTEGER       Durée de l'enregistrement (max 300s)
transcript         TEXT          Transcription STT complète (Whisper API)
vss_score          INTEGER       IDX — Vocal Stress Score final (0-100)
vss_timeline       JSONB         Array [{timestamp_ms, vss_value}] pour courbe temporelle
pitch_avg          DECIMAL(8,2)  Pitch moyen en Hz
speech_rate_wpm    INTEGER       Débit de parole en mots/minute
intensity_avg      DECIMAL(6,2)  Intensité moyenne en dB
ai_interpretation  TEXT          Texte interprétatif généré par LLM
detected_bias_tags TEXT[]        Biais détectés par analyse vocale IA
recorded_at        TIMESTAMPTZ   IDX — Horodatage de l'enregistrement
```

---

### MODULE `#10` — AETHER ARMOR — SYSTÈME DE PRÉVENTION DE RUINE ★ USP

**Domaine :** Prévention & Protection Active | **Phase :** 2 | **Priorité :** CRITIQUE

> Ce module fait l'objet d'une spécification détaillée complète en Section 6 (Standard User Stories).

#### Douleur Résolue
Les traders commettent leurs pires erreurs après une série de pertes — le tilt émotionnel détruit en 30 minutes ce qui a été construit en semaines. Les journaux traditionnels enregistrent l'erreur après qu'elle est commise, pas avant.

#### Valeur Apportée
**Système de Soft Breach Hiérarchisé** sur 3 niveaux d'alerte progressifs, monitoring MDL en temps réel, détection algorithmique du Revenge Trading, Timer de Cooling Period interactif, Webhook cross-plateforme vers la plateforme de trading.

#### Hiérarchie des Alertes Soft Breach

| Niveau | Seuil MDL | Couleur | Hex | Action UI |
|---|---|---|---|---|
| **Niveau 1** | 50% | Or AETHERIS | `#C9A050` | Bandeau ambre, notification discrète |
| **Niveau 2** | 75% | Or Profond | `#8B6A20` | Modal interruptif, confirmation requise |
| **Niveau 3** | 90% | Rouge Crimson | `#AF2D2D` | Overlay plein écran pulsant, Webhook déclenché |

---

### MODULE `#11` — SOFT BREACH GUARDRAILS — RÈGLES DU PLAN DE TRADING

**Domaine :** Prévention & Protection Active | **Phase :** 2 | **Priorité :** HAUTE

#### Douleur Résolue
Les règles du plan de trading sont définies hors session puis ignorées sous pression émotionnelle. Il n'existe pas de mécanisme de rappel actif dans l'instant de la décision.

#### Valeur Apportée
Constructeur de règles visuelles (IF/THEN) permettant de définir des règles de trading personnalisées : `« Pas de trade > 14h »`, `« Stop max 2% du capital »`, `« Maximum 3 trades perdants consécutifs »`. Alertes en temps réel si une règle est sur le point d'être violée avant exécution. Score de Conformité quotidien visible en dashboard. Historique des violations pour analyse comportementale.

---

### MODULE `#12` — AETHER SCORE — SYSTÈME DE DISCIPLINE GAMIFIÉ

**Domaine :** Gamification & Discipline | **Phase :** 2 | **Priorité :** HAUTE

#### Douleur Résolue
La discipline trading est un muscle difficile à développer sans feedback positif. Les traders abandonnent leur journal car il ne récompense pas les bons comportements, seulement les P/L.

#### Valeur Apportée
Score de discipline composite (0-100) mesurant 5 critères pondérés :

| Critère | Description | Pondération |
|---|---|---|
| Stops Respectés | % trades clôturés au SL défini (vs sortie manuelle anticipée) | 25% |
| Sizing Conforme | % trades avec taille ±10% du calculateur recommandé | 20% |
| On-Plan Ratio | % trades validés comme conformes au plan de trading | 25% |
| Heures Respectées | % sessions terminées à l'heure planifiée | 15% |
| Cooling Compliance | % Cooling Periods effectués entièrement | 15% |

#### Hiérarchie des Niveaux Aether Score

| Niveau | Nom | Couleur Badge | Hex | Seuil |
|---|---|---|---|---|
| 1 | Apprentice | Gris Ardoise | `#B8C1CC` | 0 – 40 |
| 2 | Practitioner | Bleu Acier | `#2F6792` | 41 – 65 |
| 3 | Master | Vert Émeraude | `#0E765E` | 66 – 85 |
| 4 | **Aetheris Elite** | **Or AETHERIS** | **`#C9A050`** | 86 – 100 |

#### Logique de Données

**Collection : `discipline_events`**
```
event_id      UUID   PK
user_id       UUID   IDX — FK vers users
event_type    ENUM   STOP_RESPECTED|STOP_MOVED|ON_PLAN|OFF_PLAN|
                     SIZE_OK|SIZE_SPIKE|COOLING_DONE|COOLING_ABORTED
trade_id      UUID   IDX — FK vers trade associé
score_impact  INTEGER Impact sur l'Aether Score (+/-)
occurred_at   TIMESTAMPTZ IDX — Horodatage
```

---

---

## PHASE 3 · APOGÉE — IA, Flux Institutionnels & 3D

> **Objectif :** Positionner AETHERIS comme leader technologique mondial — exploiter les angles morts que la concurrence n'a pas encore.

---

### MODULE `#13` — ORACLE CONSENSUS PRE-TRADE ★ USP

**Domaine :** Intelligence Institutionnelle | **Phase :** 3 | **Priorité :** HAUTE

#### Douleur Résolue
Le trader retail prend ses décisions avec une fraction de l'information disponible. Il ignore le sentiment institutionnel, les positions COT et les mouvements on-chain au moment d'entrer en position. Ses décisions manquent de contexte global.

#### Valeur Apportée
Score de probabilité pré-trade (0-100) calculé par IA agrégeant 4 sources d'intelligence :

| Source | Description | Contribution Oracle |
|---|---|---|
| 🐋 Whale Alerts on-chain | Mouvements de capitaux > 10M$ | Score 0-100 |
| 📜 Données COT | Commitment of Traders — positions nettes institutionnelles | Score 0-100 |
| 💬 Sentiment Social | Twitter/Reddit/Discord — ratio bullish/bearish agrégé | Score 0-100 |
| 📊 Options Flow | Put/Call ratio, unusual activity, skew de vol implicite | Score 0-100 |

Le score Oracle contextualise sans invalider la décision du trader. Il **éduque et contextualise**, pas ordonne.

**Zones de lecture du score Oracle :**
- Score `< 35` → Crimson `#AF2D2D` — Divergence institutionnelle
- Score `35-64` → Ardoise `#B8C1CC` — Signal neutre
- Score `> 65` → Émeraude `#0E765E` — Convergence institutionnelle

#### Logique de Données

**Collection : `oracle_signals`**
```
signal_id          UUID          PK
instrument         VARCHAR(20)   IDX (ex: BTC-USD, EURUSD)
timeframe          ENUM          1H|4H|1D|1W
oracle_score       INTEGER       Score Oracle final (0-100)
whale_score        INTEGER       Contribution Whale (0-100)
cot_score          INTEGER       Contribution COT (0-100)
social_score       INTEGER       Contribution Sentiment Social (0-100)
options_score      INTEGER       Contribution Options Flow (0-100)
ai_interpretation  TEXT          Texte interprétatif IA
computed_at        TIMESTAMPTZ   IDX — Horodatage du calcul
```

---

### MODULE `#14` — WHALE IMPACT TRACKER ★ USP

**Domaine :** Intelligence Institutionnelle | **Phase :** 3 | **Priorité :** HAUTE

#### Douleur Résolue
*« Mon stop a sauté sur une mèche sans raison fondamentale apparente. »* Les stops qui sautent frustrent les traders. Ils ignorent que leur liquidation coïncide souvent avec un transfert massif on-chain ou un rééquilibrage institutionnel.

#### Valeur Apportée
Intégration temps réel des API Whale Alert et on-chain analytics. Corrélation automatique entre chaque perte/stop et les mouvements institutionnels survenus dans la fenêtre de ±30 minutes. Message contextuel type : *« Ta position a été liquidée lors d'un transfert de 40 000 BTC vers Binance »*. Transforme la frustration en compréhension structurelle du marché.

#### Corrélateur Trade↔Whale
```
Input  : trade_id
Process: Requête whale_events dans la fenêtre [trade.open_time - 30min, trade.close_time + 15min]
Output : Liste des événements whale corrélés avec probabilité de causalité estimée
```

#### Logique de Données

**Collection : `whale_events`**
```
whale_event_id   UUID          PK
asset            VARCHAR(20)   IDX (BTC, ETH, XRP...)
amount_usd       DECIMAL(20,2) IDX — Montant en USD équivalent
from_entity      VARCHAR(100)  Entité source (ex: Coinbase Institutional)
to_entity        VARCHAR(100)  Entité destination (ex: Unknown Wallet)
tx_hash          VARCHAR(66)   UNQ — Hash transaction on-chain
whale_alert_id   VARCHAR(100)  UNQ — ID chez Whale Alert API
occurred_at      TIMESTAMPTZ   IDX — Horodatage on-chain
```

---

### MODULE `#15` — SHADOW INDEX PROFILE ★ USP ULTRA RARE

**Domaine :** Intelligence Institutionnelle | **Phase :** 3 | **Priorité :** HAUTE

#### Douleur Résolue
Les traders ignorent l'impact des rééquilibrages d'ETFs et d'indices sur la liquidité apparente. Ce flux passif crée des mouvements artificiels qui détruisent les positions techniques sans raison fondamentale visible.

#### Valeur Apportée
Analyse des flux passifs liés aux ETFs et rééquilibrages d'indices (S&P 500, Russell 2000, MSCI, etc.). Identification des dates de rééquilibrage à venir et de leur impact probable sur la liquidité. Alertes sur les positions ouvertes exposées à un flux passif imminent. **Démocratise un avantage réservé exclusivement aux institutionnels.**

#### Logique de Données

**Collection : `shadow_index_events`**
```
rebalance_id          UUID          PK
index_name            VARCHAR(100)  IDX (ex: S&P 500, Russell 2000)
instrument_affected   VARCHAR(20)   IDX — Instrument potentiellement impacté
expected_flow_pct     DECIMAL(8,4)  Flux estimé en % du volume daily
direction             ENUM          BUY|SELL
rebalance_date        DATE          IDX — Date prévue du rééquilibrage
is_confirmed          BOOLEAN       Rééquilibrage confirmé (post-facto)
source                VARCHAR(100)  Source (Bloomberg, Reuters, CFTC...)
```

---

### MODULE `#16` — GALAXIE 3D — CARTOGRAPHIE DES CONSTELLATIONS

**Domaine :** Visualisation Avancée | **Phase :** 3 | **Priorité :** HAUTE

#### Douleur Résolue
Les analyses 2D occultent des patterns multidimensionnels. La relation entre heure d'entrée, instrument, durée, taille de position et P/L est structurellement invisible dans les graphiques classiques. Les traders avancés ne peuvent pas identifier leur « zone optimale ».

#### Valeur Apportée
Cartographie 3D interactive (Three.js WebGL) de tous les trades selon 3 axes configurables. Identification visuelle des **clusters de succès** — zones où tous les paramètres convergent positivement. Navigation WebGL avec rotation, zoom, pan, filtres dynamiques. Sélection par lasso pour analyser un cluster spécifique.

#### Représentation des Trades (Sphères)
- **Couleur** : Vert `#0E765E` (Win) / Rouge `#AF2D2D` (Loss) / Gris `#B8C1CC` (Breakeven)
- **Taille** : Proportionnelle au `|P/L|`
- **Opacité** : Proportionnelle au `|R-Multiple|`
- **Constellations** : Trades de la même stratégie reliés par lignes de lumière colorées

#### Axes 3D Configurables

| Axe | Options Disponibles | Couleur Axe |
|---|---|---|
| **Axe X (Horizontal)** | Heure d'entrée / Jour / Session / Instrument | Bleu Acier `#2F6792` |
| **Axe Y (Vertical)** | P/L Net / R-Multiple / Oracle Score / Win Rate | Émeraude→Crimson selon signe |
| **Axe Z (Profondeur)** | Durée / Taille position / MFE / MAE / Setup Quality | Gris Ardoise `#B8C1CC` |

#### Présets d'Axes Rapides
- **Performance Pure** : Heure × P/L × Durée
- **Risque** : MAE × R-Multiple × Taille de position
- **Psycho** : VSS × P/L × Biais Score

#### Logique de Données

**Collection : `trade_coordinates` (cache calculé)**
```
coord_id          UUID     PK
trade_id          UUID     IDX — FK vers trades
user_id           UUID     IDX — FK vers users
x_value           FLOAT    Valeur normalisée axe X (0.0→1.0)
y_value           FLOAT    Valeur normalisée axe Y (0.0→1.0)
z_value           FLOAT    Valeur normalisée axe Z (0.0→1.0)
sphere_size       FLOAT    Taille sphère proportionnelle au |P/L|
color_hex         VARCHAR(7) Couleur hex calculée
strategy_group    VARCHAR(100) IDX — Groupe de constellation
computed_at       TIMESTAMPTZ Horodatage du calcul (invalidé si trade mis à jour)
```

---

### MODULE `#17` — MOTEUR FISCAL ACTIVE TRADER

**Domaine :** Fiscalité & Compliance | **Phase :** 3 | **Priorité :** HAUTE (critique pour traders US)

#### Douleur Résolue
La complexité des taxes (Wash Sale Rule, Section 1256, 60/40 split pour les Futures) représente des dizaines d'heures de travail annuel et des erreurs coûteuses.

#### Valeur Apportée
Génération automatique des formulaires IRS : Form 8949, Schedule D, 1099-B reconciliation. Gestion automatique des Wash Sales (règle 30 jours avant/après). Application du régime Section 1256 pour les Futures (60% long-term / 40% short-term). Export vers TurboTax (.txf), TaxAct. Extensible vers d'autres juridictions (France BNC, UK HMRC, Allemagne, Canada).

#### Logique de Données

**Collection : `tax_lots`**
```
tax_lot_id              UUID          PK
trade_id                UUID          IDX — FK vers trades
user_id                 UUID          IDX — FK vers users
fiscal_year             INTEGER       IDX
jurisdiction            ENUM          USA|FR|UK|DE|CA
asset_class             ENUM          EQUITY|OPTION|FUTURE|CRYPTO|FOREX
acquisition_date        DATE          Date d'acquisition
disposition_date        DATE          Date de cession
cost_basis              DECIMAL(14,4) Coût de base ajusté (après wash sale)
proceeds                DECIMAL(14,4) Produit de cession
gross_gain_loss         DECIMAL(14,4) Gain/perte brut
term                    ENUM          SHORT|LONG|MIXED_1256
is_wash_sale            BOOLEAN       IDX — Violation Wash Sale détectée
wash_sale_adjustment    DECIMAL(12,4) Ajustement Wash Sale (€)
section_1256_eligible   BOOLEAN       Éligible régime Section 1256
lt_portion_pct          DECIMAL(4,2)  Portion Long Term (60 pour futures)
form_8949_box           ENUM          A|B|C|D|E|F
computed_at             TIMESTAMPTZ   Horodatage du calcul
```

---

---

# 4. ANNEXE TECHNIQUE — MATHÉMATIQUES & DATA

## 4.1 Formules de Performance — Format LaTeX

Toutes les formules sont intégrées dans le moteur de calcul AETHERIS. Chaque formule est affichée dans l'interface via un tooltip pédagogique avec rendu LaTeX.

---

### Expectancy (E) — Espérance Mathématique par Trade

$$E = (Win\% \times Avg\_Win) - (Loss\% \times Avg\_Loss)$$

**Description :** Mesure fondamentale de la viabilité d'une stratégie. Une expectancy positive signifie que la stratégie est mathématiquement profitable sur le long terme, indépendamment du taux de réussite seul.

**Seuils d'affichage :**
- `E < 0` → Rouge Crimson `#AF2D2D` (stratégie perdante)
- `E 0-0.5R` → Or AETHERIS `#C9A050` (viable, à améliorer)
- `E > 0.5R` → Vert Émeraude `#0E765E` (excellent)

**Exemple de calcul :** Win Rate = 55%, Avg Win = 200€, Avg Loss = 150€ → E = (0.55 × 200) - (0.45 × 150) = 110 - 67.5 = **+42.5€ par trade**

---

### Profit Factor (PF) — Facteur de Profit Brut

$$PF = \frac{\sum Gross\_Profits}{\sum Gross\_Losses}$$

**Description :** Rapport entre la somme des profits bruts et la somme des pertes brutes. Indépendant du nombre de trades — mesure la qualité pure de la stratégie.

**Seuils d'affichage :**

| Valeur PF | Interprétation | Couleur | Hex |
|---|---|---|---|
| `< 1.0` | Stratégie perdante | Rouge Crimson | `#AF2D2D` |
| `1.0 – 1.5` | Viable, marginal | Or AETHERIS | `#C9A050` |
| `> 1.5` | Robuste | Vert Émeraude | `#0E765E` |
| `> 2.0` | Exceptionnel | Émeraude vif `#0E765E` bold | `#0E765E` |

---

### R-Multiple (R) — Performance Normalisée au Risque

$$R = \frac{Exit\_Price - Entry\_Price}{Entry\_Price - Stop\_Loss}$$

**Description :** Normalise chaque trade en unités de risque initial. Permet de comparer des trades sur des instruments et capitaux différents sur une échelle commune. Base du système Van Tharp.

**Référence :** Un trade à 2R signifie que le profit est 2× le risque initial pris. Objectif : R moyen > 1.0.

---

### Ratio de Sharpe (S) — Rendement Ajusté à la Volatilité

$$S = \frac{R_p - R_f}{\sigma_p}$$

*Où :* $R_p$ = rendement portefeuille, $R_f$ = taux sans risque, $\sigma_p$ = volatilité (écart-type des rendements)

**Benchmarks :** S > 1.0 = acceptable | S > 2.0 = excellent | S > 3.0 = niveau hedge fund

---

### Ratio de Sortino (So) — Ajustement Downside Only

$$So = \frac{R_p - R_f}{\sigma_d}$$

*Où :* $\sigma_d$ = downside deviation uniquement (ne pénalise pas la volatilité positive)

**Note :** Préférer le Sortino au Sharpe pour les stratégies momentum ou breakout asymétriques.

---

### Kelly Criterion (f*) — Taille de Position Optimale

$$f^* = \frac{b \times p - q}{b}$$

*Où :* $b$ = gain_ratio (Avg Win / Avg Loss), $p$ = win rate, $q = 1 - p$

**Application pratique :** Utiliser 50% du Kelly (Half Kelly) en production pour réduire la variance.

**Exemple :** Win 60%, Avg Win/Loss = 1.5 → $f^* = (1.5 \times 0.6 - 0.4) / 1.5 = 33\%$ → Half Kelly = 16.5%

---

### Maximum Drawdown (MDD) — Pire Perte Depuis un Pic

$$MDD = \frac{Trough - Peak}{Peak} \times 100\%$$

**Zones d'affichage de la jauge MDD :**

| Zone | Seuil | Couleur | Hex |
|---|---|---|---|
| Saine | `< 10%` | Vert Émeraude | `#0E765E` |
| Vigilance | `10% – 20%` | Or AETHERIS | `#C9A050` |
| Critique | `> 20%` | Rouge Crimson | `#AF2D2D` |

---

### MFE / MAE — Analyse de Qualité d'Exécution

$$MFE = \max(High_{during\_trade} - Entry)$$

$$MAE = \max(Entry - Low_{during\_trade})$$

**Description :**
- **MFE (Max Favorable Excursion)** : jusqu'où le trade est allé dans le sens favorable
- **MAE (Max Adverse Excursion)** : jusqu'où il est allé contre vous avant de revenir

**Diagnostic :** Si `MFE >> Prix Sortie` → trader sort systématiquement trop tôt (early exit). Si `MAE > Risk défini` → stops trop larges ou trop étroits.

**Indicateur dérivé — Exit Efficiency :**
$$Exit\_Efficiency = \frac{Exit\_Price - Entry}{MFE} \times 100\%$$

Benchmark : `> 70%` = excellent | `< 40%` = early exits systématiques

---

## 4.2 Schéma Complet des Collections de Données

### Collection principale : `trades`

La collection `trades` est le cœur de données d'AETHERIS. Tous les modules y font référence.

```
trade_id                   UUID          PK — Identifiant unique AETHERIS
user_id                    UUID          IDX — FK vers users
account_id                 UUID          IDX — FK vers accounts
broker_trade_id            VARCHAR(100)  UNQ — ID broker (déduplication)
symbol                     VARCHAR(20)   IDX (ex: EURUSD, BTC/USD, AAPL)
asset_class                ENUM          FOREX|FUTURES|CRYPTO|STOCKS|OPTIONS
direction                  ENUM          LONG|SHORT
entry_price                DECIMAL(18,8) Prix d'entrée exécuté
exit_price                 DECIMAL(18,8) Prix de sortie exécuté
stop_loss                  DECIMAL(18,8) Stop loss défini
take_profit                DECIMAL(18,8) Take profit défini
quantity                   DECIMAL(18,4) Taille de position (lots/contrats/actions)
pnl_gross                  DECIMAL(12,4) P/L brut avant commissions
pnl_net                    DECIMAL(12,4) P/L net après toutes commissions
commission                 DECIMAL(10,4) Total des frais et commissions
slippage                   DECIMAL(10,4) Slippage en devise (exécuté - demandé)
r_multiple                 DECIMAL(8,4)  R-Multiple calculé automatiquement
mfe                        DECIMAL(12,4) Max Favorable Excursion en devise
mae                        DECIMAL(12,4) Max Adverse Excursion en devise
open_time                  TIMESTAMPTZ   IDX — Horodatage ouverture (UTC)
close_time                 TIMESTAMPTZ   IDX — Horodatage clôture (UTC)
duration_seconds           INTEGER       Durée de détention en secondes
strategy                   VARCHAR(100)  IDX — Stratégie associée
setup_quality              INTEGER       Note qualité 1-5 étoiles
bias_tags                  TEXT[]        IDX — Array biais : ['FOMO','REVENGE']
on_plan                    BOOLEAN       Trade conforme au plan de trading
notes                      TEXT          Journal textuel associé
vocal_note_id              UUID          FK vers vocal_notes (null si absent)
pre_trade_mood             INTEGER       Humeur pré-trade 1-10
post_trade_mood            INTEGER       Humeur post-trade 1-10
whale_impact_flag          BOOLEAN       IDX — Corrélation Whale détectée
whale_event_id             UUID          FK vers whale_events
oracle_score_at_entry      INTEGER       Score Oracle au moment d'entrée (0-100)
armor_active_at_entry      BOOLEAN       Aether Armor actif lors de l'entrée
armor_breach_level_at_entry INTEGER      Niveau Armor (0-3) au moment de l'entrée
session_tilt_flag          BOOLEAN       IDX — Trade en période de tilt détecté
screenshots                TEXT[]        Array d'URLs captures d'écran
created_at                 TIMESTAMPTZ   Créé le (UTC)
updated_at                 TIMESTAMPTZ   Modifié le (UTC)
```

### Collection : `daily_snapshots`

```
snapshot_id            UUID          PK
user_id                UUID          IDX — FK vers users
account_id             UUID          IDX — FK vers accounts
snapshot_date          DATE          IDX — Date du snapshot (YYYY-MM-DD)
total_pnl_net          DECIMAL(12,4) P/L net de la journée
total_pnl_gross        DECIMAL(12,4) P/L brut de la journée
win_rate               DECIMAL(5,4)  Taux de réussite 0.0→1.0
profit_factor          DECIMAL(8,4)  Profit Factor calculé
expectancy_r           DECIMAL(8,4)  Expectancy en unités R
expectancy_eur         DECIMAL(10,4) Expectancy en devise du compte
max_drawdown_pct       DECIMAL(6,4)  MDD en % sur la journée
sharpe_ratio           DECIMAL(8,4)  Ratio de Sharpe (annualisé)
sortino_ratio          DECIMAL(8,4)  Ratio de Sortino (annualisé)
avg_r_multiple         DECIMAL(8,4)  R-Multiple moyen de la journée
nb_trades              INTEGER       Nombre de trades sur la journée
armor_breach_level     INTEGER       IDX — Niveau max Armor atteint (0-3)
armor_alerts_count     INTEGER       Nombre d'alertes Armor déclenchées
discipline_score       INTEGER       Score Aether Score (0-100)
vocal_stress_avg       INTEGER       VSS moyen (0-100) — null si non actif
```

### Collection : `armor_configs`

```
armor_config_id        UUID          PK
account_id             UUID          IDX — FK vers accounts (config par compte)
mdl_type               ENUM          FIXED|PERCENTAGE
mdl_value              DECIMAL(12,4) Valeur MDL (€ ou %)
mdl_base_capital       DECIMAL(12,2) Capital de référence pour calcul %
threshold_l1_pct       DECIMAL(4,2)  Seuil Niveau 1 en % (défaut 50)
threshold_l2_pct       DECIMAL(4,2)  Seuil Niveau 2 en % (défaut 75)
threshold_l3_pct       DECIMAL(4,2)  Seuil Niveau 3 en % (défaut 90)
notify_channels        TEXT[]        Canaux actifs : ['PUSH','EMAIL','SMS']
revenge_sensitivity    ENUM          SENSITIVE|MODERATE|STRICT
trading_style          ENUM          SCALPER|DAY_TRADER|SWING
prop_firm_template     VARCHAR(100)  Template Prop Firm (null si custom)
lock_during_session    BOOLEAN       Protection modification en session
updated_at             TIMESTAMPTZ   Dernière modification
```

### Collection : `armor_events`

```
event_id               UUID          PK
user_id                UUID          IDX — FK vers users
account_id             UUID          IDX — FK vers accounts
event_type             ENUM          BREACH_L1|BREACH_L2|BREACH_L3|
                                     REVENGE_DETECTED|WEBHOOK_SENT|
                                     WEBHOOK_FAILED|RULE_VIOLATED
breach_pct             DECIMAL(5,2)  % MDL atteint au moment de l'événement
current_pnl            DECIMAL(12,4) P/L au moment de l'événement
revenge_score          INTEGER       Score Revenge au moment de l'événement
webhook_status         INTEGER       Code HTTP retourné (null si pas de webhook)
webhook_delivery_id    UUID          UNQ — ID idempotency de l'appel
session_date           DATE          IDX — Date de la session de trading
occurred_at            TIMESTAMPTZ   IDX — Horodatage précis (UTC)
```

### Collection : `cooling_periods`

```
cooling_id             UUID          PK
user_id                UUID          IDX — FK vers users
trigger_type           ENUM          MANUAL|AUTO_BREACH|AUTO_REVENGE
trigger_event_id       UUID          FK vers armor_events déclencheur
duration_planned_sec   INTEGER       Durée planifiée en secondes
duration_actual_sec    INTEGER       Durée réelle (< planifiée si aborted)
status                 ENUM          IDX — COMPLETED|ABORTED|ACTIVE
pnl_before             DECIMAL(12,4) P/L au début du Cooling
pnl_after              DECIMAL(12,4) P/L à la fin (null si ACTIVE)
activities_used        TEXT[]        Activités utilisées pendant le Cooling
started_at             TIMESTAMPTZ   IDX — Début du Cooling Period
ended_at               TIMESTAMPTZ   Fin du Cooling Period
```

---

---

# 5. UI/UX DESIGN SYSTEM

## 5.1 Palette Officielle AETHERIS v1.0

> Référentiel de couleurs fonctionnelles et sémantiques. Tous les développeurs doivent utiliser exclusivement ces tokens CSS/Tailwind. Aucune couleur hors palette n'est autorisée sans validation design.

| Token CSS | Hex | Nom | Rôle Sémantique | Usage Interface |
|---|---|---|---|---|
| `--color-gold` | `#C9A050` | **Or AETHERIS** | Prestige, élite, récompense | Scores, badges USP, titres de phase, KPIs clés |
| `--color-night` | `#0A1321` | **Bleu Nuit Profond** | Background dark mode | Fond global, headers, canvas principal, tooltips |
| `--color-navy` | `#193452` | **Bleu Marine** | Structure secondaire | Cards de modules, blocs structurels, tooltips, tableaux |
| `--color-steel` | `#2F6792` | **Bleu Acier** | Hiérarchie intermédiaire | Épics, sections techniques, boutons secondaires |
| `--color-emerald` | `#0E765E` | **Vert Émeraude** | Gains, succès, discipline | Jours profitables, gains, KPIs positifs, discipline validée |
| `--color-crimson` | `#AF2D2D` | **Rouge Crimson** | Pertes, alertes, danger | Jours perdants, pertes, alertes critiques Armor, erreurs |
| `--color-white` | `#FFFFFF` | **Blanc** | Contraste maximal | Texte sur fonds sombres, valeurs numériques principales |
| `--color-slate` | `#B8C1CC` | **Gris Ardoise** | Informations secondaires | Sous-titres, labels, métadonnées, jours inactifs calendrier |

### Couleurs Dérivées

| Token CSS | Hex | Contexte |
|---|---|---|
| `--color-gold-deep` | `#8B6A20` | Alerte Niveau 2 Armor (Or Profond) |
| `--color-night-light` | `#0F1E35` | Fond légèrement éclairci pour les blocs contextuels |
| `--color-emerald-light` | `#D4F0E8` | Fond success blocks, valeur ajoutée |
| `--color-crimson-light` | `#FAE0E0` | Fond douleur/alerte blocks |
| `--color-slate-light` | `#E8EDF2` | Fond tableaux lignes alternées |

## 5.2 Hiérarchie Chromatique — Soft Breach Armor

La progression chromatique des niveaux d'alerte suit une montée en urgence psychologiquement calibrée :

| Niveau | Seuil MDL | Couleur | Hex | Comportement UI | Action |
|---|---|---|---|---|---|
| **Nominal** | 0% | Vert Émeraude | `#0E765E` | Bouclier vert, bandeau compact | Aucune |
| **Niveau 1** | 50% | Or AETHERIS | `#C9A050` | Bandeau ambre, notification discrète | Conscience situationnelle |
| **Niveau 2** | 75% | Or Profond | `#8B6A20` | Modal interruptif, confirmation | Proposition Cooling Period |
| **Niveau 3** | 90% | Rouge Crimson | `#AF2D2D` | Overlay CSS pulse plein écran | Webhook + Email + Push simultanés |

## 5.3 Tokens Sémantiques pour Composants

### KPI Cards
```css
.kpi-positive { color: #0E765E; }   /* Gains, Win Rate élevé, PF > 1.5 */
.kpi-warning  { color: #C9A050; }   /* Valeur limite, attention requise */
.kpi-negative { color: #AF2D2D; }   /* Pertes, PF < 1.0, MDD > 20% */
.kpi-neutral  { color: #B8C1CC; }   /* Informations secondaires */
```

### Badges de Niveaux Aether Score
```css
.badge-apprentice  { background: #B8C1CC; }  /* Gris Ardoise */
.badge-practitioner{ background: #2F6792; }  /* Bleu Acier */
.badge-master      { background: #0E765E; }  /* Vert Émeraude */
.badge-elite       { background: #C9A050; color: #0A1321; } /* Or sur Nuit */
```

### Profit Factor — Affichage Conditionnel
```javascript
const getPFColor = (pf) => {
  if (pf < 1.0) return '#AF2D2D';   // Crimson — stratégie perdante
  if (pf < 1.5) return '#C9A050';   // Or — viable
  return '#0E765E';                  // Émeraude — robuste
};
```

## 5.4 Architecture de Navigation — Sidebar L1

La sidebar AETHERIS est une navigation persistante gauche (icône + libellé) avec collapse en mode icône seul sur mobile.

| Icône | ID | Module | Phase | Couleur Active | USP |
|---|---|---|---|---|---|
| 📊 | M1 | Dashboard | 1 | `#1E90FF` | — |
| 📓 | M2 | Workspace Journal | 1 | `#27AE60` | — |
| 📊 | M3 | Analytics & Performance | 1 | `#8E44AD` | — |
| 🧠 | M4 | Aether Flow — Psychologie | 2 | `#E67E22` | ★ USP |
| 🛡️ | M5 | Aether Armor | 2 | `#E74C3C` | ★ USP |
| 🔮 | M6 | Oracle Consensus | 3 | `#00BCD4` | ★ USP |
| 🌌 | M7 | Galaxie 3D | 3 | `#9B59B6` | — |
| 📋 | M8 | Tax Engine | 3 | `#16A085` | — |
| ⚙️ | M9 | Paramètres & Intégrations | 1→3 | `#7F8C8D` | — |

## 5.5 Système de Niveaux d'Architecture (L1→L4)

| Niveau | Dénomination | Description | Cardinalité |
|---|---|---|---|
| **L1** | Module de Navigation | Point d'entrée unique par domaine fonctionnel (Sidebar) | 9 modules |
| **L2** | Sous-Page / Onglet | Navigation par onglets en haut de page — URL dédiée | 2-4 par module |
| **L3** | Zone de l'Écran | Zones délimitées : Nord / Central / Est / Sud | Variables |
| **L4** | Widget / Composant Atomique | Élément interactif le plus granulaire : KPI, Chart, Field, Action | 300+ widgets |

---

---

# 6. LOGIQUE D'IMPLÉMENTATION DÉTAILLÉE — STANDARD AETHER ARMOR

> Cette section détaille les User Stories du module Aether Armor au niveau de granularité Agile (Gherkin BDD + Critères d'Acceptation + Edge Cases + Notes Techniques + DoD). Ce niveau de qualité constitue le **standard d'implémentation de référence** pour tous les autres modules d'AETHERIS.

---

## US-AA-001 — Configuration du Seuil Max Daily Loss (MDL)

**Epic :** CONFIGURATION | **Persona :** Trader retail / Prop Firm Trader | **Story Points :** 5 SP | **Priorité :** CRITIQUE

### User Story

> En tant que trader utilisant AETHERIS,
> je veux **configurer mon seuil de perte maximale journalière (Max Daily Loss) en valeur absolue ou en pourcentage du capital**,
> afin qu'AETHERIS puisse surveiller mon exposition en temps réel et me protéger avant que je ne dépasse ma limite de risque définie dans mon plan de trading.

### Contexte & Motivation

Le Max Daily Loss est la règle fondamentale de survie en trading. Les Prop Firms (FTMO, MyForexFunds) imposent des MDL stricts dont le dépassement entraîne la perte immédiate du compte financé. Les traders retail définissent leur propre tolérance. Sans une configuration précise et flexible, le module Aether Armor ne peut pas fonctionner — c'est la pierre angulaire de tout le système de protection.

### Scénarios Gherkin (BDD)

**Scénario 1 : Configuration initiale du MDL en pourcentage**
```gherkin
Étant donné que je suis connecté à AETHERIS et que je n'ai pas encore configuré de MDL
Et que je navigue vers Paramètres > Aether Armor > Règles de Risque
Quand je sélectionne le mode « Pourcentage du capital »
Et que j'entre la valeur 2 (pour 2% du capital)
Et que je sauvegarde la configuration
Alors le système calcule automatiquement la valeur absolue équivalente (2% × 50 000€ = 1 000€)
Et un bandeau de confirmation affiche « MDL configuré : 1 000€ (2% de 50 000€) »
Et le monitoring en temps réel démarre immédiatement
```

**Scénario 2 : Mise à jour du MDL selon les règles d'une Prop Firm**
```gherkin
Étant donné que j'ai un compte FTMO de 100 000€ avec un MDL de 5%
Et que je sélectionne le template « FTMO Challenge » dans la bibliothèque de règles
Quand AETHERIS charge automatiquement les paramètres FTMO (MDL 5%, Max Trailing DD 10%)
Alors les champs MDL sont pré-remplis avec 5 000€ et 10 000€ respectivement
Et un badge « FTMO » est affiché sur le dashboard
Et je peux ajuster manuellement si mes conditions personnelles diffèrent
```

**Scénario 3 : Recalcul dynamique après variation du capital**
```gherkin
Étant donné que j'ai configuré un MDL de 2% avec un capital de 50 000€ (= 1 000€)
Et que mon capital évolue à 52 000€ suite à des gains
Quand AETHERIS synchronise le P/L de la journée
Alors la valeur absolue du MDL se recalcule automatiquement à 1 040€
Et une notification discrète informe : « MDL mis à jour : 1 040€ (2% de 52 000€) »
Mais la méthode de calcul (% ou fixe) reste inchangée selon ma préférence
```

### Critères d'Acceptation

| # | Critère | Priorité |
|---|---|---|
| AC-01 | Le champ MDL accepte une valeur en € ou en % du capital avec bascule entre les deux modes | MUST |
| AC-02 | La valeur absolue et la valeur en % sont toujours affichées simultanément | MUST |
| AC-03 | Bibliothèque de templates Prop Firms disponible (FTMO, MyForexFunds, True Forex Funds, Funded Next) | MUST |
| AC-04 | Si le mode % est choisi, la valeur absolue se recalcule à chaque clôture de journée | MUST |
| AC-05 | Historique des modifications du MDL avec horodatage (audit trail) | SHOULD |
| AC-06 | La valeur du MDL ne peut pas être modifiée si une session de trading est en cours | MUST |
| AC-07 | Tooltip explicatif avec formule et exemple chiffré | SHOULD |
| AC-08 | MDL configurable par compte (multi-account indépendant) | MUST |
| AC-09 | Validation bloque si MDL > 10% (seuil de sécurité configurable par admin) | COULD |

### Cas Limites & Edge Cases

| Cas Limite | Comportement Attendu | Impact si Non Traité |
|---|---|---|
| Capital = 0 ou compte en drawdown total | Bloquer la configuration, message d'erreur explicite | Division par zéro sur calcul % |
| MDL modifié en cours de session | Refuser avec message « Modification impossible en session active » | Contournement délibéré des règles |
| Deux comptes avec MDL conflictuels | Chaque compte maintient son MDL indépendant, pas d'agrégation | Confusion sur quelle alerte est déclenchée |
| Valeur MDL avec virgule vs point décimal | Normalisation selon les paramètres locaux | Erreur silencieuse de parsing |
| Template Prop Firm dont les règles ont changé | Badge « Vérifier les règles actuelles » avec lien officiel | MDL non conforme → perte du compte financé |

### Notes Techniques

```
API Broker    : GET /api/v1/accounts/{id}/balance via REST ou WebSocket.
               Fallback sur dernière valeur connue si latence > 5s.

Calcul MDL    : Stocker MDLType ENUM('FIXED'|'PERCENTAGE') + MDLValue DECIMAL(10,4)
               + MDLBaseCapital DECIMAL(10,2).
               Recalcul à chaque clôture de trade via worker asynchrone.

Multi-account : Table account_risk_rules avec FK account_id.
               Agrégation cross-comptes = calcul séparé (US-AA-008 Phase 2).

Sécurité      : Toute modification du MDL déclenche un log dans risk_config_changes_log
               (userId, timestamp, oldValue, newValue, reason).

Templates     : Table prop_firm_templates versionée.
               Mise à jour trimestrielle via admin panel.
               Flag « règles non vérifiées » si > 90 jours sans mise à jour.
```

### Définition of Done (DoD)

- ☐ Interface de configuration MDL avec les 2 modes (€ fixe / % capital)
- ☐ Bibliothèque de 4 templates Prop Firms minimum (FTMO, MyForexFunds, True Forex Funds, Funded Next)
- ☐ Recalcul automatique % → € validé par tests unitaires (edge cases : capital = 0, MDL = 100%)
- ☐ Audit trail des modifications implémenté et testé
- ☐ Protection anti-modification en session active fonctionnelle
- ☐ Tests E2E sur les 3 scénarios Gherkin — tous green
- ☐ Documentation API endpoint `PATCH /accounts/{id}/risk-rules` complète
- ☐ Revue sécurité validée (pas d'injection SQL sur les champs numériques)

---

## US-AA-002 — Système d'Alertes Progressives Soft Breach (50% / 75% / 90%)

**Epic :** DÉTECTION | **Persona :** Trader actif en session | **Story Points :** 8 SP | **Priorité :** CRITIQUE

### User Story

> En tant que trader actif en cours de session,
> je veux **recevoir des alertes progressives et visuellement distinctes lorsque mon P/L quotidien s'approche de mon MDL par paliers (50%, 75%, 90%)**,
> afin d'être averti bien avant d'atteindre la limite catastrophique et d'ajuster mon comportement progressivement, avec une montée en urgence visuelle créant un déclencheur psychologique efficace.

### Scénarios Gherkin (BDD)

**Scénario 1 : Déclenchement alerte Niveau 1 — 50% MDL**
```gherkin
Étant donné que mon MDL est configuré à 1 000€
Et que j'ai actuellement -480€ de P/L sur la journée
Quand je clôture un trade et que mon P/L passe à -510€ (51%)
Alors le bandeau de statut en haut du dashboard passe en couleur ambre (#C9A050)
Et une notification push s'affiche : « ⚠️ Alerte Niveau 1 — 51% de ton MDL atteint
  (-510€ / -1000€). Reste 490€ de marge. »
Et un son discret est joué si les alertes sonores sont activées
Mais aucun verrouillage n'est suggéré à ce stade
```

**Scénario 2 : Déclenchement alerte Niveau 2 — 75% MDL**
```gherkin
Étant donné que l'alerte Niveau 1 a déjà été déclenchée
Et que mon P/L continue de se dégrader à -760€ (76%)
Quand ce seuil est franchi
Alors le bandeau passe en rouge vif avec icône pulsante
Et une notification urgente s'affiche avec le message de risque complet
Et un modal de confirmation apparaît : « 76% de ton MDL atteint.
  Veux-tu activer le mode refroidissement ? » avec bouton Oui / Continuer
Et les 3 derniers trades perdants du jour sont affichés pour contextualiser la spirale
```

**Scénario 3 : Déclenchement alerte Niveau 3 — 90% MDL — Urgence Critique**
```gherkin
Étant donné que mon P/L atteint -920€ (92% du MDL de 1 000€)
Quand ce seuil critique est franchi
Alors une alerte critique s'affiche en plein écran avec fond rouge pulsant (#AF2D2D, opacity 95%)
Et le message s'affiche : « 🚨 URGENCE : 92% de ton MDL. Il te reste 80€.
  Stop immédiat recommandé. »
Et une notification est envoyée par email ET push simultanément
Et si l'intégration Webhook est active, la plateforme de trading est notifiée
Et un timer de refroidissement de 15 minutes est proposé automatiquement
Et l'alerte est loggée avec horodatage précis à la seconde
```

**Scénario 4 : Remise à zéro automatique des alertes en fin de journée**
```gherkin
Étant donné que les alertes Niveau 1, 2 et 3 ont été déclenchées durant la session
Quand la fin de journée de trading est atteinte (heure configurable, défaut 22h00 UTC)
Alors tous les niveaux d'alerte sont remis à zéro automatiquement
Et le bandeau revient à l'état neutre (vert / gris)
Et un résumé de session est généré incluant les alertes déclenchées
Mais l'historique des alertes reste accessible dans les analytics
```

### Critères d'Acceptation

| # | Critère | Priorité |
|---|---|---|
| AC-01 | Les 3 seuils d'alerte (50%, 75%, 90%) sont configurables individuellement | MUST |
| AC-02 | Chaque niveau dispose d'une couleur distincte et d'une intensité d'alerte croissante | MUST |
| AC-03 | Bandeau permanent : P/L actuel / MDL / % atteint / montant restant | MUST |
| AC-04 | Notifications push sur mobile et desktop avec payload complet | MUST |
| AC-05 | Un même seuil ne déclenche qu'une seule notification par session (anti-spam) | MUST |
| AC-06 | Chaque alerte est horodatée et stockée dans l'historique avec contexte | MUST |
| AC-07 | Modal Niveau 2 présente les 3 derniers trades du jour | SHOULD |
| AC-08 | Alerte Niveau 3 peut envoyer un email à une adresse tierce (coach, risk manager) | SHOULD |
| AC-09 | Alertes sonores optionnelles et désactivables par niveau | COULD |
| AC-10 | Remise à zéro automatique quotidienne à l'heure configurable | MUST |

### Notes Techniques

```
Architecture  : Worker de monitoring temps réel (WebSocket ou polling toutes les 2s).
               Microservice indépendant pour garantir disponibilité sous charge.

State machine : SAFE → LEVEL1 → LEVEL2 → LEVEL3 → BLOWN
               (pas de retour arrière dans la session)
               breach_level = current_loss / MDL

Anti-spam     : Redis SET avec TTL = durée de session
               Key : breach_alert:{userId}:{sessionDate}:{level}
               Si key existe → skip notification

Notifications : FCM (Firebase Cloud Messaging) pour push mobile/desktop
               + SendGrid/Resend pour email
               Payload JSON : {severity, value, threshold, timestamp}

Performance   : calcul breach_level en mémoire cache Redis — pas de requête DB
               Mise à jour async DB uniquement aux franchissements de seuil
               Target : calcul < 100ms end-to-end depuis clôture trade

Frontend      : Bandeau sticky = composant React avec React.memo
               State global (Zustand) mis à jour via WebSocket
               Animation CSS keyframes pulse pour Niveau 3
```

### Définition of Done (DoD)

- ☐ Les 3 niveaux d'alerte visuels avec codes couleur définis
- ☐ Notifications push (mobile + desktop) via FCM — testé iOS et Android
- ☐ Anti-spam Redis fonctionnel — test de charge 100 trades en 1 minute
- ☐ Modal Niveau 2 avec 3 derniers trades implémenté
- ☐ Alerte Niveau 3 plein écran avec timer de refroidissement
- ☐ Historique des alertes persisté avec contexte complet
- ☐ Reset quotidien automatique testé avec scénario overnight
- ☐ Tests E2E sur les 4 scénarios Gherkin — tous green
- ☐ Performance : calcul breach_level < 100ms end-to-end

---

## US-AA-003 — Intégration Webhook vers la Plateforme de Trading

**Epic :** INTERVENTION | **Persona :** Trader avancé / Prop Firm Trader | **Story Points :** 13 SP | **Priorité :** HAUTE

### User Story

> En tant que trader avancé ayant connecté ma plateforme de trading à AETHERIS,
> je veux qu'**AETHERIS envoie automatiquement un Webhook à ma plateforme lorsque mon MDL atteint 90% (Niveau 3)**,
> afin de bénéficier d'une protection active cross-plateforme qui rend la violation du MDL techniquement difficile — pas seulement psychologiquement visible.

### Scénarios Gherkin

**Scénario 1 : Configuration d'un Webhook vers NinjaTrader**
```gherkin
Étant donné que je suis dans Paramètres > Aether Armor > Intégrations Webhook
Quand j'entre l'URL Webhook de mon script NinjaTrader et la clé API
Et que je clique sur « Tester la connexion »
Alors AETHERIS envoie un payload de test au Webhook
Et affiche « ✅ Connexion confirmée — NinjaTrader a répondu avec HTTP 200 »
Et je peux sélectionner le niveau de déclenchement (Niveau 2 ou Niveau 3)
Et sauvegarder la configuration
```

**Scénario 2 : Déclenchement automatique au Niveau 3**
```gherkin
Étant donné que le Webhook NinjaTrader est configuré et actif
Et que mon P/L atteint 92% de mon MDL
Quand l'alerte Niveau 3 est déclenchée
Alors AETHERIS envoie immédiatement le payload JSON normalisé au Webhook
Et le payload contient : userId, accountId, triggerLevel, currentLoss, MDL,
  percentageReached, timestamp
Et un log de l'appel est créé avec statut HTTP reçu
Et si HTTP 200, l'envoi est marqué 'Succès' dans l'historique
Et l'alerte Niveau 3 dans AETHERIS est déclenchée simultanément (non-bloquant)
```

**Scénario 3 : Gestion d'un Webhook en échec (timeout)**
```gherkin
Étant donné que le Webhook est configuré mais la plateforme est hors ligne
Quand AETHERIS tente d'envoyer le payload au Niveau 3
Et que l'appel HTTP timeout après 5 secondes
Alors AETHERIS effectue 2 tentatives supplémentaires (backoff : 5s, 15s, 45s)
Et si toutes échouent, un log d'erreur est créé avec payload sauvegardé
Et l'alerte Niveau 3 est déclenchée normalement (Webhook non-bloquant)
Et l'utilisateur est notifié : « ⚠️ Webhook non délivré — Plateforme inaccessible »
```

### Payload JSON Normalisé (Schema Public)

```json
{
  "event": "BREACH_ALERT",
  "triggerLevel": 3,
  "data": {
    "currentLoss": -920.50,
    "MDL": -1000.00,
    "percentReached": 92.05,
    "accountId": "uuid-account"
  },
  "meta": {
    "timestamp": "2026-02-20T14:32:11.000Z",
    "deliveryId": "uuid-delivery",
    "version": "1.0",
    "test": false
  }
}
```

### Critères d'Acceptation Clés

| # | Critère | Priorité |
|---|---|---|
| AC-01 | Jusqu'à 3 Webhooks actifs simultanément (multi-plateforme) | MUST |
| AC-02 | Configurable : URL, méthode HTTP, headers personnalisés, secret HMAC | MUST |
| AC-03 | Niveau de déclenchement configurable : Niveau 2 (75%) ou Niveau 3 (90%) | MUST |
| AC-04 | Signature HMAC-SHA256 automatique (header X-Aetheris-Signature) | MUST |
| AC-05 | Retry policy : 3 tentatives, backoff exponentiel (5s, 15s, 45s) | MUST |
| AC-06 | Historique des appels consultable (URL, statut, payload, réponse) | MUST |
| AC-07 | Webhook non-bloquant : échec n'impacte pas l'alerte native | MUST |
| AC-08 | Simulateur test avec flag `test: true` | MUST |
| AC-09 | Protection SSRF : blacklist IP privées (10.x, 192.168.x, 172.16.x, 127.x) | MUST |

### Notes Techniques

```
Sécurité      : HMAC-SHA256 par payload avec secret unique par Webhook.
               Validation anti-SSRF via blacklist IP avant envoi.

Architecture  : Queue asynchrone BullMQ. Worker Webhook isolé.
               Timeout n'impacte jamais le flow principal d'alerte.

Idempotency   : webhook_delivery_id unique par tentative.
               Clé de déduplication = {userId}:{sessionDate}:{level}:{webhookId}

Templates     : NinjaTrader, MetaTrader 4/5, Interactive Brokers, TradingView
               Table webhook_platform_templates avec payload_override_schema JSON

Monitoring    : Dashboard admin — taux de succès par utilisateur.
               Alerte interne si taux d'erreur > 10% sur 1h.
```

---

## US-AA-004 — Détection Automatique du Revenge Trading

**Epic :** DÉTECTION | **Persona :** Trader émotionnel / Trader après série de pertes | **Story Points :** 8 SP | **Priorité :** CRITIQUE

### User Story

> En tant que trader en session active,
> je veux qu'**AETHERIS détecte automatiquement les patterns de Revenge Trading** en analysant la cadence, la taille et la séquence de mes trades,
> afin de recevoir une alerte contextualisée avant que la spirale émotionnelle ne me coûte significativement — car dans l'état de tilt, je suis incapable de me voir faire.

### Algorithme de Détection

**Score composite Revenge Trading (0-100) basé sur 3 critères pondérés :**

```
Critère 1 — Pertes consécutives     : N trades perdants d'affilée (seuil: 3)
Critère 2 — Vitesse d'exécution     : Intervalle moyen < T secondes (seuil: 3min)
Critère 3 — Spike de taille         : last_size / baseline_size >= X (seuil: 2×)

Score = (C1_weight × C1_value) + (C2_weight × C2_value) + (C3_weight × C3_value)
Seuil d'alerte : Score > 60/100 (configurable : Sensible/Modéré/Strict)

Baseline = taille moyenne des 30 derniers jours, par instrument et par session
           Recalcul quotidien via job asynchrone
           Stockée dans trading_baselines (rolling 30-day window)
```

### Edge Cases Critiques

| Cas | Comportement | Impact |
|---|---|---|
| Scalper 50+ trades/heure | Baseline adapte les seuils par style de trading déclaré | Faux positifs constants → module inutilisable |
| Clôtures automatiques SL/TP | Distinguer clôtures auto vs manuelles dans l'analyse | Faux positifs sur stratégies SL serrés |
| Nouveau user < 30 trades | Désactiver détection par baseline, utiliser cadence seule | Faux positifs massifs dès l'onboarding |
| Trade intentionnel taille augmentée | Bouton « Trade intentionnel — Ignorer » logué | Friction sur bonnes décisions |

---

## US-AA-005 — Timer de Refroidissement (Cooling Period) Interactif

**Epic :** INTERVENTION | **Persona :** Trader en état de tilt | **Story Points :** 5 SP | **Priorité :** HAUTE

### User Story

> En tant que trader ayant déclenché une alerte Niveau 2 ou Niveau 3,
> je veux qu'**un timer de refroidissement configurable soit proposé avec un mode guidé**,
> afin de rompre le cycle émotionnel du tilt grâce à une interruption active — transformant la pause forcée en rituel de reset psychologique.

### Friction Délibérée — Sortie Anticipée

```
Principe : B.J. Fogg Behavioral Friction Design
Les 3 cases de confirmation ne peuvent pas être cochées simultanément.
Délai minimum de 2 secondes entre chaque case.
Log de l'aborted_at avec raison (clicked_early, duration_reached).

Cases de confirmation :
  ☐ "Je suis dans mon plan de trading"
  ☐ "Je ne trade pas par émotion"
  ☐ "Je respecte mes stops et mon sizing"
```

### Activités de Reset Proposées

1. **Respiration guidée** — Animation 4-7-8 : inhale (4s) / hold (7s) / exhale (8s)
2. **Revue du plan de trading** — Affichage read-only avec question de conformité
3. **Analyse des pertes** — Affichage des 3 trades de la spirale avec P/L, R, durée

### Notes Techniques

```
State management : Timer géré en localStorage + state React (persistance multi-onglets)
                   Service Worker pour maintenir le timer en arrière-plan (onglet fermé)

Escalade auto    : 1ère fois = 15min | 2ème fois = 20min | 3ème fois = 30min

Analytics        : Corrélation automatique Cooling Periods ↔ P/L post-pause
                   Affiché dans insights mensuels : « Après Cooling, ton P/L = +0.4R vs -0.8R »
```

---

## US-AA-006 — Dashboard Aether Armor en Temps Réel

**Epic :** REPORTING | **Persona :** Tout trader en session | **Story Points :** 5 SP | **Priorité :** HAUTE

### User Story

> En tant que trader en session de trading active,
> je veux **visualiser en un coup d'œil l'état complet de ma protection Aether Armor** — P/L actuel, % MDL, score de risque et événements de la journée,
> afin d'avoir une conscience situationnelle permanente de mon état de risque sans naviguer entre plusieurs menus.

### Composants du Bandeau Sticky (L3 Zone Nord — Permanent)

| Composant | Données Affichées | Mise à jour |
|---|---|---|
| Icône Statut Armor | Bouclier animé : vert/ambre/rouge/rouge pulsant | Temps réel |
| Barre MDL Progression | 0→100%, couleur adaptative, valeur €, % numérique | < 2s après trade |
| P/L Actuel vs MDL | Format : `-420€ / -1 000€ (42%)` | Temps réel |
| MDL Restant | `Il vous reste 580€`. Rouge si < 15% | Temps réel |
| Score de Risque | Score 0-100 composite (MDL% + Revenge + VSS) | Temps réel |
| Dernière Alerte | Timestamp + type. Lien vers historique | À chaque événement |

### Notes Techniques

```
WebSocket       : Subscription sur canal user:{userId}:armor-status
               Message format : {pnl, mdrPct, riskScore, level}
               Reconnexion automatique avec exponential backoff

Performance     : Bandeau = composant React.memo — aucune requête HTTP
               Toutes données via WebSocket uniquement
               Target : mise à jour < 2s après clôture trade

Accessibilité   : ARIA labels sur barre de progression
               Contraste WCAG AA minimum sur toutes les variantes de couleur
               prefers-reduced-motion : désactive animations pulsing

Dégradé        : Si WebSocket perdu → badge « Synchronisation... » + polling 5s
```

---

## Synthèse Sprint — Module Aether Armor Complet

| User Story | Epic | SP | Priorité |
|---|---|---|---|
| US-AA-001 — Configuration MDL | CONFIGURATION | 5 SP | CRITIQUE |
| US-AA-002 — Alertes Soft Breach | DÉTECTION | 8 SP | CRITIQUE |
| US-AA-003 — Intégration Webhook | INTERVENTION | 13 SP | HAUTE |
| US-AA-004 — Détection Revenge Trading | DÉTECTION | 8 SP | CRITIQUE |
| US-AA-005 — Timer Cooling Period | INTERVENTION | 5 SP | HAUTE |
| US-AA-006 — Dashboard Armor RT | REPORTING | 5 SP | HAUTE |
| **TOTAL** | **4 Epics** | **44 SP** | **~2 Sprints** |

### Recommandation Sprint

| Sprint | User Stories | Focus |
|---|---|---|
| **Sprint 1** (2 semaines) | US-AA-001 (5) + US-AA-002 (8) + US-AA-006 (5) = 18 SP | Infrastructure monitoring + Alertes + Dashboard |
| **Sprint 2** (2 semaines) | US-AA-003 (13) + US-AA-004 (8) + US-AA-005 (5) = 26 SP | Webhook + Revenge Detection + Cooling Period |

### Risques & Mitigations

| Risque | Probabilité / Impact | Mitigation |
|---|---|---|
| Latence API courtier > 5s pour MAJ P/L | Moyenne / Élevé | Fallback polling 10s + indicateur fraîcheur données |
| Faux positifs Revenge Trading (scalpers) | Haute / Moyen | Mode adaptatif par style + bouton « Ignorer » logué |
| Webhook refusé par plateforme (CORS, firewall) | Moyenne / Élevé | Documentation intégration par plateforme + test obligatoire |
| Résistance Cooling Period (perçu contraignant) | Haute / Faible | Mode 100% optionnel + démonstration ROI analytics |

---

---

# 7. ROADMAP & STRATÉGIE D'IMPLÉMENTATION

## 7.1 Vue d'Ensemble des 3 Phases

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
Critère de succès: NPS > 50 · Churn < 5% mensuel · Reviews USP

PHASE 3 — Apogée : IA & Intelligence Institutionnelle    Q1–Q2 2027
═══════════════════════════════════════════════════════════
Durée estimée    : 5–6 mois
Modules          : #13 Oracle Consensus · #14 Whale Impact · #15 Shadow Index
                   #16 Galaxie 3D · #17 Tax Engine
Objectif         : Leadership technologique — fossé concurrentiel infranchissable
Critère de succès: Feature coverage 0 équivalents concurrents sur 3 USP Phase 3
```

## 7.2 Répartition des 15 Modules Stratégiques

| # | Module | Phase | Domaine | USP | Sprint Estimé |
|---|---|---|---|---|---|
| 01 | Auto-Sync Universel | 1 | Infrastructure | — | S1-S2 |
| 02 | Calendar Heatmap | 1 | Infrastructure | — | S2 |
| 03 | Multi-Account Aggregation | 1 | Infrastructure | — | S3 |
| 04 | P/L Engine Institutionnel | 1 | Métriques | — | S1-S2 |
| 05 | KPI Tracking Complet | 1 | Métriques | — | S3-S4 |
| 06 | Position Sizing Dynamique | 1 | Risk Mgmt | — | S4 |
| 07 | Reporting Multi-Format | 1 | Reporting | — | S5 |
| 08 | Aether Flow | 2 | Psychologie | ★ | S6-S7 |
| 09 | Speech-to-Text VSS | 2 | Psychologie | ★★ | S7-S8 |
| 10 | Aether Armor | 2 | Protection | ★★ | S6-S8 (2 sprints) |
| 11 | Soft Breach Guardrails | 2 | Protection | — | S8 |
| 12 | Aether Score | 2 | Gamification | — | S9 |
| 13 | Oracle Consensus | 3 | IA | ★★ | S10-S12 |
| 14 | Whale Impact Tracker | 3 | IA | ★★ | S10-S11 |
| 15 | Shadow Index | 3 | IA | ★★★ | S11-S12 |
| 16 | Galaxie 3D | 3 | Visualisation | — | S12-S14 |
| 17 | Tax Engine | 3 | Fiscal | — | S13-S14 |

## 7.3 Architecture Technique Recommandée

### Stack Frontend
```
Framework    : Next.js 15 (App Router) + TypeScript
Styling      : Tailwind CSS + tokens AETHERIS custom properties
UI Library   : shadcn/ui (customisé avec palette AETHERIS)
State        : Zustand (global) + React Query (server state)
Charts       : Recharts (2D) + Three.js r128 (Galaxie 3D)
Realtime     : WebSocket natif + FCM (push notifications)
Audio        : Web Audio API + OpenAI Whisper (STT)
```

### Stack Backend
```
Runtime      : Node.js 22 LTS + TypeScript
API          : REST (v1) + WebSocket (realtime armor/sync)
Queue        : BullMQ (Webhook deliveries, background jobs)
Cache        : Redis (armor state, breach calculations, anti-spam)
Auth         : JWT + TOTP (2FA) + RBAC
```

### Base de Données
```
Primary      : PostgreSQL 16 (ACID, relations, JSON columns)
Cache/RT     : Redis 7 (breach state, sessions, queues)
File Storage : AWS S3 ou GCS (audio vocaux, screenshots, exports PDF)
Search       : Optionnel Phase 3 — Elasticsearch (transcriptions vocales)
```

### Services Externes (Phase 3)
```
Whale Data   : Whale Alert API (on-chain movements)
COT Data     : CFTC public data + Quandl/Nasdaq Data Link
Social       : Twitter API v2 + Reddit PRAW + Discord Bot
Options Flow : Unusual Whales / Market Chameleon / Benzinga Pro
STT          : OpenAI Whisper (défaut) / Google STT / Azure STT
Fiscal       : IRS e-file compatible output + TurboTax .txf format
```

## 7.4 Principes d'Architecture Cross-Cutting

### Sécurité
- Credentials broker chiffrés AES-256 au repos dans la base de données
- Clés API intégrations chiffrées AES-256 (colonne `api_key_encrypted`)
- HMAC-SHA256 sur tous les Webhooks sortants
- Protection SSRF sur les URL Webhook (blacklist IP privées)
- RBAC : seul le propriétaire du compte peut modifier ses règles (pas d'accès cross-user)
- Audit trail sur toutes les modifications critiques (MDL, règles Armor)
- 2FA TOTP disponible pour tous les comptes

### Performance
- Calcul du breach_level Armor en mémoire Redis — aucune requête DB par trade
- Les analytics lourds (Strategy Stats, 3D coordinates) sont précalculés via jobs quotidiens
- React.memo sur tous les composants du bandeau Armor (hot path)
- Lazy loading des pages L2 non-actives
- Images et screenshots au format WebP avec lazy loading

### Scalabilité
- Microservice Armor Monitor indépendant (scalable horizontalement)
- Queue BullMQ pour les Webhooks (résilience aux pics de charge)
- Cache Redis partagé pour les breach states (multi-instance safe)
- Collections analytiques séparées des collections transactionnelles (OLAP vs OLTP)

---

---

## CONCLUSION STRATÉGIQUE

AETHERIS, exécuté selon ce PRD, n'est pas une itération d'un journal de trading existant. C'est la création d'une **nouvelle catégorie de produit** : le **Trading Copilot OS**.

Les 5 avantages concurrentiels documentés (Prévention Active · Intelligence Institutionnelle · Psychologie Vocale IA · Visualisation 3D · ROI Psychologique Quantifié) constituent collectivement un MOAT technologique et produit que les concurrents actuels (TraderSync, Edgewonk, Tradervue, TradesViz, TradeZella) ne pourront pas répliquer rapidement.

La roadmap en 3 phases assure une mise sur le marché compétitive en Phase 1, une différenciation forte en Phase 2, et une position de leader technologique inattaquable en Phase 3.

---

*PRD AETHERIS v1.0 — Généré selon les sources : Backlog Produit & Design System v1.0 · Sitemap & Architecture d'Information · Analyse Fonctionnelle · User Stories Aether Armor — Février 2026*

*Document certifié production-ready pour implémentation par équipe engineering et IA de codage (Copilot).*
