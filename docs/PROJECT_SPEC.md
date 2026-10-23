# Lava Hub — Phase 0 Project Specification
**Online Workshop Platform**

## 1. Executive Summary
Lava Hub is a modern, mobile-first online workshop platform built to empower youth in Somalia, Somaliland, and the diaspora with free, high-impact practical skills (Web Development, JavaScript, React, AI) through live interactive workshops and community collaboration.

## 2. Brand Identity & Design System
- **Name**: Lava Hub
- **Tagline**: Learn. Collaborate. Rise.
- **Mission**: Free practical workshops and community-driven learning for young tech builders.
- **Color Tokens**:
  - Lava Orange: `#FF5722` (Primary Brand Accent)
  - Deep Slate: `#0F172A` (Header, Primary Text, Dark Theme Background)
  - Tech Cyan: `#0EA5E9` (Secondary Tech Accent)
  - Accessible Link Blue: `#0369A1` (WCAG AA Compliant Text Links)
  - Platinum: `#F8FAFC` (Canvas Background, Neutral Surface)
  - White Cards: `#FFFFFF` (Light Mode Surface)
  - Success: `#10B981` | Warning: `#F59E0B` | Error: `#DC2626`
- **Typography**:
  - Headings: `Montserrat` (weights 500, 600, 700, 800)
  - Body Text: `Inter` (weights 300, 400, 500, 600, 700)
  - Telemetry/Numbers: `JetBrains Mono` / `tabular-nums`
- **Design Philosophy**:
  - 60-30-10 color distribution (60% neutral canvas, 30% structural surface, 10% high-intent accent).
  - Dark text (`#0F172A`) on Lava Orange buttons for accessible contrast.
  - Zero-pill metadata discipline (clean inline text with `·` separators).
  - Fluid responsiveness across 360px, 768px, and 1280px+ viewports.

## 3. Localization & Timezone
- **Default Language**: English (`en`)
- **Secondary Language**: Somali (`so`) with persistent toggle
- **Approved Somali Hero**:
  - Headline: “Bilaash Ku Baro Xirfadaha Mustaqbalka — Wadajir Iyo Iskaashi.”
  - Description: “Lava Hub waa madal furan oo dhalinyarada isku xaysa si ay u wada bartaan, ugu taageeraan workshop-yo bilaash ah.”
- **Display Timezone**: `Africa/Mogadishu` (EAT, UTC+3). All timestamps stored in UTC and converted for presentation.

## 4. Public Architecture & Routes
- `/` — Homepage (Hero, Benefits, How It Works, Upcoming Workshops, Instructors, FAQ, Footer)
- `/workshops` — Workshop Catalog (search, filter by Web Dev, JavaScript, React, AI)
- `/workshops/:slug` — Workshop Details (agenda, prerequisites, instructor, capacity)
- `/workshops/:slug/register` — Guest Registration Form
- `/registration/confirmation` — Registration Status & Next Steps
- `/registration/verify` — Email Verification Entry
- `/registration/cancel` — Token-Authenticated Registration Cancellation
- `/waitlist/accept` — Waiting List Seat Offer Acceptance
- `/feedback/:token` — Private Workshop Feedback Submission
- `/join` — Community Membership Form
- `/join/verify` — Community Verification
- `/join/unsubscribe` — Community Unsubscribe
- `/about` — About Lava Hub Mission & Team
- `/contact` — Contact Form
- `/instructors` — Instructor Directory
- `/instructors/:slug` — Instructor Profile
- `/privacy` — Privacy Policy
- `/terms` — Terms of Service
- `/cancellation-policy` — Cancellation Policy
- `*` — Custom 404 Page

## 5. Protected Admin Architecture & Routes
- `/admins/login` — Administrator Authentication
- `/admins` — Operational Overview Dashboard
- `/admins/workshops` & `/admins/workshops/new` & `/admins/workshops/:id/edit`
- `/admins/registrations` — Attendee Management & Status Filters
- `/admins/waitlist` — FIFO Queue & Offer Management
- `/admins/attendance` — Live Attendance Tracker & CSV Export
- `/admins/instructors` — Instructor Onboarding & Workshop Assignment
- `/admins/emails` — Resend Transactional Delivery Logs
- `/admins/feedback` — Survey Results & Testimonial Approvals
- `/admins/reports` — Capacity & Attendance Analytics
- `/admins/messages` — Contact Form Submissions
- `/admins/community` — Community Member Directory
- `/admins/team` — Admin RBAC & Role Management
- `/admins/settings` — System Defaults & Policies

## 6. Security & Invariants
- Guest registration: zero student passwords or accounts.
- Atomic seat reservation in PostgreSQL prevents overbooking race conditions.
- Private Zoom/Google Meet links never appear in public queries or client bundles.
- CSV exports sanitize formulas (`=`, `+`, `-`, `@`).
- Token hashes only in database with single-use and expiration enforcement.
