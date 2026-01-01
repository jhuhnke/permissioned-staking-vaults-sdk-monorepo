import type { Abi } from "viem";

export const policyAbi = [
  {
    type: "function",
    name: "getBlockDepositAmount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLastDepositBlock",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMaxDepositPerBlock",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isFeaturePaused",
    inputs: [{ name: "selector", type: "bytes4", internalType: "bytes4" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isPaused",
    inputs: [],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setFeaturePause",
    inputs: [
      { name: "selector", type: "bytes4", internalType: "bytes4" },
      { name: "paused", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setGlobalPause",
    inputs: [{ name: "paused", type: "bool", internalType: "bool" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setMaxDepositPerBlock",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "FeaturePauseSet",
    inputs: [
      { name: "selector", type: "bytes4", indexed: true, internalType: "bytes4" },
      { name: "paused", type: "bool", indexed: false, internalType: "bool" },
      { name: "sender", type: "address", indexed: true, internalType: "address" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "GlobalPauseSet",
    inputs: [
      { name: "paused", type: "bool", indexed: false, internalType: "bool" },
      { name: "sender", type: "address", indexed: true, internalType: "address" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "VelocityCapSet",
    inputs: [
      { name: "maxDepositPerBlock", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "sender", type: "address", indexed: true, internalType: "address" },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "Policy_Invalidselector",
    inputs: [{ name: "selector", type: "bytes4", internalType: "bytes4" }],
  },
  {
    type: "error",
    name: "Policy_Unauthorized",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      { name: "requiredRole", type: "bytes32", internalType: "bytes32" },
    ],
  },
] as const satisfies Abi;
