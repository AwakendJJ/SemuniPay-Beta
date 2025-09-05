export const wagmiContractConfig = {
  address: "0xfd366a14fbeaa467ea2179952107a5ecc90af7fd" as `0x${string}`,
  USDC_PROXY_ADDRESS:
    "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as `0x${string}`,
  WAGATOKEN_ADDRESS:
    "0xC7687295395597CFa014C7f7A47179bC3d2674BD" as `0x${string}`,
};
export const erc20Abi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address recipient, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];
