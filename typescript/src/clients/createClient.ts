// src/clients/createClient.ts
import {
  createPublicClient,
  createWalletClient,
  getContract,
  http,
  type Address,
  type Chain,
  type PublicClient,
  type Transport,
  type WalletClient,
} from "viem";

import { hoodi } from "../chain";
import { nullifierAbi } from "../abi/nullifier";
import { createNullifierClient } from "./NullifierClient";

/**
 * Minimal config for a usable SDK client.
 * - diamondAddress: REQUIRED because all calls route through the Diamond
 * - rpcUrl: optional override (defaults to chain rpc)
 * - account: optional (enables WalletClient writes)
 * - walletClient/publicClient: optional injection (framework apps often already have these)
 */
export type ClientConfig = {
  diamondAddress: Address;

  // chain config
  chain?: Chain;
  rpcUrl?: string;

  // signing config (choose one)
  account?: Address; // convenience for simple scripts
  walletClient?: WalletClient<Transport, Chain>; // preferred in apps

  // optional injection (advanced)
  publicClient?: PublicClient<Transport, Chain>;
};

export type ProtocolClient = {
  chain: Chain;
  diamondAddress: Address;
  publicClient: PublicClient<Transport, Chain>;
  walletClient?: WalletClient<Transport, Chain>;

  // facet clients
  nullifier: ReturnType<typeof createNullifierClient>;

  // convenience (optional): raw contract handle for quick reads
  contracts: {
    nullifier: ReturnType<typeof getContract>;
  };
};

export function createClient(config: ClientConfig): ProtocolClient {
  if (!config?.diamondAddress) {
    throw new Error("createClient: diamondAddress is required");
  }

  const chain = config.chain ?? hoodi;

  // If caller passed a publicClient, use it; otherwise build one
  const transport = http(config.rpcUrl ?? chain.rpcUrls.default.http[0]);

  const publicClient =
    config.publicClient ??
    createPublicClient({
      chain,
      transport,
    });

  // Wallet client selection:
  // 1) use provided walletClient if present
  // 2) else create one if account present
  const walletClient =
    config.walletClient ??
    (config.account
      ? createWalletClient({
          chain,
          transport,
          account: config.account,
        })
      : undefined);

  // Optional: expose raw contract handles (useful for debugging)
  const nullifierContract = getContract({
    address: config.diamondAddress,
    abi: nullifierAbi,
    client: { public: publicClient, wallet: walletClient },
  });

  // Build facet clients using shared config
  const shared = {
    diamondAddress: config.diamondAddress,
    publicClient,
    walletClient,
  };

  return {
    chain,
    diamondAddress: config.diamondAddress,
    publicClient,
    walletClient,

    nullifier: createNullifierClient(shared),

    contracts: {
      nullifier: nullifierContract,
    },
  };
}
