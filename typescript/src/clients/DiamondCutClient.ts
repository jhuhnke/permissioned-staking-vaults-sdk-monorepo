import type { Address, Hash, Hex } from "viem";
import { getContract } from "viem";

import { diamondCutAbi } from "../abi/diamondCut";
import { MissingWalletClientError } from "../types/errors";
import type { ProtocolClientConfig } from "../types/client";
import type { DiamondCutArgs, FacetCut } from "../types/diamondCut";

export type DiamondCutClient = {
  diamondCut(args: DiamondCutArgs): Promise<Hash>;
  watchDiamondCut(args: {
    onLogs: (logs: any[]) => void;
    fromBlock?: bigint;
  }): () => void;
};

export function createDiamondCutClient(cfg: ProtocolClientConfig): DiamondCutClient {
  const contract = getContract({
    address: cfg.diamondAddress,
    abi: diamondCutAbi,
    client: { public: cfg.publicClient, wallet: cfg.walletClient },
  });

  return {
    async diamondCut({ cut, init, calldata }) {
      if (!cfg.walletClient) throw new MissingWalletClientError();
      if (!cfg.account) {
        // viem writeContract requires an account unless walletClient is already configured with one
        throw new Error("DiamondCutClient: cfg.account is required for writes");
      }

      // tuple[] encoding expects array of objects with matching keys
      const formattedCut = cut.map((c) => ({
        facetAddress: c.facetAddress,
        action: c.action,
        functionSelectors: [...c.functionSelectors],
      })) satisfies readonly FacetCut[];

      return cfg.walletClient.writeContract({
        address: cfg.diamondAddress,
        abi: diamondCutAbi,
        functionName: "diamondCut",
        args: [formattedCut, (init ?? "0x0000000000000000000000000000000000000000") as Address, (calldata ?? "0x") as Hex],
        account: cfg.account,
      });
    },

    watchDiamondCut({ onLogs, fromBlock }) {
      return cfg.publicClient.watchContractEvent({
        address: cfg.diamondAddress,
        abi: diamondCutAbi,
        eventName: "DiamondCut",
        fromBlock,
        onLogs,
      });
    },
  };
}
