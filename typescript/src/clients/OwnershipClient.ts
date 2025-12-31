// src/clients/OwnershipClient.ts
import {
  getContract,
  type Address,
  type PublicClient,
  type WalletClient,
  type Transport,
  type Chain,
} from "viem";

import { ownershipAbi } from "../abi/ownership";
import { MissingWalletClientError } from "../types/errors";

export type OwnershipClientConfig = {
  diamondAddress: Address;
  publicClient: PublicClient<Transport, Chain>;
  walletClient?: WalletClient<Transport, Chain>;
};

export function createOwnershipClient(cfg: OwnershipClientConfig) {
  const contract = getContract({
    address: cfg.diamondAddress,
    abi: ownershipAbi,
    client: { public: cfg.publicClient, wallet: cfg.walletClient },
  });

  return {
    /** Read: current diamond owner */
    async owner(): Promise<Address> {
      return contract.read.owner();
    },

    /**
     * Write: transfer ownership
     * Returns the tx hash (common SDK convention) — you can also return receipt if you prefer.
     */
    async transferOwnership(args: { newOwner: Address }): Promise<`0x${string}`> {
      if (!cfg.walletClient) throw new MissingWalletClientError();

      // viem write calls typically return a tx hash
      return contract.write.transferOwnership([args.newOwner]);
    },

    // Expose the raw contract in case you want to do advanced things later (events, simulate, etc.)
    contract,
  };
}
