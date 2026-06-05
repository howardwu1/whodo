# WhoDo

Project management and billing app built with Next.js 16, React 19, and MUI.

## Getting Started

```bash
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |
| `npm test` | Run Jest tests |
| `npm run test:e2e` | Run Playwright E2E tests |

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, MUI 5, Emotion
- **Database:** PostgreSQL with Prisma ORM
- **Error Tracking:** Sentry
- **Testing:** Jest + React Testing Library, Playwright
- **Deployment:** Vercel

## Database Setup

1. Create a PostgreSQL database (e.g., [Neon](https://neon.tech))
2. Add connection URL to `.env` as `DATABASE_URL`
3. Run migrations:

```bash
npm run db:push
npm run db:generate
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN for browser error tracking |

Set these in Vercel dashboard for production deployment.
