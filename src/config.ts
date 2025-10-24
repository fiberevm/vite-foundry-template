import { createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain, webSocket } from "viem";

// Define Fiber EVM Testnet
export const fiberTestnet = defineChain({
  id: 100020,
  name: "Fiber EVM Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "FBR",
    symbol: "FBR",
  },
  rpcUrls: {
    default: {
      http: ["http://18.222.111.101:8545"],
      webSocket: ["ws://18.222.111.101:8546"],
    },
  },
  blockExplorers: {
    default: {
      name: "Fiberscan",
      url: "http://scan.fiber.so/",
    },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [fiberTestnet],
  connectors: [injected()],
  transports: {
    [fiberTestnet.id]: webSocket(),
  },
});
