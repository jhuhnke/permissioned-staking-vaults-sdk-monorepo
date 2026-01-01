import type { Abi } from "viem";

export const verifierAdminAbi = [
  {
    type: "function",
    name: "getWithdrawVerifier",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setWithdrawVerifier",
    inputs: [{ name: "verifier", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "WithdrawVerifierSet",
    inputs: [
      { name: "verifier", type: "address", indexed: true, internalType: "address" },
      { name: "by", type: "address", indexed: true, internalType: "address" },
    ],
    anonymous: false,
  },
  { type: "error", name: "Zk_Unauthorized", inputs: [] },
  { type: "error", name: "Zk_ZeroAddress", inputs: [] },
] as const satisfies Abi;
