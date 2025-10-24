import { ConnectKitButton } from "connectkit";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { usePublicClient } from "wagmi";
import { toCoinType, type Address } from "viem";
import { base, type Chain } from "viem/chains";

// Styled-component remains the same
const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 14px 24px;
  color:rgb(0, 0, 0);
  background: #A3E635;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10rem;
  

  transition: 200ms ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 6px 40px -6px rgb(17, 48, 79);
  }
  &:active {
    transform: translateY(-3px);
    box-shadow: 0 6px 32px -6px rgb(12, 34, 55);
  }
`;

// 1. Define a TypeScript interface for our component's props.
// This matches the shape of the render props from ConnectKitButton.
interface ButtonRendererProps {
  isConnected: boolean;
  isConnecting: boolean;
  show?: () => void;
  hide?: () => void;
  address?: Address;
  ensName?: string | null;
  truncatedAddress?: string;
  chain?: Chain & { unsupported?: boolean };
}

// 2. Apply the interface to the component's props.
const ButtonRenderer = ({
  isConnected,
  isConnecting,
  show,
  address,
  ensName,
  truncatedAddress,
  chain,
}: ButtonRendererProps) => {
  const [basename, setBasename] = useState<string | null>(null);
  const publicClient = usePublicClient({ chainId: base.id });

  useEffect(() => {
    console.log("BaseName useEffect triggered:", { address, chainId: chain?.id, baseId: base.id });
    
    if (!address || chain?.id !== base.id) {
      console.log("Not on Base chain or no address, clearing basename");
      setBasename(null);
      return;
    }

    const fetchBasename = async () => {
      try {
        if (!publicClient) {
          console.log("No public client available");
          return;
        }
        
        console.log("Fetching Base Name for address:", address);
        
        // Base Names are not resolved through standard ENS infrastructure
        // They use a different system. For now, we'll skip Base Name resolution
        // and rely on ENS names from other chains or truncated addresses
        console.log("Base Name resolution not supported - Base uses different naming system");
        setBasename(null);
        
      } catch (error) {
        console.error("Error fetching Basename:", error);
        setBasename(null);
      }
    };

    fetchBasename();
  }, [address, chain, publicClient]);

  // For Base chain, we'll prioritize ENS names from other chains or use truncated address
  // Base Names are not currently supported through standard ENS infrastructure
  const buttonText = isConnected
    ? ensName ?? truncatedAddress
    : "Connect Wallet";

  console.log("Button text calculation:", { 
    isConnected, 
    basename, 
    ensName, 
    truncatedAddress, 
    finalText: buttonText,
    chainName: chain?.name,
    chainId: chain?.id
  });

  return (
    // 3. Safely call the optional `show` function.
    <StyledButton onClick={() => show?.()}>
      {isConnecting ? "Connecting..." : buttonText}
    </StyledButton>
  );
};

export const BasenameConnectButton = () => {
  return (
    <ConnectKitButton.Custom>
      {(props) => <ButtonRenderer {...props} />}
    </ConnectKitButton.Custom>
  );
};

// Note: This component is named BasenameConnectButton but currently doesn't resolve Base Names
// due to Base network not supporting standard ENS infrastructure. It will fall back to
// ENS names from other chains or truncated addresses when connected to Base.
