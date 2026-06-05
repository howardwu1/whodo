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

module.exports = nextConfig;
