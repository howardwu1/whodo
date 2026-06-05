/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable experimental features for better performance
  experimental: {
    // Enable server actions for better form handling
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Empty turbopack config to silence the warning (Turbopack is default in Next.js 16)
  turbopack: {},
};

// Only configure Sentry if DSN is provided
const shouldConfigureSentry = process.env.SENTRY_DSN && process.env.SENTRY_DSN.length > 0;

let moduleExports = nextConfig;

if (shouldConfigureSentry) {
  const withSentryConfig = require('@sentry/nextjs').withSentryConfig(
    nextConfig,
    {
      suppressUploadGitDelta: true,
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    }
  );
  moduleExports = withSentryConfig;
}

module.exports = moduleExports;
