# Environment

## Required Environment Variables

No additional environment variables required. The mission uses the existing Next.js + Prisma + Postgres stack.

## Dependencies

- **bcryptjs** (^2.4.3) - password hashing
- **uuid** (^9.0.0) - session token generation
- **@prisma/client** - database ORM

## Database

- **Postgres** on localhost:5432
- Existing database: `whodo` (whodo_dev in DATABASE_URL)
- Schema defined in `prisma/schema.prisma`

## Package Scripts

- `npm run typecheck` - TypeScript compilation check
- `npm run lint` - ESLint
- `npm run test` - Jest tests (if any exist)
- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev` - Run migrations
