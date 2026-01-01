// src/clients/PolicyClient.ts
import type { Address, Hash } from "viem";
import { getContract } from "viem";

import { policyAbi } from "../abi/policy";
import type { ProtocolClientConfig } from "../types/client";
import type { Bytes4 } from "../types/errors";

export type PolicyClient = {
  // -----------------
  // Reads
  // -----------------
  isPaused(): Promise<boolean>;
  isFeaturePaused(args: { selector: Bytes4 }): Promise<boolean>;
  getMaxDepositPerBlock(): Promise<bigint>;
  getLastDepositBlock(): Promise<bigint>;
  getBlockDepositAmount(): Promise<bigint>;

  // -----------------
  // Writes (admin)
  // -----------------
  setGlobalPause(args: { paused: boolean }): Promise<Hash>;
  setFeaturePause(args: { selector: Bytes4; paused: boolean }): Promise<Hash>;
  setMaxDepositPerBlock(args: { amount: bigint }): Promise<Hash>;
};

export function createPolicyClient(cfg: ProtocolClientConfig): PolicyClient {
  const requireWriteContext = (): { account: Address } => {
    if (!cfg.walletClient) {
      throw new Error(
        "PolicyClient: walletClient required for writes. Pass walletClient (or account) to createClient(...).",
      );
    }
    if (!cfg.account) {
      throw new Error(
        "PolicyClient: account required for writes. Pass account to createClient(...) or ensure walletClient.account is set and forwarded.",
      );
    }
    return { account: cfg.account };
  };

  // Use for ABI typing / future event helpers
  const contract = getContract({
    address: cfg.diamondAddress,
    abi: policyAbi,
    client: { public: cfg.publicClient },
  });

  return {
    // -----------------
    // Read methods
    // -----------------
    async isPaused() {
      return cfg.publicClient.readContract({
        address: cfg.diamondAddress,
        abi: contract.abi,
        functionName: "isPaused",
        args: [],
      });
    },

    async isFeaturePaused({ selector }) {
      return cfg.publicClient.readContract({
        address: cfg.diamondAddress,
        abi: contract.abi,
        functionName: "isFeaturePaused",
        args: [selector],
      });
    },

    async getMaxDepositPerBlock() {
      return cfg.publicClient.readContract({
        address: cfg.diamondAddress,
        abi: contract.abi,
        functionName: "getMaxDepositPerBlock",
        args: [],
      });
    },

    async getLastDepositBlock() {
      return cfg.publicClient.readContract({
        address: cfg.diamondAddress,
        abi: contract.abi,
        functionName: "getLastDepositBlock",
        args: [],
      });
    },

    async getBlockDepositAmount() {
      return cfg.publicClient.readContract({
        address: cfg.diamondAddress,
        abi: contract.abi,
        functionName: "getBlockDepositAmount",
        args: [],
      });
    },

    // -----------------
    // Write methods (admin)
    // -----------------
    async setGlobalPause({ paused }) {
      const { account } = requireWriteContext();
      return cfg.walletClient!.writeContract({
        address: cfg.diamondAddress,
        abi: contract.abi,
        functionName: "setGlobalPause",
        args: [paused],
        account,
      });
    },

    async setFeaturePause({ selector, paused }) {
      const { account } = requireWriteContext();
      return cfg.walletClient!.writeContract({
        address: cfg.diamondAddress,
        abi: contract.abi,
        functionName: "setFeaturePause",
        args: [selector, paused],
        account,
      });
    },

    async setMaxDepositPerBlock({ amount }) {
      const { account } = requireWriteContext();
      return cfg.walletClient!.writeContract({
        address: cfg.diamondAddress,
        abi: contract.abi,
        functionName: "setMaxDepositPerBlock",
        args: [amount],
        account,
      });
    },
  };
}
