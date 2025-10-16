import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./index.css"


import { QueryClient, QueryClientProvider } from "@tanstack/react-query"


import { WagmiProvider,  } from "wagmi"

import { config } from './config'
import { ConnectKitProvider } from "connectkit";



const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
        <App />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
)
