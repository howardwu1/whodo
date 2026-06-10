# Security Hardening Mission - Agent Guidance

## Mission Boundaries (NEVER VIOLATE)

**Port Range:** 3000 only. Do not start services on other ports.

**External Services:**
- USE existing postgres on localhost:5432 (do not start a new database)
- DO NOT touch redis on 6379 (belongs to other project)

**Off-Limits:**
- `/data` directory - do not read or modify
- Port 3001+ - user's other services

Workers: If you cannot complete your work within these boundaries, return to orchestrator. Never violate boundaries.

## Mission Directives

**Tools:**
- TypeScript compiler: `npm run typecheck`
- Linter: `npm run lint`
- Test runner: `npm run test`
- Prisma: `npx prisma`

**Skills:**
- All workers must invoke `mission-worker-base` at session start
- backend-worker skill for server-side changes (session, CSRF, rate limiting, API routes, bug fixes)
- frontend-worker skill for client-side changes (registry, pages, components)

**Dependencies:**
- bcryptjs (already installed) - for password hashing
- uuid (already installed) - for session token generation
- Prisma - for database operations

**Other rules:**
- Session tokens MUST be UUID v4
- Cookies MUST have `HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
- CSRF cookie should NOT be HttpOnly (needs to be readable by JS)
- All protected API routes must validate session before processing
- Race condition fixes MUST use functional state updates (`setState(prev => ...)`)

## Testing & Validation Guidance

**TypeScript check is mandatory before committing** - run `npm run typecheck` and fix all errors.

**Linting is mandatory** - run `npm run lint` and fix all errors/warnings.

**User testing** - Each milestone gate includes agent-browser validation of security assertions.

## Known Context

- Project root: `/home/howard/whodo`
- Prisma schema: `prisma/schema.prisma`
- Existing auth endpoints: `src/app/api/auth/login/route.ts`, `src/app/api/auth/register/route.ts`
- Registry: `src/lib/registry.tsx`
- Middleware: `src/middleware.ts`
- Members page (race conditions): `src/app/projects/[projectId]/members/page.tsx`
- Project page (res.ok bug): `src/app/projects/[projectId]/page.tsx`
- Dashboard (empty velocity): `src/app/dashboard/page.tsx`
