import { createConfig, http, createStorage  } from 'wagmi'
import { base } from 'wagmi/chains'
import { getDefaultConfig } from "connectkit";

export const config = createConfig(
  getDefaultConfig({
    chains: [base],
      transports: {
        [base.id]: http(),
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


