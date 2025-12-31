import { getContract } from "viem";
import { privacyAbi } from "../abi/privacy";

export function createPrivacyClient({
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
    abi: privacyAbi,
    client: { public: publicClient, wallet: walletClient },
  });

  return {
    shieldedDeposit: (args: {
      commitment: `0x${string}`;
      value: bigint;
    }) => contract.write.shieldedDeposit([args.commitment, args.value]),

    shieldedDepositWithEligibility: (args: {
      commitment: `0x${string}`;
      value: bigint;
      proof: `0x${string}`;
      nullifier: `0x${string}`;
    }) =>
      contract.write.shieldedDepositWithEligibility([
        args.commitment,
        args.value,
        args.proof,
        args.nullifier,
      ]),

    privateWithdraw: (args: {
      root: `0x${string}`;
      nullifier: `0x${string}`;
      recipient: `0x${string}`;
      amount: bigint;
      proof: `0x${string}`;
    }) =>
      contract.write.privateWithdraw([
        args.root,
        args.nullifier,
        args.recipient,
        args.amount,
        args.proof,
      ]),
  };
}
