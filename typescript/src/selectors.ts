import { toFunctionSelector } from "viem";

// You can compute selectors from signatures.
// Keep these in sync with your facet interfaces.
export const SELECTORS = {
  VaultCore: {
    deposit: toFunctionSelector("deposit(uint256,address)"),
    redeem: toFunctionSelector("redeem(uint256,address,address)"),
  },
  ShieldedDeposit: {
    shieldedDeposit: toFunctionSelector("shieldedDeposit(bytes32,uint256)"),
    // add the rest when you lock the signatures
  },
  PrivateWithdraw: {
    privateWithdraw: toFunctionSelector("privateWithdraw(bytes32,bytes32,address,uint256,bytes)"),
  },
} as const;
