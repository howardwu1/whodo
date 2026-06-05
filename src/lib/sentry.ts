// Simple Sentry browser integration for Next.js 16
// Works with any Sentry DSN without needing @sentry/nextjs

import * as Sentry from '@sentry/browser';

let isInitialized = false;

export function initSentry() {
  if (isInitialized || typeof window === 'undefined') return;

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
  });

  isInitialized = true;
}

export function captureException(error: Error, context?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  
  if (!isInitialized) {
    initSentry();
  }
  
  Sentry.captureException(error, { extra: context });
}

export default { initSentry, captureException };
