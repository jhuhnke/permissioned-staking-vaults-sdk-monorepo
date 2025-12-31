// src/abi/nullifier.ts
export const nullifierAbi = [
  {
    type: "function",
    name: "getLastRoot",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "insertCommitment",
    inputs: [{ name: "commitment", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "index", type: "uint32", internalType: "uint32" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isKnownRoot",
    inputs: [{ name: "root", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isSpent",
    inputs: [{ name: "nullifier", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "markNullifierSpent",
    inputs: [{ name: "nullifier", type: "bytes32", internalType: "bytes32" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "CommitmentInserted",
    inputs: [
      { name: "leafIndex", type: "uint32", indexed: true, internalType: "uint32" },
      { name: "commitment", type: "bytes32", indexed: true, internalType: "bytes32" },
      { name: "newRoot", type: "bytes32", indexed: true, internalType: "bytes32" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "NullifierSpent",
    inputs: [
      { name: "nullifier", type: "bytes32", indexed: true, internalType: "bytes32" },
      { name: "by", type: "address", indexed: true, internalType: "address" },
    ],
    anonymous: false,
  },
  { type: "error", name: "Privacy_AlreadySpent", inputs: [{ name: "nullifier", type: "bytes32", internalType: "bytes32" }] },
  { type: "error", name: "Privacy_InvalidTreeDepth", inputs: [] },
  { type: "error", name: "Privacy_TreeFull", inputs: [] },
  { type: "error", name: "Privacy_Unauthorized", inputs: [] },
  { type: "error", name: "Privacy_ZeroCommitment", inputs: [] },
] as const;
