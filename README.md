# BillFlow

Invoice management for Indonesian freelancers and small businesses.  
Create professional invoices, send them through WhatsApp, and track payments — all from one dashboard.

## Features

- **Invoice CRUD** — Create, view, and manage invoices with line items, tax (PPN), and discount support
- **WhatsApp Sharing** — One-tap invoice delivery via WhatsApp deep link with prefilled message
- **Public Invoice Page** — Shareable `/invoice/[number]` page for customers (no login required)
- **Customer Management** — Store and browse customer contacts with outstanding balance overview
- **Dashboard** — Summary cards (outstanding, paid, overdue) and recent invoice feed
- **Payment Tracking** — Record payments and mark invoices as paid
- **Settings** — Business profile, invoice prefix/numbering, bank/payment details
- **Auth** — Email/password authentication via Supabase Auth
- **Multi-tenant RLS** — Row Level Security with organization-scoped data isolation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI + shadcn/ui pattern |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Charts | Recharts (ready, not yet wired) |
| Font | Geist Sans / Geist Mono |

## Getting Started

```bash
# Install dependencies
npm install

# Create .env.local with your Supabase credentials
cp .env.example .env.local

# Run the Supabase schema (paste supabase/schema.sql in your SQL editor)

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Project Structure

```
src/
├── app/
│   ├── (app)/          # Authenticated pages (dashboard, invoices, customers, etc.)
│   ├── (auth)/         # Login & signup
│   ├── invoice/[number]/ # Public-facing invoice page
│   └── page.tsx        # Landing page
├── components/
│   ├── ui/             # Reusable primitives (button, card, input, etc.)
│   ├── app-sidebar.tsx # Navigation sidebar + mobile bottom nav
│   ├── empty-state.tsx # Empty state placeholder
│   └── invoice-status-badge.tsx
├── lib/
│   ├── supabase/       # Client, server, and middleware helpers
│   ├── types.ts        # Core database types
│   └── utils.ts        # Formatters (Rupiah, date, WhatsApp link)
└── middleware.ts       # Auth guard (redirect unauthenticated users)
```

## License

MIT
