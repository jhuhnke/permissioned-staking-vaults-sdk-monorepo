import type { Address, Hash } from "viem";
import { getContract } from "viem";

import { privateWithdrawAbi } from "../abi/privateWithdraw";
import type { ProtocolClientConfig } from "../types/client";
import type { Bytes, Bytes32 } from "../types/hex";

export type PrivateWithdrawClient = {
  privateWithdraw(args: {
    root: Bytes32;
    nullifier: Bytes32;
    recipient: Address;
    amount: bigint;
    proof: Bytes;
  }): Promise<Hash>;

  watchPrivateWithdraw(args: {
    onLogs: (logs: any[]) => void;
    fromBlock?: bigint;
  }): () => void;
};

export function createPrivateWithdrawClient(cfg: ProtocolClientConfig): PrivateWithdrawClient {
  const requireWriteContext = (): { account: Address } => {
    if (!cfg.walletClient) {
      throw new Error(
        "PrivateWithdrawClient: walletClient required for writes. Pass walletClient (and account) to createClient(...).",
      );
    }
    if (!cfg.account) {
      throw new Error(
        "PrivateWithdrawClient: account required for writes. Pass account to createClient(...) or forward it in shared config.",
      );
    }
    return { account: cfg.account };
  };

  // Keeps ABI typing handy and enables event helpers
  const contract = getContract({
    address: cfg.diamondAddress,
    abi: privateWithdrawAbi,
    client: { public: cfg.publicClient },
  });

  return {
    async privateWithdraw({ root, nullifier, recipient, amount, proof }) {
      const { account } = requireWriteContext();

      return cfg.walletClient!.writeContract({
        address: cfg.diamondAddress,
        abi: contract.abi,
        functionName: "privateWithdraw",
        args: [root, nullifier, recipient, amount, proof],
        account,
      });
    },

    watchPrivateWithdraw({ onLogs, fromBlock }) {
      return cfg.publicClient.watchContractEvent({
        address: cfg.diamondAddress,
        abi: contract.abi,
        eventName: "PrivateWithdraw",
        fromBlock,
        onLogs,
      });
    },
  };
}
