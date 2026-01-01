import type { Address } from "viem";
import { getContract } from "viem";

import { shieldedDepositAbi } from "../abi/shieldedDeposit";
import type { ProtocolClientConfig } from "../types/client";
import type { Bytes, Bytes32 } from "../types/hex";

export type ShieldedDepositClient = {
  // writes (payable)
  shieldedDeposit(args: { commitment: Bytes32; value: bigint }): Promise<number>;
  shieldedDepositWithEligibility(args: {
    commitment: Bytes32;
    proof: Bytes;
    nullifierHash: Bytes32;
    value: bigint;
  }): Promise<number>;

  // event helpers
  watchShieldedDeposit(args: {
    onLogs: (logs: any[]) => void;
    fromBlock?: bigint;
  }): () => void;

  watchShieldedDepositWithEligibility(args: {
    onLogs: (logs: any[]) => void;
    fromBlock?: bigint;
  }): () => void;
};

export function createShieldedDepositClient(cfg: ProtocolClientConfig): ShieldedDepositClient {
  const requireWriteContext = (): { account: Address } => {
    if (!cfg.walletClient) {
      throw new Error(
        "ShieldedDepositClient: walletClient required for writes. Pass walletClient (and account) to createClient(...).",
      );
    }
    if (!cfg.account) {
      throw new Error(
        "ShieldedDepositClient: account required for writes. Pass account to createClient(...) or forward it in shared config.",
      );
    }
    return { account: cfg.account };
  };

  // Useful for typed ABI + events (public client only)
  const contract = getContract({
    address: cfg.diamondAddress,
    abi: shieldedDepositAbi,
    client: { public: cfg.publicClient },
  });

  return {
    async shieldedDeposit({ commitment, value }) {
      const { account } = requireWriteContext();

      // payable write + returns leafIndex (uint32 -> number)
      const leafIndex = await cfg.walletClient!.writeContract({
        address: cfg.diamondAddress,
        abi: contract.abi,
        functionName: "shieldedDeposit",
        args: [commitment],
        value,
        account,
      });

      return leafIndex as unknown as number;
    },

    async shieldedDepositWithEligibility({ commitment, proof, nullifierHash, value }) {
      const { account } = requireWriteContext();

      const leafIndex = await cfg.walletClient!.writeContract({
        address: cfg.diamondAddress,
        abi: contract.abi,
        functionName: "shieldedDepositWithEligibility",
        args: [commitment, proof, nullifierHash],
        value,
        account,
      });

      return leafIndex as unknown as number;
    },

    watchShieldedDeposit({ onLogs, fromBlock }) {
      return cfg.publicClient.watchContractEvent({
        address: cfg.diamondAddress,
        abi: contract.abi,
        eventName: "ShieldedDeposit",
        fromBlock,
        onLogs,
      });
    },

    watchShieldedDepositWithEligibility({ onLogs, fromBlock }) {
      return cfg.publicClient.watchContractEvent({
        address: cfg.diamondAddress,
        abi: contract.abi,
        eventName: "ShieldedDepositWithEligibility",
        fromBlock,
        onLogs,
      });
    },
  };
}
