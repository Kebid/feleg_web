import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ['next-intl']
  },
  webpack: (config, { isServer }) => {
    // Optimize chunk loading
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Create a vendor chunk for next-intl
          nextIntl: {
            name: 'next-intl',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]next-intl[\\/]/,
            priority: 20,
          },
          // Create a vendor chunk for other dependencies
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
          },
        },
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
