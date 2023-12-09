/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  env: {
  },
  distDir: 'dist',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        cacheGroups: {
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
}

module.exports = nextConfig