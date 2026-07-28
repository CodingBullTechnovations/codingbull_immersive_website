import type { NextConfig } from "next";
import legacyRedirects from './src/config/legacy-redirects.json';

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Pin the workspace root. The repo root holds a convenience package.json for
  // `npm run dev`; without this pin Turbopack can infer the wrong root and fail
  // to resolve tailwindcss. Dependencies stay installed in website/ only.
  turbopack: {
    root: __dirname,
  },
  // One canonical URL form. Explicit (not defaulted) so nobody can silently
  // introduce /about/ duplicates of /about. Matches canonicalUrl() in lib/seo.ts.
  trailingSlash: false,
  images: {
    qualities: [60, 75, 90],
  },
  async redirects() {
    const oldRoutes = Object.entries(legacyRedirects);

    return [
      ...oldRoutes.map(([source, destination]) => ({
        source,
        has: [{ type: 'host' as const, value: 'codingbullz.com' }],
        destination: `https://www.codingbullz.com${destination}`,
        statusCode: 301 as const,
      })),
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/:path*',
        statusCode: 301,
      },
      ...oldRoutes.map(([source, destination]) => ({
        source,
        destination,
        statusCode: 301 as const,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: '/service-worker.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isProduction ? '' : " 'unsafe-eval'"} https://www.googletagmanager.com https://www.google-analytics.com`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",
              "frame-src 'self' https://www.instagram.com https://www.linkedin.com https://www.google.com https://maps.google.com https://www.youtube.com https://www.facebook.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '256kb',
      allowedOrigins: ['codingbullz.com', 'www.codingbullz.com', 'localhost:3000', '127.0.0.1:3000'],
    },
  },
};

export default nextConfig;
