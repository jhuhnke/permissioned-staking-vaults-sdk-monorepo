import { getContract } from "viem";
import { vaultCoreAbi } from "../abi/vaultCore";

export function createVaultClient({
  address,
  publicClient,
  walletClient,
}: {
  address: `0x${string}`;
  publicClient: any;
  walletClient?: any;
}) {
  const contract = getContract({
    address,
    abi: vaultCoreAbi,
    client: { public: publicClient, wallet: walletClient },
  });

  return {
    deposit: (args: { amount: bigint; receiver: `0x${string}` }) =>
      contract.write.deposit([args.amount, args.receiver]),

    redeem: (args: { shares: bigint; receiver: `0x${string}`; owner: `0x${string}` }) =>
      contract.write.redeem([args.shares, args.receiver, args.owner]),
  };
}
