import type { Abi } from "viem";

export const shieldedDepositAbi = [
  {
    type: "function",
    name: "shieldedDeposit",
    inputs: [{ name: "commitment", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "leafIndex", type: "uint32", internalType: "uint32" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "shieldedDepositWithEligibility",
    inputs: [
      { name: "commitment", type: "bytes32", internalType: "bytes32" },
      { name: "proof", type: "bytes", internalType: "bytes" },
      { name: "nullifierHash", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [{ name: "leafIndex", type: "uint32", internalType: "uint32" }],
    stateMutability: "payable",
  },
  {
    type: "event",
    name: "ShieldedDeposit",
    inputs: [
      { name: "caller", type: "address", indexed: true, internalType: "address" },
      { name: "assets", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "leafIndex", type: "uint32", indexed: true, internalType: "uint32" },
      { name: "commitment", type: "bytes32", indexed: true, internalType: "bytes32" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ShieldedDepositWithEligibility",
    inputs: [
      { name: "caller", type: "address", indexed: true, internalType: "address" },
      { name: "assets", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "leafIndex", type: "uint32", indexed: true, internalType: "uint32" },
      { name: "commitment", type: "bytes32", indexed: true, internalType: "bytes32" },
      { name: "nullifierHash", type: "bytes32", indexed: false, internalType: "bytes32" },
    ],
    anonymous: false,
  },
  { type: "error", name: "ShieldedDeposit_EligibilityFailed", inputs: [] },
  { type: "error", name: "ShieldedDeposit_Paused", inputs: [] },
  { type: "error", name: "ShieldedDeposit_ZeroCommitment", inputs: [] },
  { type: "error", name: "ShieldedDeposit_ZeroValue", inputs: [] },
] as const satisfies Abi;
