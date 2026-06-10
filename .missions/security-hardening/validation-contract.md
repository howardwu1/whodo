# Validation Contract

## Session Management

### VAL-SESSION-001: Login creates session with HttpOnly cookie
Login POST with valid credentials creates a Session record in DB and sets `Set-Cookie: whodo_session=<token>; HttpOnly; Secure; SameSite=Strict`
Tool: agent-browser
Evidence: Network tab shows Set-Cookie header with HttpOnly, Secure, SameSite

### VAL-SESSION-002: Register creates session with HttpOnly cookie
Register POST with valid data creates a Session record and sets session cookie
Tool: agent-browser
Evidence: Network tab shows Set-Cookie header with session token

### VAL-SESSION-003: Middleware validates session token for /dashboard
Request to /dashboard with valid session cookie allows access; invalid/expired cookie redirects to /
Tool: agent-browser
Evidence: Screenshot of dashboard access with valid session; screenshot of redirect with invalid cookie

### VAL-SESSION-004: Expired sessions are rejected
Session with past expiresAt is rejected and user is redirected
Tool: agent-browser
Evidence: Manual DB manipulation of expiresAt, then access attempt

### VAL-SESSION-005: Dashboard redirects when no valid session
Access to /dashboard without session cookie redirects to /
Tool: agent-browser
Evidence: Screenshot showing redirect

## CSRF Protection

### VAL-CSRF-001: CSRF cookie set on login/register
Login and register responses set `whodo_csrf` cookie (not HttpOnly, JS-readable)
Tool: agent-browser
Evidence: Network tab shows Set-Cookie for whodo_csrf

### VAL-CSRF-002: Form submits CSRF token header
Login form submits POST with `x-csrf-token` header matching whodo_csrf cookie
Tool: agent-browser
Evidence: Dev tools network tab shows request headers

### VAL-CSRF-003: Server rejects mismatched CSRF token
POST with wrong x-csrf-token returns 403
Tool: agent-browser
Evidence: curl test with manipulated header returns 403

## Rate Limiting

### VAL-RATELIMIT-001: Login blocked after 5 failed attempts in 15 min
6th failed login attempt within 15 minutes returns 429
Tool: agent-browser + curl
Evidence: Script to send 6 wrong passwords, last returns 429

### VAL-RATELIMIT-002: Register blocked after excessive attempts
Excessive registration attempts from same IP returns 429
Tool: curl
Evidence: Script to send multiple registrations, excessive returns 429

## API Route Protection

### VAL-API-001: /api/projects requires valid session
GET /api/projects without session cookie returns 401
Tool: curl
Evidence: curl without cookies returns 401

### VAL-API-002: /api/stories requires valid session
POST /api/stories without session returns 401
Tool: curl
Evidence: curl POST without cookies returns 401

### VAL-API-003: /api/project-members requires valid session
DELETE /api/project-members without session returns 401
Tool: curl
Evidence: curl DELETE without cookies returns 401

## Bug Fixes

### VAL-BUG-001: handleAddMembers uses functional state updates
Rapidly adding 3+ members results in all being added correctly (not just last)
Tool: agent-browser
Evidence: Add 3 members rapidly, all 3 appear in list

### VAL-BUG-002: handleRemoveMember uses functional state updates
Rapidly removing 2+ members results in correct removal
Tool: agent-browser
Evidence: Remove 2 members rapidly, correct ones removed

### VAL-BUG-003: loadStories checks res.ok before json parsing
API error response does not crash - returns error message, not JSON parse error
Tool: agent-browser
Evidence: Force error condition, screenshot shows graceful error not crash

### VAL-BUG-004: PUT/DELETE returns 404 for non-existent resources
PUT or DELETE on non-existent storyId returns 404 (not 500)
Tool: curl
Evidence: curl PUT /api/stories?id=nonexistent returns 404

### VAL-BUG-005: Members page redirects if not logged in
Access to /projects/1/members without session redirects to /
Tool: agent-browser
Evidence: Screenshot showing redirect to home

### VAL-BUG-006: createProject shows error on failure
Failed project creation shows error message to user
Tool: agent-browser
Evidence: Force API failure, screenshot shows error message in UI

### VAL-BUG-007: Empty velocity returns green health
Project with empty velocity[] shows GREEN health (not red)
Tool: agent-browser
Evidence: Dashboard shows green for project with no velocity data

## Cross-Area Flows

### VAL-CROSS-001: Full login flow with session and CSRF
1. User logs in -> session cookie + CSRF cookie set
2. User creates project -> API validates session + CSRF
3. User adds member -> protected route validates session
4. All steps succeed end-to-end
Tool: agent-browser
Evidence: Full flow screenshot from login to member added
