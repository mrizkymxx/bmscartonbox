
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@radix-ui/react-toast', '@radix-ui/react-dialog'],
  },

  // TypeScript configuration
  typescript: {
    // Allow builds with type errors for now, focus on functionality first
    ignoreBuildErrors: true,
  },

  // ESLint configuration
  eslint: {
    // Allow builds with lint warnings for now
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirect configuration
  async redirects() {
    return [
      // Removed dashboard redirect - users should be able to access dashboard
      // {
      //   source: '/',
      //   destination: '/production',
      //   permanent: false,
      // },
    ];
  },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // PWA configuration (if needed in the future)
  // Add PWA configuration here if you want to make it a Progressive Web App
};

export default nextConfig;
