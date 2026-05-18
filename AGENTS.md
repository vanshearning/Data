# AGENTS.md

## Project Overview

A data-selling web app where users earn rupee balance by sharing bandwidth, then withdraw via UPI. Built with TanStack Start and deployed on Netlify.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Database | Netlify Database (Postgres) + Drizzle ORM (beta) |
| Backend | Netlify Functions |
| Deployment | Netlify |

## Directory Structure

```
db/
  schema.ts         # Drizzle ORM table definitions (users, transactions, withdrawals)
  index.ts          # Drizzle client singleton
drizzle.config.ts   # Drizzle Kit config — migrations output to netlify/database/migrations/
netlify/
  functions/
    user.ts         # GET /api/user (get/create user, sync selling), POST /api/user (start/stop selling)
    transactions.ts # GET /api/transactions — list recent transactions for a user
    withdraw.ts     # GET /api/withdraw (history), POST /api/withdraw (submit request)
  database/
    migrations/     # Auto-generated SQL migrations applied by Netlify on deploy
src/
  components/
    AppHeader.tsx   # Top bar with "DATA SELLING" title
    BottomNav.tsx   # Fixed bottom nav: HOME / WALLET / WITHDRAW
  lib/
    api.ts          # Client-side API helpers + useUser hook with 10s polling
  routes/
    __root.tsx      # Root HTML shell
    index.tsx       # Home tab — balance, data sold, start/stop button, transactions
    wallet.tsx      # Wallet tab — balance, data sold, withdrawal history
    withdraw.tsx    # Withdraw tab — form to submit UPI withdrawal
```

## Key Concepts

### User Identity
Users are identified by a UUID stored in `localStorage` under `device_id`. All API calls include `x-device-id` header. No login required.

### Selling Mechanism
- Rate: 1 MB/min → ₹0.20/min
- Tracked server-side: `users.is_selling` + `users.selling_started_at`
- On each `/api/user` GET call, elapsed time is computed and balance/data updated atomically

### Withdrawals
- Minimum ₹50
- Status: `pending` → `approved` / `rejected` (manual admin action, not automated)
- Balance is deducted immediately on submission

### Database Migrations
Always update `db/schema.ts` then run `npx drizzle-kit generate`. Never run DDL manually against the database. Migrations in `netlify/database/migrations/` are applied automatically by Netlify on deploy.

## Conventions
- Tailwind CSS utility classes throughout
- `@/` alias maps to `src/`
- Strict TypeScript with ES2022 target
- Components: PascalCase; utilities/hooks: camelCase
