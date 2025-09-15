import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./index.css"


import { QueryClient, QueryClientProvider } from "@tanstack/react-query"


import { WagmiProvider, createConfig, http } from "wagmi"
import { base, celo } from "wagmi/chains"
import { metaMask } from "wagmi/connectors"

const queryClient = new QueryClient()

const config = createConfig({
  chains: [base, celo],
  connectors: [metaMask()],
  transports: {
    [base.id]: http(),
    [celo.id]: http(),
  },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
)
