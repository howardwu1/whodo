# backend-worker Skill

## Role
Implements server-side security features: session management, CSRF validation, rate limiting, API protection, and backend bug fixes.

## Procedure

1. **Setup**
   - Read `{missionDir}/mission.md` for mission overview
   - Read `{missionDir}/architecture.md` for design decisions
   - Read `{missionDir}/AGENTS.md` for constraints
   - Read `{missionDir}/library/environment.md` for env details
   - Run `npx prisma generate` to ensure client is available
   - Run `npm run typecheck` as baseline

2. **Implement Feature**
   - Read relevant source files to understand current implementation
   - Implement the feature following architecture.md patterns
   - Add TypeScript types where missing
   - Keep changes focused on the feature scope

3. **Verify**
   - Run `npm run typecheck` - fix all errors
   - Run `npm run lint` - fix all warnings
   - For backend changes: test API with curl or browser

4. **Commit**
   - Stage relevant files
   - Commit with message: `[feature-id] description`
   - Include `Co-authored-by: factory-droid[bot] <138933559+factory-droid[bot]@users.noreply.github.com>`

## Handoff Fields
Return these in handoff:
- `commitId`: git commit SHA
- `repoPath`: /home/howard/whodo
- `discoveredIssues`: array of issues found (not fixed)
- `whatWasLeftUndone`: array of incomplete work
- `returnToOrchestrator`: true if needs orchestrator attention

## Common Patterns

### Session Cookie Format
```typescript
Set-Cookie: whodo_session=<token>; HttpOnly; Secure; SameSite=Strict; Max-Age=86400
Set-Cookie: whodo_csrf=<secret>; Path=/; Max-Age=86400
```

### Auth Middleware Pattern
```typescript
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/session';

export async function GET() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('whodo_session')?.value;
  const session = await validateSession(sessionToken);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  // proceed with session.userId
}
```

### Rate Limit Pattern
```typescript
import { limitLogin } from '@/lib/rateLimit';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const { allowed, remaining } = limitLogin(ip, username);
  if (!allowed) return Response.json({ error: 'Too many attempts' }, { status: 429 });
  // proceed
}
```
