import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable compression for better performance
  compress: true,

  // Optimize images
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Optimize bundle
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: -10,
            chunks: "all",
            enforce: true,
          },
          // Separate chunk for large libraries
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "react",
            chunks: "all",
            priority: 20,
          },
          prisma: {
            test: /[\\/]node_modules[\\/](@prisma|prisma)[\\/]/,
            name: "prisma",
            chunks: "all",
            priority: 15,
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|@tanstack)[\\/]/,
            name: "ui",
            chunks: "all",
            priority: 10,
          },
        },
      };
    }

    // Optimize imports
    config.resolve.alias = {
      ...config.resolve.alias,
      // Reduce bundle size by aliasing to lighter variants
      "date-fns": "date-fns/esm",
    };

    return config;
  },

  // Server external packages (moved from experimental.serverComponentsExternalPackages)
  serverExternalPackages: ["prisma", "@prisma/client"],

  // Enable experimental features for better performance
  experimental: {
    // Optimize CSS
    optimizeCss: true,

    // Optimize package imports to reduce bundle size
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
      "date-fns",
      "clsx",
      "class-variance-authority",
    ],

    // Enable static generation optimizations
    optimizeServerReact: true,
  },

  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Enable output file tracing for deployment optimization
  output: "standalone",

  // Optimize headers for caching
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
    ];
  },

  // Optimize rewrites for better SEO and performance
  async rewrites() {
    return [
      {
        source: "/dashboard/:path*",
        destination: "/dashboard/:path*",
      },
    ];
  },

  // Power optimization settings
  poweredByHeader: false,

  // Optimize TypeScript checking
  typescript: {
    // Only run type checking in development
    ignoreBuildErrors: false,
  },

  // Optimize ESLint
  eslint: {
    // Only run ESLint in development
    ignoreDuringBuilds: false,
  },

  // Environment variables optimization
  env: {
    CUSTOM_KEY: process.env.NODE_ENV,
  },
};

export default nextConfig;
