# Security Hardening Architecture

## Current Auth Flow (Before)

```
Login/Register page → POST /api/auth/*
                                          ↓
                              setUsername(result.username)
                                          ↓
                     localStorage + document.cookie written
                                          ↓
                    Next request to /dashboard
                              ↓
                    Middleware checks cookie → passes (presence only!)
                              ↓
                    Dashboard reads context → renders
```

**Vulnerabilities:**
- No server-side session validation
- Cookie is plaintext username, forgeable
- No HttpOnly (set via document.cookie)
- No CSRF protection
- No rate limiting
- All API routes unprotected

## New Auth Flow (After)

```
Login/Register page → POST /api/auth/*
                                          ↓
                              bcrypt validation + session creation
                                          ↓
                     Set-Cookie: whodo_session=<UUID>; HttpOnly; Secure; SameSite=Strict
                     Set-Cookie: whodo_csrf=<secret>; Path=/ (not HttpOnly)
                                          ↓
                    Next request to /dashboard
                              ↓
                    Middleware validates session token in DB
                              ↓
                    Dashboard reads validated session → renders
```

## Components

### 1. Session Model (Prisma)

```prisma
model Session {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

### 2. Session Utility (`src/lib/session.ts`)

- `createSession(userId)` - generates UUID token, creates DB record, sets cookies
- `validateSession(token)` - looks up token, checks expiry, returns userId or null
- `deleteSession(token)` - removes session from DB
- `cleanupExpiredSessions()` - runs on login to purge old sessions

### 3. Auth Middleware

- Reads `whodo_session` cookie
- Calls `validateSession(token)`
- Returns 401 if invalid/missing
- Sets `X-User-Id` header for downstream handlers

### 4. CSRF Protection

- `generateCsrfToken(sessionToken)` - creates secret
- CSRF secret stored in session record
- `whodo_csrf` cookie set alongside session cookie
- Forms read `whodo_csrf` cookie and send as `x-csrf-token` header
- Server validates `x-csrf-token` matches session's stored secret

### 5. Rate Limiter (`src/lib/rateLimit.ts`)

In-memory Map with sliding window:
- Key: IP + username (for login) or IP (for register)
- Value: array of timestamps
- Check: count timestamps in last 15 minutes > 5 = blocked

## Data Flows

### Login Flow
1. User submits form with username/password
2. Server validates credentials against bcrypt hash
3. Server creates Session record in DB
4. Server sets `Set-Cookie: whodo_session=<token>; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
5. Server sets `Set-Cookie: whodo_csrf=<secret>; Path=/; Max-Age=86400`
6. Client navigates to dashboard

### API Request Flow (Protected Routes)
1. Request includes `whodo_session` cookie
2. Middleware extracts cookie, calls `validateSession()`
3. If invalid: return 401
4. If valid: set `X-User-Id` header, call handler

### CSRF Validation Flow
1. Session creation generates CSRF secret, stored in DB
2. `whodo_csrf` cookie set (JS-readable for form reading)
3. Form POST includes `x-csrf-token` header with cookie value
4. Server compares header value against stored secret
5. Mismatch: return 403

## File Changes

### New Files
- `src/lib/session.ts` - session management utilities
- `src/lib/rateLimit.ts` - rate limiting utility
- `prisma/migrations/xxx_add_session` - migration for Session model

### Modified Files
- `prisma/schema.prisma` - add Session model
- `src/app/api/auth/login/route.ts` - create session, set cookies, rate limit
- `src/app/api/auth/register/route.ts` - create session, set cookies, rate limit
- `src/lib/registry.tsx` - read session from server-side cookie
- `src/middleware.ts` - validate session token for /dashboard
- `src/app/api/projects/route.ts` - add auth middleware
- `src/app/api/stories/route.ts` - add auth middleware
- `src/app/api/project-members/route.ts` - add auth middleware
- `src/app/projects/[projectId]/members/page.tsx` - fix race conditions, add auth check
- `src/app/projects/[projectId]/page.tsx` - fix res.ok check, invalid date, order persistence
- `src/app/dashboard/page.tsx` - fix empty velocity health color, createProject failure feedback

## Security Properties

| Property | Implementation |
|----------|---------------|
| Session confidentiality | HttpOnly cookie, UUID token (not username) |
| Session integrity | SameSite=Strict prevents cross-site sending |
| Transport security | Secure flag (HTTPS only) |
| CSRF prevention | Double-submit cookie with server-side validation |
| Brute force protection | Rate limiting: 5 attempts per 15 min per IP |
| Session expiry | 24h max-age, server validates expiresAt |
| Server-side validation | All protected routes validate session in DB |
