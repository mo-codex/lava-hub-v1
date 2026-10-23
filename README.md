# Lava Hub — Online Workshop Platform
> **Learn. Collaborate. Rise.**

Lava Hub is an online workshop platform built to help young people in Somalia, Somaliland, and the diaspora acquire in-demand practical skills (Web Development, JavaScript, React, AI) through free live online workshops and collaborative community learning.

---

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React, Motion
- **Routing**: React Router
- **Forms & Validation**: React Hook Form, Zod
- **Backend & Database**: Supabase PostgreSQL (Row Level Security, Edge Functions)
- **Authentication**: Supabase Auth (Administrators only; participants use guest flow)
- **Transactional Email**: Resend
- **Testing**: Node test runner (`node:test`, `tsx`), Playwright

---

## Design System Tokens
- **Lava Orange**: `#FF5722` (High-intent brand accent)
- **Deep Slate**: `#0F172A` (Navigation & dark canvas)
- **Tech Cyan**: `#0EA5E9` (Secondary tech accent)
- **Accessible Link Blue**: `#0369A1` (WCAG AA links)
- **Platinum**: `#F8FAFC` (Canvas background)
- **Typography**: Montserrat (Headings), Inter (Body), JetBrains Mono (Numbers/Metrics)

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npm test

# Build for production
npm run build
```

---

## Project Structure
```text
/
├── docs/                 # Authoritative specifications and progress logs
├── src/
│   ├── components/       # Reusable UI & Layout components
│   ├── features/         # Workshops, Registrations, Attendance, Instructors
│   ├── pages/            # Public & Admin page views
│   ├── routes/           # React Router route tree
│   ├── lib/              # Pure utilities & helpers
│   ├── hooks/            # Custom React hooks
│   ├── i18n/             # English and Somali localization dictionaries
│   └── styles/           # Global styles and design tokens
└── supabase/             # Migrations, functions, and seed data (Phase 2)
```
