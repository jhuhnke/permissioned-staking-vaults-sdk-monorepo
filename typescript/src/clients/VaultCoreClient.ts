import type { Address } from "viem";
import { getContract } from "viem";

import { vaultCoreAbi } from "../abi/vaultCore";
import type { ProtocolClientConfig } from "../types/client";

export type VaultCoreClient = {
  // -----------------
  // Reads
  // -----------------
  asset(): Promise<Address>;
  totalAssets(): Promise<bigint>;
  convertToShares(args: { assets: bigint }): Promise<bigint>;
  convertToAssets(args: { shares: bigint }): Promise<bigint>;
  previewDeposit(args: { assets: bigint }): Promise<bigint>;
  previewRedeem(args: { shares: bigint }): Promise<bigint>;

  // -----------------
  // Writes
  // -----------------
  /**
   * deposit is payable (ETH in). You pass both:
   * - assets: logical assets amount
   * - value: msg.value to send
   *
   * Returns shares minted (decoded from simulate).
   */
  deposit(args: { assets: bigint; receiver: Address; value: bigint }): Promise<bigint>;

  /**
   * redeem returns assets (decoded from simulate).
   */
  redeem(args: { shares: bigint; receiver: Address; owner: Address }): Promise<bigint>;

  // -----------------
  // Event watchers
  // -----------------
  watchDeposit(args: {
    onLogs: (logs: any[]) => void;
    fromBlock?: bigint;
  }): () => void;

  watchWithdraw(args: {
    onLogs: (logs: any[]) => void;
    fromBlock?: bigint;
  }): () => void;
};

export function createVaultCoreClient(cfg: ProtocolClientConfig): VaultCoreClient {
  const contract = getContract({
    address: cfg.diamondAddress,
    abi: vaultCoreAbi,
    client: { public: cfg.publicClient },
  });

  const requireWriteContext = (): { account: Address } => {
    if (!cfg.walletClient) {
      throw new Error(
        "VaultCoreClient: walletClient required for writes. Pass walletClient to createClient(...).",
      );
    }
    if (!cfg.account) {
      throw new Error(
        "VaultCoreClient: account required for writes. Pass account to createClient(...) or forward it in shared config.",
      );
    }
    return { account: cfg.account };
  };

  return {
    // --------
    // Reads
    // --------
    async asset() {
      return (await contract.read.asset()) as Address;
    },

    async totalAssets() {
      return (await contract.read.totalAssets()) as bigint;
    },

    async convertToShares({ assets }) {
      return (await contract.read.convertToShares([assets])) as bigint;
    },

    async convertToAssets({ shares }) {
      return (await contract.read.convertToAssets([shares])) as bigint;
    },

    async previewDeposit({ assets }) {
      return (await contract.read.previewDeposit([assets])) as bigint;
    },

    async previewRedeem({ shares }) {
      return (await contract.read.previewRedeem([shares])) as bigint;
    },

    // --------
    // Writes
    // --------
    async deposit({ assets, receiver, value }) {
      const { account } = requireWriteContext();

      const sim = await cfg.publicClient.simulateContract({
        address: cfg.diamondAddress,
        abi: contract.abi,
        functionName: "deposit",
        args: [assets, receiver],
        value,
        account,
      });

      await cfg.walletClient!.writeContract(sim.request);
      return sim.result as unknown as bigint; // shares
    },

    async redeem({ shares, receiver, owner }) {
      const { account } = requireWriteContext();

      const sim = await cfg.publicClient.simulateContract({
        address: cfg.diamondAddress,
        abi: contract.abi,
        functionName: "redeem",
        args: [shares, receiver, owner],
        account,
      });

      await cfg.walletClient!.writeContract(sim.request);
      return sim.result as unknown as bigint; // assets
    },

    // --------
    // Events
    // --------
    watchDeposit({ onLogs, fromBlock }) {
      return cfg.publicClient.watchContractEvent({
        address: cfg.diamondAddress,
        abi: contract.abi,
        eventName: "Deposit",
        fromBlock,
        onLogs,
      });
    },

    watchWithdraw({ onLogs, fromBlock }) {
      return cfg.publicClient.watchContractEvent({
        address: cfg.diamondAddress,
        abi: contract.abi,
        eventName: "Withdraw",
        fromBlock,
        onLogs,
      });
    },
  };
}
