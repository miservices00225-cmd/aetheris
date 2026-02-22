## 1. Supabase Project Setup

- [ ] 1.1 Verify Supabase project exists and API credentials in backend/.env.local
- [ ] 1.2 Enable Row-Level Security (RLS) enforcement in Supabase project settings
- [ ] 1.3 Create SQL migrations directory structure (backend/migrations/)

## 2. Core Tables - Users & Authentication

- [ ] 2.1 Create `users` table (id, email, kycaml_status, created_at)
- [ ] 2.2 Add RLS policy: users can only view own record
- [ ] 2.3 Create audit trigger on users INSERT/UPDATE for KYC/AML logging
- [ ] 2.4 Test user registration flow with RLS enforced

## 3. Core Tables - Trading Accounts

- [ ] 3.1 Create `accounts` table (id, user_id, broker_type, risk_limits, prop_firm_rules JSONB, created_at)
- [ ] 3.2 Add RLS policy: users can only view own accounts
- [ ] 3.3 Create indices on user_id for fast account lookups
- [ ] 3.4 Create `prop_firm_templates` lookup table (FTMO, MyForexFunds, custom rules)
- [ ] 3.5 Test multi-account isolation with RLS

## 4. Broker Integration Tables

- [ ] 4.1 Create `broker_connections` table (id, account_id, api_key ENCRYPTED, sync_status, last_sync_at)
- [ ] 4.2 Add RLS policy: users can only access own broker credentials
- [ ] 4.3 Create index on account_id for sync queries
- [ ] 4.4 Document encryption/decryption pattern in backend code comments
- [ ] 4.5 Test encrypted credential storage and access via backend

## 5. Trade Records Tables

- [ ] 5.1 Create `trades` table (id, account_id, broker_trade_id UNIQUE, entry_price, exit_price, symbol, quantity, fees, slippage, pnl, mfe, mae, duration_seconds, created_at, closed_at)
- [ ] 5.2 Add RLS policy: users can only view trades for own accounts
- [ ] 5.3 Create UNIQUE constraint on (broker_id, broker_trade_id, account_id) for deduplication
- [ ] 5.4 Create indices on account_id, symbol, created_at for heatmap/analytics queries
- [ ] 5.5 Test duplicate trade rejection (UNIQUE constraint triggers)
- [ ] 5.6 Test trade update logic (conflict resolution: IGNORE vs OVERWRITE)

## 6. Audit & Sync Tables

- [ ] 6.1 Create `sync_logs` table (id, account_id, broker_id, trades_new, trades_duplicate, trades_error, error_details, sync_timestamp)
- [ ] 6.2 Add RLS policy: users can only view own sync logs
- [ ] 6.3 Create audit trigger on trades for INSERT/UPDATE → logs to sync_logs
- [ ] 6.4 Create indices on account_id, sync_timestamp for audit queries
- [ ] 6.5 Test sync audit trail logging (new/duplicate/error counts)

## 7. Daily Snapshots & KPI Tables

- [ ] 7.1 Create `daily_snapshots` table (id, account_id, date, net_pnl, trade_count, created_at)
- [ ] 7.2 Add RLS policy: users can only view own snapshots
- [ ] 7.3 Create index on (account_id, date) for heatmap queries
- [ ] 7.4 Create `kpi_snapshots` table (id, account_id, date, expectancy, profit_factor, sharpe, kelly_criterion, drawdown, win_rate, r_multiple, kpi_json JSONB for 200+ metrics)
- [ ] 7.5 Create index on (account_id, date) for metrics dashboard queries
- [ ] 7.6 Test daily snapshot pre-computation logic (on-demand vs batch)

## 8. Psychology & Emotion Tracking Tables

- [ ] 8.1 Create `emotion_logs` table (id, trade_id, emotion_type VARCHAR, financial_cost DECIMAL, created_at)
- [ ] 8.2 Add RLS policy: users can only view own emotion logs
- [ ] 8.3 Create index on trade_id for trade detail views
- [ ] 8.4 Test emotion logging and financial cost attribution

## 9. Vocal & Audio Tables (Phase 2 prep)

- [ ] 9.1 Create `vocal_notes` table (id, account_id, transcript TEXT, vss_timeline JSONB, audio_url VARCHAR, created_at)
- [ ] 9.2 Add RLS policy: users can only view own vocal notes
- [ ] 9.3 Document encryption strategy for audio files (Phase 2)
- [ ] 9.4 Create index on created_at for timeline queries

## 10. Armor Breach & Risk Tables

- [ ] 10.1 Create `armor_breaches` table (id, account_id, breach_type VARCHAR (soft|hard), breach_level DECIMAL, timestamp TIMESTAMP)
- [ ] 10.2 Add RLS policy: users can only view own breaches
- [ ] 10.3 Create index on (account_id, timestamp) for breach timeline
- [ ] 10.4 Create audit trigger for breach logging
- [ ] 10.5 Test soft breach detection (50% MDL) and hard breach (100% MDL)

## 11. Webhook & Event Tables

- [ ] 11.1 Create `webhook_events` table (id, account_id, event_type, webhook_url, payload JSONB, retry_count, next_retry_at, status)
- [ ] 11.2 Add RLS policy: users can only manage own webhook URLs
- [ ] 11.3 Create index on (account_id, status, next_retry_at) for retry processing
- [ ] 11.4 Test webhook event creation and retry logic

## 12. Institutional Intelligence Tables (Phase 3 prep)

