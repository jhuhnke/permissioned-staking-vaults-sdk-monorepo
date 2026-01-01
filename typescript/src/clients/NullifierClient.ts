// src/clients/NullifierClient.ts
import type {
  Address,
  Hash,
  Log,
  WatchContractEventReturnType,
} from "viem";

import { getContract } from "viem";
import { nullifierAbi } from "../abi/nullifier";
import type { ProtocolClientConfig } from "../types/client";
import type { Bytes32 } from "../types/hex";

export type NullifierClient = {
  // reads
  getLastRoot(): Promise<Bytes32>;
  isKnownRoot(root: Bytes32): Promise<boolean>;
  isSpent(nullifier: Bytes32): Promise<boolean>;

  // writes (require walletClient + account)
  insertCommitment(args: { commitment: Bytes32 }): Promise<Hash>;
  markNullifierSpent(args: { nullifier: Bytes32 }): Promise<Hash>;

  // events
  watchCommitmentInserted(args: {
    onLogs: (logs: Log[]) => void;
    fromBlock?: bigint;
  }): WatchContractEventReturnType;

  watchNullifierSpent(args: {
    onLogs: (logs: Log[]) => void;
    fromBlock?: bigint;
  }): WatchContractEventReturnType;
};

export function createNullifierClient(cfg: ProtocolClientConfig): NullifierClient {
  const requireWriteContext = (): { account: Address } => {
    if (!cfg.walletClient) {
      throw new Error(
        "NullifierClient: walletClient required for writes. Pass walletClient (or account) to createClient(...).",
      );
    }
    if (!cfg.account) {
      throw new Error(
        "NullifierClient: account required for writes. Pass account to createClient(...) or ensure walletClient.account is set and forwarded.",
      );
    }
    return { account: cfg.account };
  };

  // Typed instance only used for ABI/eventName ergonomics
  const contract = getContract({
    address: cfg.diamondAddress,
    abi: nullifierAbi,
    client: { public: cfg.publicClient },
  });

  return {
    // --------
    // Reads
    // --------
    async getLastRoot() {
      const root = await cfg.publicClient.readContract({
        address: cfg.diamondAddress,
        abi: nullifierAbi,
        functionName: "getLastRoot",
        args: [],
      });
      return root as Bytes32;
    },

    async isKnownRoot(root) {
      return cfg.publicClient.readContract({
        address: cfg.diamondAddress,
        abi: nullifierAbi,
        functionName: "isKnownRoot",
        args: [root],
      });
    },

    async isSpent(nullifier) {
      return cfg.publicClient.readContract({
        address: cfg.diamondAddress,
        abi: nullifierAbi,
        functionName: "isSpent",
        args: [nullifier],
      });
    },

    // --------
    // Writes
    // --------
    async insertCommitment({ commitment }) {
      const { account } = requireWriteContext();
      return cfg.walletClient!.writeContract({
        address: cfg.diamondAddress,
        abi: nullifierAbi,
        functionName: "insertCommitment",
        args: [commitment],
        account, // ✅ required by viem typings
      });
    },

    async markNullifierSpent({ nullifier }) {
      const { account } = requireWriteContext();
      return cfg.walletClient!.writeContract({
        address: cfg.diamondAddress,
        abi: nullifierAbi,
        functionName: "markNullifierSpent",
        args: [nullifier],
        account, // ✅ required by viem typings
      });
    },

    // --------
    // Events
    // --------
    watchCommitmentInserted({ onLogs, fromBlock }) {
      return cfg.publicClient.watchContractEvent({
        address: cfg.diamondAddress,
        abi: contract.abi,
        eventName: "CommitmentInserted",
        fromBlock,
        onLogs,
      });
    },

    watchNullifierSpent({ onLogs, fromBlock }) {
      return cfg.publicClient.watchContractEvent({
        address: cfg.diamondAddress,
        abi: contract.abi,
        eventName: "NullifierSpent",
        fromBlock,
        onLogs,
      });
    },
  };
}
