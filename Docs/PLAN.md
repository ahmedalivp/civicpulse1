# Project Plan: Civic Pulse

## Database Tables
- `users`: Identity and karma.
- `localities`: Regions of operation.
- `categories`: Issue categories.
- `authorities`: Escalation targets.
- `authority_contacts`: Delivery endpoints.
- `issues`: The core reports.
- `issue_images`: Processed photos (references).
- `issue_links`: Duplicates/related.
- `supports`: Upvotes and 'affected too'.
- `hazard_confirmations`: Fast-track signals.
- `comments`: Community discussion.
- `flags`: Moderation queue.
- `status_events`: Lifecycle timeline.
- `resolution_votes`: Community confirmation.
- `escalations`: Outbound formal reports.
- `escalation_events`: Delivery tracking.
- `threshold_configs`: Tuning per locality.
- `notifications`: User alerts.
- `karma_events`: Reputation ledger.
- `user_badges`: Achievements.
- `moderation_actions`: Admin log.
- `audit_log`: System ledger.
- `locality_reports`: Auto-generated pulse summaries.
- `waitlist`: Demand tracking.

## Routes (Web)
- `/(feed)`: Locality feed and map.
- `/pulse`: Dashboard/metrics.
- `/report`: Issue creation flow.
- `/issues/[id]`: Issue details and timeline.
- `/profile`: User settings and karma.
- `/admin/*`: Moderation and system setup.
- `/a/[token]`: Signed links for authorities.

## Key Files per Phase
- **Phase 0 (Scaffold)**: `pnpm-workspace.yaml`, `packages/core/src/*`, `web/`, `worker/`, `supabase/migrations/00000_schema.sql`, `supabase/seed.sql`, `Docs/PROGRESS.md`, `Design/DESIGN_TOKENS.css`.
- **Phase 1 (ACC)**: `web/src/app/login/page.tsx`, `web/src/components/auth/*`, RLS policies in `supabase/migrations/00001_rls.sql`.
- **Phase 2 (RPT, IMG)**: `web/src/app/report/page.tsx`, `web/src/components/CameraView.tsx`, `worker/src/image-pipeline.ts`.
- **Phase 3 (FED)**: `web/src/app/page.tsx`, `web/src/components/Map.tsx`, `web/src/components/IssueCard.tsx`.
- **Phase 4 (ENG, RNK)**: `packages/core/src/domain/ranking.ts`, `packages/core/src/domain/anti-gaming.ts`, `web/src/app/issues/[id]/page.tsx`.
- **Phase 5 (LIF, ESC, NTF)**: `worker/src/escalation.ts`, `packages/core/src/adapters/email.ts`, `packages/core/src/domain/routing.ts`.
- **Phase 6 (MOD, ADM)**: `web/src/app/admin/page.tsx`, `web/src/components/mod/*`.
- **Phase 7 (PLS, SUP, NFR)**: `web/src/app/pulse/page.tsx`, `web/src/app/about/page.tsx`, analytics config.
- **Phase 8 (SHIP P1)**: `web/src/tests/*`, `packages/core/tests/*`, Demo Script.