- [ ] 12.1 Create `whale_events` table (id, symbol, whale_flow_direction, correlated_trade_ids JSONB, event_timestamp)
- [ ] 12.2 Create `oracle_scores` table (id, symbol, timestamp, whale_flow_score, cot_score, shadow_index_score, pre_trade_score)
- [ ] 12.3 Document Phase 3 population strategy (data source, update frequency)

## 13. Session Tracking Tables

- [ ] 13.1 Create `sessions` table (id, account_id, session_start, session_end, tilt_flag BOOLEAN, trades_count, session_pnl, created_at)
- [ ] 13.2 Add RLS policy: users can only view own sessions
- [ ] 13.3 Create index on (account_id, session_start) for session analysis
- [ ] 13.4 Test session creation and tilt detection logic

## 14. RLS Security Verification

- [ ] 14.1 Test all RLS policies with two different users (verify data isolation)
- [ ] 14.2 Attempt to query other user's trades → should return empty (RLS blocks)
- [ ] 14.3 Attempt to access other user's accounts via account_id → should fail (RLS blocks)
- [ ] 14.4 Enable RLS enforcement in Supabase dashboard
- [ ] 14.5 Document RLS policy architecture in backend/README.md

## 15. Indexing & Performance

- [ ] 15.1 Create index on `trades.broker_trade_id` for deduplication checks
- [ ] 15.2 Create composite index on `trades(account_id, created_at)` for heatmap queries
- [ ] 15.3 Create composite index on `daily_snapshots(account_id, date)` for heatmap
- [ ] 15.4 Create composite index on `kpi_snapshots(account_id, date)` for metrics dashboard
- [ ] 15.5 Create GIN indices on JSONB columns (prop_firm_rules, vss_timeline, payload)
- [ ] 15.6 Test query performance on heatmap (100+ days, 1000+ trades)

## 16. Audit Triggers & Compliance

- [ ] 16.1 Create audit_trail logging function
- [ ] 16.2 Create triggers on trades for INSERT/UPDATE → audit trail
- [ ] 16.3 Create triggers on users for KYC status changes → audit trail
- [ ] 16.4 Create triggers on broker_connections for credential changes → audit trail
- [ ] 16.5 Document audit trail for compliance team (KYC/AML verification procedures)
- [ ] 16.6 Test audit trigger firing and data preservation

## 17. Deduplication & Conflict Resolution

- [ ] 17.1 Document UNIQUE constraint behavior for broker_trade_id
- [ ] 17.2 Implement IGNORE strategy handler (if duplicate found, keep original)
- [ ] 17.3 Implement OVERWRITE strategy handler (if duplicate found with changes, update fields)
- [ ] 17.4 Test duplicate import scenarios (same broker_trade_id, different exit prices)
- [ ] 17.5 Test conflict handling and logging

## 18. Backend Supabase Client Integration

- [ ] 18.1 Verify backend/.env.local has SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY
- [ ] 18.2 Update backend/src/config/supabase.ts with service key for admin operations (triggers, backups)
- [ ] 18.3 Create backend/src/database/trades.ts with trade query helpers (insert, select, update)
- [ ] 18.4 Create backend/src/database/accounts.ts with account query helpers
- [ ] 18.5 Create backend/src/database/audit.ts with audit trail logging helpers
- [ ] 18.6 Test Supabase client connectivity from backend

## 19. Documentation & SQL Scripts

- [ ] 19.1 Create backend/migrations/001_init_schema.sql with all table CREATE statements
- [ ] 19.2 Create backend/migrations/002_rls_policies.sql with all RLS policy definitions
- [ ] 19.3 Create backend/migrations/003_audit_triggers.sql with trigger definitions
- [ ] 19.4 Create backend/migrations/004_indices.sql with all index definitions
- [ ] 19.5 Document schema in backend/DATABASE.md (tables, columns, RLS, relationships)
- [ ] 19.6 Document deduplication strategy in backend/DEDUPLICATION.md

## 20. Testing & Validation

- [ ] 20.1 Write Jest tests for Supabase connectivity (health check)
- [ ] 20.2 Write Jest tests for trade insert/update with deduplication logic
- [ ] 20.3 Write Jest tests for RLS policy enforcement (user isolation)
- [ ] 20.4 Write Jest tests for audit trail logging
- [ ] 20.5 Write Jest tests for conflict resolution (IGNORE/OVERWRITE)
- [ ] 20.6 Write Jest tests for daily snapshot pre-computation
- [ ] 20.7 Run full test suite → all passing before final commit

## 21. Deployment & Verification

- [ ] 21.1 Execute migrations on Supabase production project (via SQL Editor)
- [ ] 21.2 Verify all tables created successfully
- [ ] 21.3 Verify all RLS policies active in Supabase dashboard
- [ ] 21.4 Verify all indices created (check performance stats)
- [ ] 21.5 Test end-to-end: user registration → account creation → broker sync → daily snapshot
- [ ] 21.6 Document known limitations and Phase 2+ work
- [ ] 21.7 Commit all changes and push to GitHub

## 22. Phase 2+ Preparation

- [ ] 22.1 Document real-time subscriptions requirements (REPLICA IDENTITY FULL)
- [ ] 22.2 Document async job queues for daily snapshot batch processing
- [ ] 22.3 Document encryption implementation for audio files (Phase 2)
- [ ] 22.4 Document Oracle data population strategy (Phase 3)

---

**Total Tasks: 98 checkboxes**  
**Estimated Duration: 40-60 hours** (assuming 25-40 min per task + testing)  
**Blockers: None** (all dependencies available, Supabase project ready, credentials in .env.local)  
**Phase 1 Impact: CRITICAL** (blocks broker sync, metrics engine, dashboard)
