# CineSchedule Web

Next.js frontend for **CineSchedule**, an application for tracking upcoming movie and television release dates.

Users can sign in, manage a personal watchlist, and view upcoming theatrical, digital, streaming, and episode releases through the CineSchedule API.

## Features

- User login and authenticated routes
- Personal watchlist management
- Add and remove titles
- Calendar view for upcoming release events
- API data fetching with TanStack Query
- Runtime validation with Zod
- Responsive interface built with Next.js and Tailwind CSS

## Tech stack

- Next.js 15
- React 19
- TypeScript
- TanStack Query
- Zod
- Tailwind CSS
- Sonner

## Related repository

The backend API, authentication, database, TMDB synchronization, and deployment configuration live in:

[github.com/jackcritzer/cineschedule](https://github.com/jackcritzer/cineschedule)

## Local development

### Requirements

- Node.js 20+
- pnpm 9+
- CineSchedule API running locally on `http://localhost:3000/v1`

### Setup

```bash
git clone https://github.com/jackcritzer/cineschedule-web.git
cd cineschedule-web
pnpm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE=http://localhost:3000/v1
```

Start the development server:

```bash
pnpm dev
```

The app runs on `http://localhost:3001`.

## Routes

- `/login` — authenticate and begin a session
- `/watchlist` — view, add, and remove saved titles
- `/calendar` — query upcoming release events by date range

## Authentication

Access tokens are held in memory by default. Optional development persistence can be enabled with `/login?persist=1`, which stores the token in `sessionStorage` across route changes and hot reloads.

## Current status

The frontend supports the main CineSchedule workflow and is being refined toward a polished public release.
