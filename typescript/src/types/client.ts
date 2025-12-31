// src/types/client.ts
import type { Address, Chain, Transport } from "viem";
import type { PublicClient, WalletClient } from "viem";

/**
 * Base config shared across all facet clients.
 * All facet calls go to the Diamond address (router).
 */
export type ProtocolClientConfig = {
  diamondAddress: Address;
  publicClient: PublicClient<Transport, Chain>;
  walletClient?: WalletClient<Transport, Chain>;
};
