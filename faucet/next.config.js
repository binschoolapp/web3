/**
 * @type {import('next').NextConfig}
 */

const { createProxyMiddleware } = require('http-proxy-middleware');


const nextConfig = {
  env: {
  },
  // distDir: 'dist',
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.optimization.splitChunks = {
  //       cacheGroups: {
  //         react: {
  //           test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
  //           name: 'react',
  //           chunks: 'all',
  //         },
  //       },
  //     };
  //   }
  //   return config;
  // },

  async rewrites() {
    return [
      {
        source: '/faucet/api/claim',
        destination: 'https://binschool.app/faucet/api/claim',
      },
    ];
  },
}

module.exports = nextConfig