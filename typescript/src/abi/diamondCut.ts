export const diamondCutAbi = [
  {
    type: "function",
    name: "diamondCut",
    inputs: [
      {
        name: "_cut",
        type: "tuple[]",
        internalType: "struct IDiamondCut.FacetCut[]",
        components: [
          { name: "facetAddress", type: "address", internalType: "address" },
          { name: "action", type: "uint8", internalType: "enum IDiamondCut.FacetCutAction" },
          { name: "functionSelectors", type: "bytes4[]", internalType: "bytes4[]" },
        ],
      },
      { name: "_init", type: "address", internalType: "address" },
      { name: "_calldata", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "DiamondCut",
    inputs: [
      {
        name: "_diamondCut",
        type: "tuple[]",
        indexed: false,
        internalType: "struct IDiamondCut.FacetCut[]",
        components: [
          { name: "facetAddress", type: "address", internalType: "address" },
          { name: "action", type: "uint8", internalType: "enum IDiamondCut.FacetCutAction" },
          { name: "functionSelectors", type: "bytes4[]", internalType: "bytes4[]" },
        ],
      },
      { name: "_init", type: "address", indexed: false, internalType: "address" },
      { name: "_calldata", type: "bytes", indexed: false, internalType: "bytes" },
    ],
    anonymous: false,
  },
  { type: "error", name: "Cut_NotContractOwner", inputs: [{ name: "caller", type: "address", internalType: "address" }] },
  { type: "error", name: "InvalidFacetAddress", inputs: [{ name: "facet", type: "address", internalType: "address" }] },
  { type: "error", name: "NoSelectorsProvided", inputs: [] },
  { type: "error", name: "ReplaceFacetSameAddress", inputs: [] },
  { type: "error", name: "SelectorNotFound", inputs: [{ name: "selector", type: "bytes4", internalType: "bytes4" }] },
] as const;
