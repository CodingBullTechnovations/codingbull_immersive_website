import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  images: {
    qualities: [60, 75, 90],
  },
  async redirects() {
    return [
      {
        source: '/blog',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/insights',
        statusCode: 301,
      },
      {
        source: '/privacy-policy',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/privacy',
        statusCode: 301,
      },
      {
        source: '/cookie-policy',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/privacy',
        statusCode: 301,
      },
      {
        source: '/our-projects',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/case-studies',
        statusCode: 301,
      },
      {
        source: '/projects',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/case-studies',
        statusCode: 301,
      },
      {
        source: '/contact-us',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/contact',
        statusCode: 301,
      },
      {
        source: '/healthcare-software-development',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/services/healthcare-software-development',
        statusCode: 301,
      },
      {
        source: '/ecommerce-development',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/services/ecommerce-development',
        statusCode: 301,
      },
      {
        source: '/custom-hrms-payroll-software',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/services/custom-hrms-payroll-software',
        statusCode: 301,
      },
      {
        source: '/custom-crm-appointment-software',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/services/custom-business-systems',
        statusCode: 301,
      },
      {
        source: '/services/ui-ux-design',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/services',
        statusCode: 301,
      },
      {
        source: '/services/web-development',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/services',
        statusCode: 301,
      },
      {
        source: '/services/mobile-app-development',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/services',
        statusCode: 301,
      },
      {
        source: '/services/ai-machine-learning',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/services/custom-business-systems',
        statusCode: 301,
      },
      {
        source: '/services/cloud-solutions',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/services/custom-business-systems',
        statusCode: 301,
      },
      {
        source: '/services/cybersecurity',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/services/custom-business-systems',
        statusCode: 301,
      },
      {
        source: '/services/digital-marketing',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/services',
        statusCode: 301,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'codingbullz.com' }],
        destination: 'https://www.codingbullz.com/:path*',
        statusCode: 301,
      },
      {
        source: '/healthcare-software-development',
        destination: '/services/healthcare-software-development',
        statusCode: 301,
      },
      {
        source: '/ecommerce-development',
        destination: '/services/ecommerce-development',
        statusCode: 301,
      },
      {
        source: '/custom-hrms-payroll-software',
        destination: '/services/custom-hrms-payroll-software',
        statusCode: 301,
      },
      {
        source: '/custom-crm-appointment-software',
        destination: '/services/custom-business-systems',
        statusCode: 301,
      },
      {
        source: '/services/ui-ux-design',
        destination: '/services',
        statusCode: 301,
      },
      {
        source: '/services/web-development',
        destination: '/services',
        statusCode: 301,
      },
      {
        source: '/services/mobile-app-development',
        destination: '/services',
        statusCode: 301,
      },
      {
        source: '/services/ai-machine-learning',
        destination: '/services/custom-business-systems',
        statusCode: 301,
      },
      {
        source: '/services/cloud-solutions',
        destination: '/services/custom-business-systems',
        statusCode: 301,
      },
      {
        source: '/services/cybersecurity',
        destination: '/services/custom-business-systems',
        statusCode: 301,
      },
      {
        source: '/services/digital-marketing',
        destination: '/services',
        statusCode: 301,
      },
      {
        source: '/blog',
        destination: '/insights',
        statusCode: 301,
      },
      {
        source: '/our-projects',
        destination: '/case-studies',
        statusCode: 301,
      },
      {
        source: '/projects',
        destination: '/case-studies',
        statusCode: 301,
      },
      {
        source: '/privacy-policy',
        destination: '/privacy',
        statusCode: 301,
      },
      {
        source: '/cookie-policy',
        destination: '/privacy',
        statusCode: 301,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        statusCode: 301,
      },
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
