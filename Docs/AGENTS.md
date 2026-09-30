# AGENTS.md (locked)
Source of truth: docs/PRODUCT_REFERENCE.md. FULL-SCOPE build: this OVERRIDES its "P1 only" rule. Build P1, ship, then P2, then P3. Design source: design/ (DESIGN.md + screens). Rebuild as React components; never paste raw HTML.
Vars: LOCALITY=[name] LOCALE_PRIMARY=[language] EMERGENCY_NUMBER=[number]. If unfilled, use fictional "Riverside Ward" and mark seed data fictional.

## Stack
- pnpm monorepo: /web (Next.js App Router, TS strict, Tailwind, next-intl, installable PWA, IndexedDB draft queue, Web Push/VAPID), /worker (Node TS, node-cron), /packages/core (types, config, ranking/escalation/routing as pure functions with unit tests).
- Supabase: Postgres + PostGIS + pg_trgm, Auth, Storage (private `raw`, public `processed`), Realtime, RLS on every table. Migrations in /supabase/migrations.
- Queue = `jobs` table (FOR UPDATE SKIP LOCKED). /worker runs the image pipeline (§5.4: validate, strip metadata, resize, NSFW check, face detect + blur, re-encode, publish, delete raw per D5), ranking recompute, escalation scheduler, notification fan-out, retention. No Vercel cron.
- Face detection: @vladmandic/human or onnxruntime-node; pick by recall on a small test set (D6).
- Maps: MapLibre GL (clustering + heatmap), OpenFreeMap or OSM tiles. Geocoding: Nominatim via cached server proxy (1 req/s, User-Agent). Charts: Recharts. Email: Resend or SMTP.
- Deploy: web on Vercel, worker as Docker image on any free host, Supabase cloud.

## Adapters
SMS/OTP, WhatsApp, email, push, translation, face detector, NSFW, geocoder: each behind an interface with a real impl + a mock; mock is default when env keys are absent. Every outbound message is written to an `outbox` table first (admin Outbox viewer). Auth: Supabase email OTP + Google; phone OTP only if an SMS provider is configured (log as D2 deviation).

## Rules
1. §5 and §6 are non-negotiable: fail closed, no metadata, over-blur rather than miss, escalation idempotent + audited. On conflict, stop and ask.
2. Every (tunable) value lives in packages/core config or DB settings, never in components/handlers.
3. Server enforces §2 roles via RLS + route checks; never trust the client.
4. Strings externalised from day one (D11).
5. Responsive: bottom tab bar <768px, top nav >=1024px; verify 390/768/1440. Keyboard accessible, AA contrast, 44px targets.
6. Ambiguity: use §15 defaults, log in docs/DECISIONS.md, continue.
7. Shell is fish: no `export`, no bash-only syntax.
8. One phase per session. End of phase: typecheck, lint, build, tests pass; update docs/PROGRESS.md; commit "phase N".

## Phases (read only the sections named)
0 Scaffold, tokens from design/, config, adapters, migrations, seed script; PROGRESS.md = one row per feature ID in §4 (priority, phase, status)
1 ACC, roles, RLS, locality/category/authority data (§2, §4.1, §8, §10)
2 RPT + IMG + image worker; §5.8 checklist as automated tests (§4.2, §4.3, §5)
3 FED: feed, map, search, share/OG, sitemap (§4.4)
4 ENG + RNK incl. anti-gaming, karma, badges (§4.5, §4.6, §7)
5 LIF + ESC + NTF: Shadow/Approve/Auto, packet, signed links, follow-ups (§4.7, §4.8, §4.10, §6, §9)
6 MOD + ADM, audit log, flags, kill switches (§4.11, §4.12)
7 PLS + SUP + NFR (§4.9, §4.13, §4.14)
8 SHIP P1: seed 40+ issues, routing tester with 20 issues, §12 acceptance criteria as tests, /demo panel (DEMO_MODE) to fast-forward a lifecycle, README + 2-minute demo script, deploy
9 All P2 rows
10 All P3 rows (minimal but working; note limits in DECISIONS.md)
