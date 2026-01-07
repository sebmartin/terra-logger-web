/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better error detection
  reactStrictMode: true,

  // Turbopack configuration (empty to acknowledge Turbopack is being used)
  turbopack: {},

  // Configure webpack for mapbox-gl
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push({
      'better-sqlite3': 'commonjs better-sqlite3'
    });
    return config;
  },
};

module.exports = nextConfig;
