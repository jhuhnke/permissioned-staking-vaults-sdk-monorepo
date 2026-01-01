import type { Abi } from "viem";

export const privateWithdrawAbi = [
  {
    type: "function",
    name: "privateWithdraw",
    inputs: [
      { name: "root", type: "bytes32", internalType: "bytes32" },
      { name: "nullifier", type: "bytes32", internalType: "bytes32" },
      { name: "recipient", type: "address", internalType: "address payable" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "proof", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "PrivateWithdraw",
    inputs: [
      { name: "root", type: "bytes32", indexed: true, internalType: "bytes32" },
      { name: "nullifier", type: "bytes32", indexed: true, internalType: "bytes32" },
      { name: "recipient", type: "address", indexed: true, internalType: "address" },
      { name: "amount", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  { type: "error", name: "EthTransferFailed", inputs: [] },
  {
    type: "error",
    name: "Privacy_NullifierAlreadySpent",
    inputs: [{ name: "nullifier", type: "bytes32", internalType: "bytes32" }],
  },
  {
    type: "error",
    name: "Privacy_UnknownRoot",
    inputs: [{ name: "root", type: "bytes32", internalType: "bytes32" }],
  },
  { type: "error", name: "Privacy_VerificationFailed", inputs: [] },
  { type: "error", name: "Privacy_ZeroAmount", inputs: [] },
  { type: "error", name: "Privacy_ZeroRecipient", inputs: [] },
  { type: "error", name: "Vault_InsufficientManagedAssets", inputs: [] },
  { type: "error", name: "Zk_VerifierNotSet", inputs: [] },
] as const satisfies Abi;
