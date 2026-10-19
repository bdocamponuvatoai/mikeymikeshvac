import type { NextConfig } from 'next';
import { resolveStage, securityHeaders } from './src/lib/csp';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 828, 1080, 1280, 1536],
    imageSizes: [224, 320, 448],
    qualities: [70, 72, 74, 78],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders(resolveStage()) }];
  },
};

export default nextConfig;
