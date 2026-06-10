# frontend-worker Skill

## Role
Implements client-side changes: registry updates, pages with auth checks, race condition fixes, and UI bug fixes.

## Procedure

1. **Setup**
   - Read `{missionDir}/mission.md` for mission overview
   - Read `{missionDir}/architecture.md` for design decisions
   - Read `{missionDir}/AGENTS.md` for constraints
   - Run `npm run typecheck` as baseline

2. **Implement Feature**
   - Read relevant source files to understand current implementation
   - Implement the feature following architecture.md patterns
   - Add TypeScript types where missing
   - Keep changes focused on the feature scope

3. **Verify**
   - Run `npm run typecheck` - fix all errors
   - Run `npm run lint` - fix all warnings

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

### Functional State Update (Race Condition Fix)
```typescript
// BEFORE (race condition):
const handleAdd = async () => {
  const newMember = await addMember();
  setMembers([...members, newMember]); // stale closure bug
};

// AFTER (correct):
const handleAdd = async () => {
  const newMember = await addMember();
  setMembers(prev => [...prev, newMember]); // functional update
};
```

### Auth Check Pattern
```typescript
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function MembersPage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('whodo_session')?.value;
  const session = await validateSession(sessionToken);
  if (!session) redirect('/');
  // render page with session.userId
}
```

### Empty State Check (Health Color)
```typescript
const getHealthColor = (velocity: number[]) => {
  if (velocity.length === 0) return 'green'; // empty is healthy
  const avg = velocity.reduce((a, b) => a + b, 0) / velocity.length;
  return avg < 0 ? 'red' : avg < 3 ? 'yellow' : 'green';
};
```
