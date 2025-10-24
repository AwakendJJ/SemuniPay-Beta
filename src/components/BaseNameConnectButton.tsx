import { ConnectKitButton } from "connectkit";
import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { createPublicClient, http, toCoinType, type Address } from "viem";
import { mainnet, base } from "viem/chains";

// --------------------------------------------
// 1. Setup Viem Client (MUST BE L1 MAINNET FOR ENS)
// --------------------------------------------
// ENS usually lives on L1. To resolve standard ENS names (including Basenames
// that rely on L1 registry), you need an Ethereum Mainnet RPC.

// Create the client outside the component to avoid recreating it on every render
const client = createPublicClient({
  chain: mainnet,
  transport: http(
    "https://eth-mainnet.g.alchemy.com/v2/JZdCvs5d3Bb7I4rSCPmUslVo6N0Xn4wO"
  ), // or Infura, or any public RPC
});
// --------------------------------------------
// 2. Custom Hook for fetching Basename
// --------------------------------------------
const useBasename = (address: Address | undefined) => {
  const [basename, setBasename] = useState<string | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (!address) {
      setBasename(null);
      return;
    }

    setBasename(undefined); // Start loading

    let isMounted = true;

    const fetchBasename = async () => {
      console.log("Fetching Basename for address:", address);
      try {
        const name = await client.getEnsName({
          address: "0xDa4fb8852589B89AE52829D604962FdC2C6dCcbB",
          // asking L1 ENS: "What name is associated with this address for the BASE chain?"
          coinType: toCoinType(base.id),
        });

        console.log("Fetched Basename:", name);
        if (isMounted) setBasename(name);
      } catch (error) {
        console.error("Error fetching Basename:", error);
        if (isMounted) setBasename(null);
      }
    };

    fetchBasename();

    return () => {
      isMounted = false;
    };
  }, [address]);

  return basename;
};

// --------------------------------------------
// 3. Styled Components
// --------------------------------------------
const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 14px 24px;
  color:rgb(0, 0, 0);
  background: #A3E635; 
  font-size: 16px;
  font-weight: 600;
  border-radius: 100px;
  border: none;
  transition: all 200ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 82, 255, 0.3);
  }
  &:active {
    transform: translateY(0px);
  }
`;

// --------------------------------------------
// 4. Button Renderer
// --------------------------------------------
type ButtonRendererProps = {
  isConnected: boolean;
  isConnecting: boolean;
  show?: () => void;
  address?: Address;
  ensName?: string;
  truncatedAddress?: string;
};

const ButtonRenderer = ({
  isConnected,
  isConnecting,
  show,
  address,
  ensName,
  truncatedAddress,
}: ButtonRendererProps) => {
  // Use our custom hook to get the Basename
  const basename = useBasename(address);

  // Decide what text to display based on priority:
  // 1. Connecting state
  // 2. Loading state
  // 3. Basename (if fetched)
  // 4. ENS Name (from ConnectKit standard fetch)
  // 5. Truncated Address (fallback)
  // 6. "Connect Wallet" (if not connected)
  const buttonText = useMemo(() => {
    if (isConnecting) return "Connecting...";
    if (!isConnected) return "Connect Wallet";
    if (basename === undefined) return "Loading...";
    return basename ?? ensName ?? truncatedAddress;
  }, [isConnecting, isConnected, basename, ensName, truncatedAddress]);

  return <StyledButton onClick={show}>{buttonText}</StyledButton>;
};
// --------------------------------------------
// 5. Exported Component
// --------------------------------------------
export const BasenameConnectButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({
        isConnected,
        isConnecting,
        show,
        address,
        ensName,
        truncatedAddress,
      }) => {
        // Ensure address is cast to the correct type if necessary,
        // though ConnectKit usually provides standard 0x strings.
        return (
          <ButtonRenderer
            isConnected={isConnected}
            isConnecting={isConnecting}
            show={show}
            address={address as Address}
            ensName={ensName}
            truncatedAddress={truncatedAddress}
          />
        );
      }}
    </ConnectKitButton.Custom>
  );
};