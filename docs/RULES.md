# Lava Hub — Engineering Constitution & Rules

## 1. Security Invariants
1. **Never Expose Private Meeting Links**: Private Zoom or Google Meet URLs must never be returned in public endpoints, public database views, or client bundles. They are provided solely to verified attendees via transactional email or token-authenticated confirmation pages.
2. **Never Expose Server Secrets**: Supabase service-role keys, Resend API keys, and sensitive environment variables belong on the server side only. Client code must only access `VITE_SUPABASE_ANON_KEY`.
3. **Atomic Seat Allocation**: Seat calculations must occur within database transactions or transactional RPC functions with row-level locks. Two simultaneous requests for the last seat must result in exactly 1 confirmed registration and 1 waitlisted registration.
4. **Token Security**: Tokens for email verification, cancellation, waitlist offers, and feedback must be cryptographically random (or signed), time-limited, single-use, and stored as hashes.
5. **CSV Formula Injection Neutralization**: Any exported CSV cell that starts with `=`, `+`, `-`, or `@` must be prepended with a single quote (`'`) or sanitized to protect against spreadsheet formula injection.
6. **Default-Deny Authorization**: Public visitors have no access to admin tables or attendee personal identifying information. Admin routes require verified admin session and RBAC checks.

## 2. Design System & Frontend Discipline
1. **60-30-10 Rule**: 60% neutral canvas, 30% structural surfaces, 10% high-intent accent (`#FF5722` / `#0EA5E9`).
2. **Accessible Contrast**: Primary CTA buttons with Lava Orange background (`#FF5722`) must use dark text (`#0F172A`) to achieve WCAG AA contrast compliance.
3. **Zero-Pill Metadata**: Do not wrap informational metadata (dates, categories, read times) in colored pill boxes. Use clean, unboxed text separated by subtle bullets (`·`).
4. **Touch & Viewport Compliance**: Minimum interactive touch target is 44px on mobile and 40px on desktop. Test across 360px, 768px, and 1280px+ viewports without horizontal scroll.
5. **No Hallucinated Clutter**: No fake system telemetry, no arbitrary innovation scores, no ornamental code comment headers (`// 01_CORE`).

## 3. Localization & Timezone Rules
1. **Source of Truth**: All timestamps are persisted in UTC ISO format.
2. **Presentation Timezone**: Default display timezone is `Africa/Mogadishu` (EAT, UTC+3) formatted clearly (e.g., `Saturday, 25 October 2026, 4:00 PM EAT`).
3. **Bilingual UI**: All user-facing strings must pass through the `useT()` localization hook with English (`en`) and Somali (`so`) coverage.

## 4. Milestone Governance
1. Follow the strict 7-step process: Read -> Plan -> Implement -> Test -> Report -> Document -> Stop.
2. Never move to the next milestone without explicit approval.
3. Verify all code changes with unit tests and app compilation before completing a turn.
