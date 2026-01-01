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
import { privateWithdrawAbi } from "../abi/privateWithdraw";
import { shieldedDepositAbi } from "../abi/shieldedDeposit";
import { vaultCoreAbi } from "../abi/vaultCore";
import { verifierAdminAbi } from "../abi/verifierAdmin";
import { diamondCutAbi } from "../abi/diamondCut";

import { createNullifierClient } from "./NullifierClient";
import { createOwnershipClient } from "./OwnershipClient";
import { createPolicyClient } from "./PolicyClient";
import { createPrivateWithdrawClient } from "./PrivateWithdrawClient";
import { createShieldedDepositClient } from "./ShieldedDepositClient";
import { createVaultCoreClient } from "./VaultCoreClient";
import { createVerifierAdminClient } from "./VerifierAdminClient";
import { createDiamondCutClient } from "./DiamondCutClient";

/**
 * Minimal config for a usable SDK client.
 * - diamondAddress: REQUIRED because all calls route through the Diamond
 * - rpcUrl: optional override (defaults to chain rpc)
 * - account: optional (enables writeContract calls)
 * - walletClient/publicClient: optional injection (framework apps often already have these)
 */
export type ClientConfig = {
  diamondAddress: Address;

  // chain config
  chain?: Chain;
  rpcUrl?: string;

  // signing config (choose one)
  account?: Address; // convenience for scripts (also required by viem writeContract in our clients)
  walletClient?: WalletClient<Transport, Chain>; // preferred in apps

  // optional injection (advanced)
  publicClient?: PublicClient<Transport, Chain>;
};

export type ProtocolClient = {
  chain: Chain;
  diamondAddress: Address;

  publicClient: PublicClient<Transport, Chain>;
  walletClient?: WalletClient<Transport, Chain>;
  /** Account used for writeContract calls (required by our write wrappers) */
  account?: Address;

  // facet clients
  nullifier: ReturnType<typeof createNullifierClient>;
  ownership: ReturnType<typeof createOwnershipClient>;
  policy: ReturnType<typeof createPolicyClient>;
  privateWithdraw: ReturnType<typeof createPrivateWithdrawClient>;
  shieldedDeposit: ReturnType<typeof createShieldedDepositClient>;
  vault: ReturnType<typeof createVaultCoreClient>;
  verifierAdmin: ReturnType<typeof createVerifierAdminClient>;

  /** Admin-only / dangerous operations (kept namespaced intentionally) */
  admin: {
    diamondCut: ReturnType<typeof createDiamondCutClient>;
  };

  // convenience (optional): raw contract handles for quick reads/debugging
  contracts: {
    nullifier: ReturnType<typeof getContract>;
    ownership: ReturnType<typeof getContract>;
    policy: ReturnType<typeof getContract>;
    privateWithdraw: ReturnType<typeof getContract>;
    shieldedDeposit: ReturnType<typeof getContract>;
    vaultCore: ReturnType<typeof getContract>;
    verifierAdmin: ReturnType<typeof getContract>;
    diamondCut: ReturnType<typeof getContract>;
  };
};

export function createClient(config: ClientConfig): ProtocolClient {
  if (!config?.diamondAddress) {
    throw new Error("createClient: diamondAddress is required");
  }

  const chain = config.chain ?? hoodi;

  // Build transport once
  const transport = http(config.rpcUrl ?? chain.rpcUrls.default.http[0]);

  // If caller passed a publicClient, use it; otherwise build one
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

  // For viem writeContract, we want an explicit account.
  // Prefer config.account; otherwise try to read from walletClient if it has one.
  const account: Address | undefined =
    config.account ??
    ((walletClient as unknown as { account?: Address } | undefined)?.account);

  // Shared config for all facet/admin clients
  const shared = {
    diamondAddress: config.diamondAddress,
    publicClient,
    walletClient,
    account,
  } as const;

  // --------------------------
  // Raw contract handles (optional)
  // --------------------------
  // NOTE:
  // - Reads can use public client only.
  // - Writes will only be available if walletClient was provided/created.
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

  const privateWithdrawContract = getContract({
    address: config.diamondAddress,
    abi: privateWithdrawAbi,
    client: { public: publicClient, wallet: walletClient },
  });

  const shieldedDepositContract = getContract({
    address: config.diamondAddress,
    abi: shieldedDepositAbi,
    client: { public: publicClient, wallet: walletClient },
  });

  const vaultCoreContract = getContract({
    address: config.diamondAddress,
    abi: vaultCoreAbi,
    client: { public: publicClient, wallet: walletClient },
  });

  const verifierAdminContract = getContract({
    address: config.diamondAddress,
    abi: verifierAdminAbi,
    client: { public: publicClient, wallet: walletClient },
  });

  const diamondCutContract = getContract({
    address: config.diamondAddress,
    abi: diamondCutAbi,
    client: { public: publicClient, wallet: walletClient },
  });

  // --------------------------
  // Return assembled SDK client
  // --------------------------
  return {
    chain,
    diamondAddress: config.diamondAddress,
    publicClient,
    walletClient,
    account,

    // facet clients
    nullifier: createNullifierClient(shared),
    ownership: createOwnershipClient(shared),
    policy: createPolicyClient(shared),
    privateWithdraw: createPrivateWithdrawClient(shared),
    shieldedDeposit: createShieldedDepositClient(shared),
    vault: createVaultCoreClient(shared),
    verifierAdmin: createVerifierAdminClient(shared),

    // admin wiring (namespaced)
    admin: {
      diamondCut: createDiamondCutClient(shared),
    },

    // raw contracts (debug/convenience)
    contracts: {
      nullifier: nullifierContract,
      ownership: ownershipContract,
      policy: policyContract,
      privateWithdraw: privateWithdrawContract,
      shieldedDeposit: shieldedDepositContract,
      vaultCore: vaultCoreContract,
      verifierAdmin: verifierAdminContract,
      diamondCut: diamondCutContract,
    },
  };
}
