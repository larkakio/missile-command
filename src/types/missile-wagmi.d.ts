/** Webpack resolves these to `@wagmi/connectors` implementation files (see next.config.js). */
declare module "@missile-wagmi/baseAccount" {
  export { baseAccount } from "@wagmi/connectors";
}

declare module "@missile-wagmi/walletConnect" {
  export { walletConnect } from "@wagmi/connectors";
}
