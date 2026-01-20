/** @type {import('next').NextConfig} */
const nextConfig = {
  // ⚡ PERFORMANCE: Enable React strict mode for better debugging
  reactStrictMode: true,

  // ⚡ PERFORMANCE: Optimize packages bundling
  transpilePackages: ["react-syntax-highlighter"],

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: true,
    // ⚡ PERFORMANCE: Configure remote image domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // ⚡ PERFORMANCE: Compress responses
  compress: true,

  // ⚡ PERFORMANCE: Generate ETags for caching
  generateEtags: true,

  // ⚡ PERFORMANCE: Memory optimization
  onDemandEntries: {
    // Keep pages in memory for 5 minutes
    maxInactiveAge: 5 * 60 * 1000,
    // Keep up to 32 pages in memory
    pagesBufferLength: 32,
  },

  // ⚡ PERFORMANCE: Headers for caching static assets
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
