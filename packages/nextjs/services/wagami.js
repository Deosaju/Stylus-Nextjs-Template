import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import * as chain from "wagmi/chains";
import { defineChain } from 'viem'
 
const stylusTestnet = defineChain({
  id: 23011913,
  name: 'Stylus testnet',
  nativeCurrency: { name: 'Stylus', symbol: 'STS', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://stylus-testnet.arbitrum.io/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://stylus-testnet.arbitrum.io/rpc' },
  },
})
const chains = [
    chain.arbitrum,
    stylusTestnet
  ];

const transports = Object.fromEntries(chains.map((c) => [c.id, http()]));

export const config = getDefaultConfig({
  appName: 'ChainFile',
  projectId: 'dfdc1590811c258843401f7d374e958e',
  chains,
  ssr: true,
  transports,
});

