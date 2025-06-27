/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  // Disable SSR for pages that use Web3
  experimental: {
    // This helps with hydration issues
    esmExternals: true,
  },
  // Handle Web3 libraries that don't support SSR
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'ethers': 'commonjs ethers',
        'web3': 'commonjs web3',
      });
    }
    return config;
  },
};

module.exports = nextConfig;
