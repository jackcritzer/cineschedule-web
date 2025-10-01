# CineSchedule — 60-Second Demo

## Setup

- Open: https://app.cineschedule.com/login
- Test user ready (email + password)
- Confirm API base (Prod): `https://api.cineschedule.com/v1`

## Flow (talk & click)

1) **Login**

   - Enter email/password → Submit
   - *Narrate:* “JWT is stored in memory; if it expires we redirect to login. For this demo I enabled a dev-only session flag so it survives page changes.”
2) **Calendar**

   - Go to **Calendar**
   - Set **From** = today, **Limit** = `10` → **Fetch**
   - *Narrate:* “Calendar merges theatrical/digital/streaming release dates from TMDB nightly.”
3) **Watchlist (list + add + delete)**

   - Go to **Watchlist** → Show current items
   - **Add by Title ID**: paste a known `titleId` and click **Add**
     - (If needed: delete one row to show mutation & refetch)
   - *Narrate:* “These are my saved titles; mutations invalidate the query and refresh.”
4) **Token expiry (optional quick demo)**

   - Open DevTools → Application → Session Storage → set `auth_token` to any junk string
   - Click **Calendar**
   - *Narrate:* “401 with `AUTH_TOKEN_EXPIRED` triggers a global handler → token cleared → redirect to login.”

## Notes

- UI is intentionally thin (Phase 7). Tailwind tokens + shadcn components make it easy to evolve into a retro theater look later.
- Dev persistence is opt-in via `/login?persist=1` to smooth Next.js HMR during demos; prod remains memory-only.
