# User Testing

## Testing Surface

The security hardening mission requires testing:
1. Login/register flows with session cookies
2. CSRF token submission in forms
3. Rate limiting behavior on auth endpoints
4. Protected API route rejection (401)
5. Dashboard redirect on invalid session
6. Race conditions in members page
7. Error handling (404 vs 500)
8. Empty velocity health color

## Required Testing Tools

- **agent-browser**: For UI testing (login, dashboard, members page)
- **curl**: For API testing (401/403/404/429 responses)

## Resource Cost Classification

| Assertion Group | Tool | Time Estimate |
|-----------------|------|---------------|
| Session cookies | agent-browser | 10 min |
| CSRF tokens | agent-browser + curl | 10 min |
| Rate limiting | curl script | 5 min |
| API protection | curl | 5 min |
| Race conditions | agent-browser | 5 min |
| Bug fixes | agent-browser | 10 min |

## Test Data

- Register new user at /register for testing
- Use test user: `testsecurity1` / `password123`
- For race condition testing: create test project, add members rapidly

## Environment

- App runs on: http://localhost:3000
- API base: http://localhost:3000/api
- No special credentials needed beyond normal registration
