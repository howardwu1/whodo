# Security Hardening: Auth, CSRF, Rate Limiting & Bug Fixes

## Plan Overview

Harden the WhoDo application security by implementing proper session management, CSRF protection, rate limiting, and fixing critical bugs found in the code review.

**Current state**: Auth is purely client-side. The `whodo_username` cookie is set via `document.cookie` (cannot be HttpOnly), contains plaintext username, and is validated only by presence. All API routes except login/register are completely unprotected.

## Expected Functionality

### Milestone 1: Session Management
- Add `Session` model in Prisma (id, userId, token, expiresAt)
- Modify login/register to create server-side session with HttpOnly Secure SameSite=Strict cookie
- Update registry to read session from server-side cookie
- Protect API routes with session validation

### Milestone 2: CSRF Protection
- Generate CSRF secret on session creation
- Set `whodo_csrf` cookie (JS-readable, not HttpOnly)
- Include CSRF token in forms, validate server-side

### Milestone 3: Rate Limiting
- In-memory rate limiter on login/register
- 5 failed login attempts per IP per 15 minutes

### Milestone 4: API Route Protection
- Session validation on all protected API routes (projects, stories, project-members)
- Return 401 if invalid/missing session

### Milestone 5: Bug Fixes
- Race conditions in members page (functional state updates)
- API error handling (res.ok check, 404 vs 500)
- Data correctness (invalid date, userId foreign key, empty velocity health)
- UX improvements (auth check on members page, createProject failure feedback)

## Environment Setup

```bash
npm install
npx prisma generate
```

No new external services. Sessions stored in existing Postgres via Prisma.

## Infrastructure

**Existing services:**
- Postgres on localhost:5432
- App runs on port 3000 (Next.js dev server)

**Off-limits:**
- Redis on 6379 (other project)
- Ports 3001+ (user's other services)

## Testing Strategy

**Programmatic validation** (per milestone gate):
- `npm run typecheck` - full type check
- `npm run lint` - lint
- `npm run test` - unit tests if they exist

**User testing** (end-of-mission):
- agent-browser: test login/register with CSRF tokens
- agent-browser: test rate limiting behavior  
- agent-browser: test that protected API routes reject unauthenticated requests
- agent-browser: test race condition fixes by rapidly adding/removing members
- Verify dashboard auth redirect works

## Non-Functional Requirements

- Session tokens must be cryptographically random (UUID v4)
- Cookies must have `HttpOnly; Secure; SameSite=Strict`
- CSRF tokens must be unique per session
- Rate limiting: 5 failed login attempts per IP per 15 minutes
- All API mutations require valid session
