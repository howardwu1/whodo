/**
 * Rate limiting utilities for authentication endpoints.
 * 
 * In-memory sliding window rate limiter:
 * - Track failed attempts per IP per username (login) or per IP (register)
 * - 5 failed attempts per IP per 15 minutes
 * 
 * Usage pattern:
 * - For login: call checkLoginLimit(ip, username) to check, and recordFailedLogin(ip, username) on auth failure
 * - For register: call checkRegisterLimit(ip) to check, and recordFailedRegister(ip) on registration failure
 */

// Constants for rate limiting
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// In-memory storage for login attempts: Map<ip:username, timestamp[]>
const loginAttempts = new Map<string, number[]>();

// In-memory storage for registration attempts: Map<ip, timestamp[]>
const registerAttempts = new Map<string, number[]>();

/**
 * Gets valid attempts within the sliding window, cleaning up expired ones.
 * Removes the key from the map if no valid attempts remain.
 */
function getValidAttempts(key: string, attemptMap: Map<string, number[]>): number[] {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const existingAttempts = attemptMap.get(key) || [];
  const validAttempts = existingAttempts.filter(ts => ts > windowStart);
  
  if (validAttempts.length === 0) {
    attemptMap.delete(key);
  } else {
    attemptMap.set(key, validAttempts);
  }
  
  return validAttempts;
}

/**
 * Checks if a login attempt should be allowed based on rate limits.
 * Does NOT record the attempt - use recordFailedLogin after auth failure.
 * 
 * @param ip - The IP address of the requester
 * @param username - The username being attempted
 * @returns Object with `allowed` boolean and `remaining` attempts count
 */
export function checkLoginLimit(ip: string, username: string): { allowed: boolean; remaining: number } {
  const key = `${ip}:${username}`;
  const validAttempts = getValidAttempts(key, loginAttempts);
  
  if (validAttempts.length >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }
  
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - validAttempts.length,
  };
}

/**
 * Records a failed login attempt after authentication failure.
 * 
 * @param ip - The IP address of the requester
 * @param username - The username that failed
 */
export function recordFailedLogin(ip: string, username: string): void {
  const key = `${ip}:${username}`;
  const validAttempts = getValidAttempts(key, loginAttempts);
  
  // Add the new failed attempt timestamp
  loginAttempts.set(key, [...validAttempts, Date.now()]);
}

/**
 * Checks if a registration attempt should be allowed based on rate limits.
 * Does NOT record the attempt - use recordFailedRegister after registration failure.
 * 
 * @param ip - The IP address of the requester
 * @returns Object with `allowed` boolean and `remaining` attempts count
 */
export function checkRegisterLimit(ip: string): { allowed: boolean; remaining: number } {
  const validAttempts = getValidAttempts(ip, registerAttempts);
  
  if (validAttempts.length >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }
  
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - validAttempts.length,
  };
}

/**
 * Records a failed registration attempt after registration failure.
 * 
 * @param ip - The IP address of the requester
 */
export function recordFailedRegister(ip: string): void {
  const validAttempts = getValidAttempts(ip, registerAttempts);
  
  // Add the new failed attempt timestamp
  registerAttempts.set(ip, [...validAttempts, Date.now()]);
}

/**
 * @deprecated Use checkLoginLimit instead. This function is kept for backward compatibility.
 * Checks and records login attempt in one call.
 */
export function limitLogin(ip: string, username: string): { allowed: boolean; remaining: number } {
  const result = checkLoginLimit(ip, username);
  // For backward compatibility, also record the attempt
  if (result.allowed) {
    recordFailedLogin(ip, username);
  }
  return result;
}

/**
 * @deprecated Use checkRegisterLimit instead. This function is kept for backward compatibility.
 * Checks and records registration attempt in one call.
 */
export function limitRegister(ip: string): { allowed: boolean; remaining: number } {
  const result = checkRegisterLimit(ip);
  // For backward compatibility, also record the attempt
  if (result.allowed) {
    recordFailedRegister(ip);
  }
  return result;
}
