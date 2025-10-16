import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./index.css"


import { QueryClient, QueryClientProvider } from "@tanstack/react-query"


import { WagmiProvider,  } from "wagmi"

import { config } from './config'
import { ConnectKitProvider } from "connectkit";



const queryClient = new QueryClient()
//   hover:bg-lime-300 transition-all duration-300
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider customTheme={{
    "--ck-connectbutton-background": "rgb(163 230 53)",
    "--ck-connectbutton-color": "#111827",
    "--ck-connectbutton-hover-background": "rgb(190 242 100)",
    "--ck-connectbutton-active-background": "rgb(163 230 53)",
    "--ck-connectbutton-border-radius": "9999px",
    "--ck-connectbutton-font-size": "0.9rem"
  }} >
        <App />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
)
