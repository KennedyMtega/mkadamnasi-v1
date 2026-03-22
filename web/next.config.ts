import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  // Prisma 7 needs this for Vercel deployment
  serverExternalPackages: ['@prisma/client', 'prisma'],
  // Optimize for Vercel
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
