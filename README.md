# CineSchedule Web (Phase 7)

Thin Next.js frontend that proves the v1 API: login, watchlist, calendar.

## Requirements
- Node 20+
- pnpm 9+
- Backend API running locally on **http://localhost:3000/v1**
- Backend CORS allows `http://localhost:3001`

## Environment
Create `.env.local` at the project root:

```
NEXT_PUBLIC_API_BASE=http://localhost:3000/v1
```

## Run (dev)
```bash
pnpm install
pnpm dev
# Frontend on http://localhost:3001
```

## Auth (Phase 7)
- Access token lives **in memory**.
- Optional **dev persistence**: visit `/login?persist=1` once; token then restores from `sessionStorage` across route changes/HMR.
- Logout clears in-memory token (and session if persistence is on).

## Routes
- `/login` — POST `/auth/login` → sets token → redirects `/watchlist`
- `/watchlist` — GET `/watchlist?limit=5`, add by Title ID, delete
- `/calendar` — GET `/calendar?from&to&limit` (fetch on click)

## Troubleshooting
- **Port clash**: API uses `:3000`, web uses `:3001` (see `package.json`).
- **CORS**: Ensure backend uses `CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://app.cineschedule.com`
  and a regex allow for `https://cineschedule-*.vercel.app` previews.
- **Auth redirects**: If you bounce back to `/login`, use `/login?persist=1` once, then login again.
- **Env changes**: After editing `.env.local`, restart `pnpm dev`.