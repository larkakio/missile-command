const path = require("path");

const wagmiConnectorsEsm = path.join(
  __dirname,
  "node_modules/@wagmi/connectors/dist/esm"
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@missile-wagmi/baseAccount": path.join(wagmiConnectorsEsm, "baseAccount.js"),
      "@missile-wagmi/walletConnect": path.join(wagmiConnectorsEsm, "walletConnect.js"),
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      encoding: false,
    };
    config.externals = config.externals || [];
    config.externals.push("pino-pretty", "lokijs");
    return config;
  },
};

module.exports = nextConfig;
