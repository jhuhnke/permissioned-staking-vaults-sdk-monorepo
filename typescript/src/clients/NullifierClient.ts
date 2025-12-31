// src/clients/NullifierClient.ts
import type { Hash } from "viem";
import { getContract } from "viem";
import { nullifierAbi } from "../abi/nullifier";
import type { ProtocolClientConfig } from "../types/client";
import type { Bytes32 } from "../types/hex";

export type NullifierClient = {
  // reads
  getLastRoot(): Promise<Bytes32>;
  isKnownRoot(root: Bytes32): Promise<boolean>;
  isSpent(nullifier: Bytes32): Promise<boolean>;

  // writes (require walletClient)
  insertCommitment(args: { commitment: Bytes32 }): Promise<Hash>;
  markNullifierSpent(args: { nullifier: Bytes32 }): Promise<Hash>;

  // event helpers (optional)
  watchCommitmentInserted(args: {
    onLogs: (logs: any[]) => void;
    fromBlock?: bigint;
  }): () => void;

  watchNullifierSpent(args: {
    onLogs: (logs: any[]) => void;
    fromBlock?: bigint;
  }): () => void;
};

export function createNullifierClient(cfg: ProtocolClientConfig): NullifierClient {
  const contract = getContract({
    address: cfg.diamondAddress,
    abi: nullifierAbi,
    client: { public: cfg.publicClient, wallet: cfg.walletClient },
  });

  function requireWallet() {
    if (!cfg.walletClient) {
      throw new Error("Wallet client required for writes. Pass walletClient to createClient(...).");
    }
  }

  return {
    async getLastRoot() {
      return contract.read.getLastRoot() as unknown as Bytes32;
    },
    async isKnownRoot(root) {
      return contract.read.isKnownRoot([root]);
    },
    async isSpent(nullifier) {
      return contract.read.isSpent([nullifier]);
    },
    async insertCommitment({ commitment }) {
      requireWallet();
      return contract.write.insertCommitment([commitment]);
    },
    async markNullifierSpent({ nullifier }) {
      requireWallet();
      return contract.write.markNullifierSpent([nullifier]);
    },
    watchCommitmentInserted({ onLogs, fromBlock }) {
      return cfg.publicClient.watchContractEvent({
        address: cfg.diamondAddress,
        abi: nullifierAbi,
        eventName: "CommitmentInserted",
        fromBlock,
        onLogs,
      });
    },
    watchNullifierSpent({ onLogs, fromBlock }) {
      return cfg.publicClient.watchContractEvent({
        address: cfg.diamondAddress,
        abi: nullifierAbi,
        eventName: "NullifierSpent",
        fromBlock,
        onLogs,
      });
    },
  };
}
