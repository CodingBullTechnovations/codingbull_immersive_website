import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '256kb',
      allowedOrigins: ['codingbullz.com', 'www.codingbullz.com', 'localhost:3000', '127.0.0.1:3000'],
    },
  },
};

export default nextConfig;
