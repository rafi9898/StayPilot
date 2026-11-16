# StayPilot

A hotel booking demo application built for the **AI for QA** course. The project is designed for learning test automation with Codex and Playwright.

## Tech stack

- React 19 and TypeScript
- Vinext and Vite
- API routes
- Cloudflare D1 and Drizzle ORM
- Cloudflare Workers

## Features

- Hotel search and filtering
- Booking form with server-side validation
- Booking lookup by email address
- Administrator dashboard
- Booking status management
- Test data reset
- Stable `data-testid` selectors for Playwright

## Getting started

Node.js `>=22.13.0` is required.

```bash
npm ci
npm run db:generate
npm run build
```

Apply the migration to the local D1 database:

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_woozy_leader.sql
```

Start the application:

```bash
npm start
```

The project uses `.openai/hosting.json` when it is available. If a manual copy
does not include hidden files, the local build automatically falls back to the
`DB` D1 binding and remains fully functional for development and testing.

## Administrator dashboard

- Demo password: `admin123`
- API endpoint: `/api/bookings`

The password is intentionally included in the source because this is a training environment, not a production application.

## Suggested Playwright scenarios

1. Search for a hotel by city.
2. Create a valid booking.
3. Validate an invalid email address or date range.
4. Look up a booking by email address.
5. Sign in to the administrator dashboard.
6. Change a booking status.
7. Filter bookings by status.
8. Reset the test data.
