// src/types/diamond.ts
import type { Address } from "viem";
import type { Bytes4 } from "./hex";

export type DiamondFacet = {
  facetAddress: Address;
  functionSelectors: Bytes4[];
};
