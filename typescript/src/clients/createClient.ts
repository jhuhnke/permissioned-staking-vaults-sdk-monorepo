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
import { ownershipAbi } from "../abi/ownership";
import { policyAbi } from "../abi/policy";

import { createNullifierClient } from "./NullifierClient";
import { createOwnershipClient } from "./OwnershipClient";
import { createPolicyClient } from "./PolicyClient";

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
  ownership: ReturnType<typeof createOwnershipClient>;
  policy: ReturnType<typeof createPolicyClient>;

  // convenience (optional): raw contract handles for quick reads/debugging
  contracts: {
    nullifier: ReturnType<typeof getContract>;
    ownership: ReturnType<typeof getContract>;
    policy: ReturnType<typeof getContract>;
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

  const account =
  config.account ??
  (config.walletClient && "account" in config.walletClient
    ? (config.walletClient.account as Address | undefined)
    : undefined);

  // Shared config for all facet clients
  const shared = {
    diamondAddress: config.diamondAddress,
    publicClient,
    walletClient,
    account
  } as const;

  // Optional: expose raw contract handles (useful for debugging)
  const nullifierContract = getContract({
    address: config.diamondAddress,
    abi: nullifierAbi,
    client: { public: publicClient, wallet: walletClient },
  });

  const ownershipContract = getContract({
    address: config.diamondAddress,
    abi: ownershipAbi,
    client: { public: publicClient, wallet: walletClient },
  });

  const policyContract = getContract({
    address: config.diamondAddress,
    abi: policyAbi,
    client: { public: publicClient, wallet: walletClient },
  });

  return {
    chain,
    diamondAddress: config.diamondAddress,
    publicClient,
    walletClient,

    // facet clients
    nullifier: createNullifierClient(shared),
    ownership: createOwnershipClient(shared),
    policy: createPolicyClient(shared),

    // raw contracts
    contracts: {
      nullifier: nullifierContract,
      ownership: ownershipContract,
      policy: policyContract,
    },
  };
}
