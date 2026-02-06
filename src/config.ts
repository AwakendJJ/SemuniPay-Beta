import { createConfig, http, createStorage  } from 'wagmi'
import { base } from 'wagmi/chains'
import { getDefaultConfig } from "connectkit";

// Maintenance mode flag - can be toggled via environment variable
export const MAINTENANCE_MODE_ENABLED = import.meta.env.VITE_MAINTENANCE_MODE_ENABLED === 'true' || false;

// Off-ramp disabled flag - can be toggled via environment variable
export const OFF_RAMP_DISABLED = import.meta.env.VITE_OFF_RAMP_DISABLED === 'true' || false;

export const config = createConfig(
  getDefaultConfig({
    chains: [base],
      transports: {
        [base.id]: http('https://mainnet.base.org'), // Use Base's official RPC
      },
      walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!,
      enableFamily: false,
  
    appName: "SemuniPay",
    appDescription: "Your App Description",
    appUrl: "http://localhost:5173/dashboard",
    appIcon: "https://family.co/logo.png",
    storage: createStorage({
      storage: window.localStorage,
    }),
  }),
  
 
)


