import type { Address } from "viem";
import { getContract } from "viem";

import { verifierAdminAbi } from "../abi/verifierAdmin";
import type { ProtocolClientConfig } from "../types/client";

export type VerifierAdminClient = {
  // reads
  getWithdrawVerifier(): Promise<Address>;

  // writes (admin)
  setWithdrawVerifier(args: { verifier: Address }): Promise<`0x${string}`>;

  // events
  watchWithdrawVerifierSet(args: {
    onLogs: (logs: any[]) => void;
    fromBlock?: bigint;
  }): () => void;
};

export function createVerifierAdminClient(cfg: ProtocolClientConfig): VerifierAdminClient {
  const contract = getContract({
    address: cfg.diamondAddress,
    abi: verifierAdminAbi,
    client: { public: cfg.publicClient },
  });

  const requireWriteContext = (): { account: Address } => {
    if (!cfg.walletClient) {
      throw new Error(
        "VerifierAdminClient: walletClient required for writes. Pass walletClient to createClient(...).",
      );
    }
    if (!cfg.account) {
      throw new Error(
        "VerifierAdminClient: account required for writes. Pass account to createClient(...) or forward it in shared config.",
      );
    }
    return { account: cfg.account };
  };

  return {
    async getWithdrawVerifier() {
      return (await contract.read.getWithdrawVerifier()) as Address;
    },

    async setWithdrawVerifier({ verifier }) {
      const { account } = requireWriteContext();

      const sim = await cfg.publicClient.simulateContract({
        address: cfg.diamondAddress,
        abi: contract.abi,
        functionName: "setWithdrawVerifier",
        args: [verifier],
        account,
      });

      // returns tx hash
      return cfg.walletClient!.writeContract(sim.request);
    },

    watchWithdrawVerifierSet({ onLogs, fromBlock }) {
      return cfg.publicClient.watchContractEvent({
        address: cfg.diamondAddress,
        abi: contract.abi,
        eventName: "WithdrawVerifierSet",
        fromBlock,
        onLogs,
      });
    },
  };
}
