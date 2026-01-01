import type { Address, Hex } from "viem";
import type { Bytes4 } from "./hex";

/** Mirrors IDiamondCut.FacetCutAction */
export enum FacetCutAction {
  Add = 0,
  Replace = 1,
  Remove = 2,
}

export type FacetCut = {
  facetAddress: Address;
  action: FacetCutAction;
  functionSelectors: readonly Bytes4[];
};

export type DiamondCutArgs = {
  cut: readonly FacetCut[];
  init?: Address;      // default 0x0
  calldata?: Hex;      // default 0x
};
