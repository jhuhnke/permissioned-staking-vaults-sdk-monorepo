// src/clients/OwnershipClient.ts
import type { Address, Hash } from "viem";
import { getContract } from "viem";

import { ownershipAbi } from "../abi/ownership";
import type { ProtocolClientConfig } from "../types/client";

export type OwnershipClient = {
  // reads
  owner(): Promise<Address>;

  // writes (require walletClient + account)
  transferOwnership(args: { newOwner: Address }): Promise<Hash>;
};

export function createOwnershipClient(cfg: ProtocolClientConfig): OwnershipClient {
  const requireWriteContext = (): { account: Address } => {
    if (!cfg.walletClient) {
      throw new Error(
        "OwnershipClient: walletClient required for writes. Pass walletClient (or account) to createClient(...).",
      );
    }
    if (!cfg.account) {
      throw new Error(
        "OwnershipClient: account required for writes. Pass account to createClient(...) or ensure walletClient.account is set and forwarded.",
      );
    }
    return { account: cfg.account };
  };

  // Only used for ABI typing ergonomics (events etc. later)
  const contract = getContract({
    address: cfg.diamondAddress,
    abi: ownershipAbi,
    client: { public: cfg.publicClient },
  });

  return {
    async owner() {
      return cfg.publicClient.readContract({
        address: cfg.diamondAddress,
        abi: contract.abi,
        functionName: "owner",
        args: [],
      });
    },

    async transferOwnership({ newOwner }) {
      const { account } = requireWriteContext();
      return cfg.walletClient!.writeContract({
        address: cfg.diamondAddress,
        abi: contract.abi,
        functionName: "transferOwnership",
        args: [newOwner],
        account, // ✅ fixes the "account missing" + typing issues
      });
    },
  };
}
