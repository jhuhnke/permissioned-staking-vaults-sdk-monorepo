// src/clients/DiamondLoupeClient.ts
import type { Address } from "viem";
import { diamondLoupeAbi } from "../abi/diamondLoupe";
import type { ProtocolClientConfig } from "../types/client";
import type { Bytes4 } from "../types/hex";
import type { DiamondFacet } from "../types/diamond";

export type DiamondLoupeClient = {
  /** Returns the facet address that implements `functionSelector` (or zero address if none). */
  facetAddress(args: { functionSelector: Bytes4 }): Promise<Address>;

  /** Returns every facet address in the diamond. */
  facetAddresses(): Promise<readonly Address[]>;

  /** Returns selectors supported by a facet address. */
  facetFunctionSelectors(args: { facet: Address }): Promise<Bytes4[]>;

  /** Returns full loupe view: [{ facetAddress, functionSelectors[] }, ...] */
  facets(): Promise<DiamondFacet[]>;
};

export function createDiamondLoupeClient(cfg: ProtocolClientConfig): DiamondLoupeClient {
  return {
    async facetAddress({ functionSelector }) {
      return cfg.publicClient.readContract({
        address: cfg.diamondAddress,
        abi: diamondLoupeAbi,
        functionName: "facetAddress",
        args: [functionSelector],
      });
    },

    async facetAddresses() {
      return cfg.publicClient.readContract({
        address: cfg.diamondAddress,
        abi: diamondLoupeAbi,
        functionName: "facetAddresses",
      });
    },

    async facetFunctionSelectors({ facet }) {
      return cfg.publicClient.readContract({
        address: cfg.diamondAddress,
        abi: diamondLoupeAbi,
        functionName: "facetFunctionSelectors",
        args: [facet],
      }) as unknown as Bytes4[];
    },

    async facets() {
      // viem will type tuples, but depending on TS config you may need a cast
      return cfg.publicClient.readContract({
        address: cfg.diamondAddress,
        abi: diamondLoupeAbi,
        functionName: "facets",
      }) as unknown as DiamondFacet[];
    },
  };
}
