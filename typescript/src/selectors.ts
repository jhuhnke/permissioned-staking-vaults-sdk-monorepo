import { toFunctionSelector } from "viem";

/**
 * Central registry of all facet selectors.
 * Keep this in sync with deployed ABIs.
 */
export const SELECTORS = {
  // ──────────────────────────────
  // VaultCoreFacet
  // ──────────────────────────────
  VaultCore: {
    asset: toFunctionSelector("asset()"),
    convertToAssets: toFunctionSelector("convertToAssets(uint256)"),
    convertToShares: toFunctionSelector("convertToShares(uint256)"),
    deposit: toFunctionSelector("deposit(uint256,address)"),
    previewDeposit: toFunctionSelector("previewDeposit(uint256)"),
    previewRedeem: toFunctionSelector("previewRedeem(uint256)"),
    redeem: toFunctionSelector("redeem(uint256,address,address)"),
    totalAssets: toFunctionSelector("totalAssets()"),
  },

  // ──────────────────────────────
  // ShieldedDepositFacet
  // ──────────────────────────────
  ShieldedDeposit: {
    shieldedDeposit: toFunctionSelector("shieldedDeposit(bytes32)"),
    shieldedDepositWithEligibility: toFunctionSelector(
      "shieldedDepositWithEligibility(bytes32,bytes,bytes32)"
    ),
  },

  // ──────────────────────────────
  // PrivateWithdrawFacet
  // ──────────────────────────────
  PrivateWithdraw: {
    privateWithdraw: toFunctionSelector(
      "privateWithdraw(bytes32,bytes32,address,uint256,bytes)"
    ),
  },

  // ──────────────────────────────
  // NullifierFacet
  // ──────────────────────────────
  Nullifier: {
    getLastRoot: toFunctionSelector("getLastRoot()"),
    isKnownRoot: toFunctionSelector("isKnownRoot(bytes32)"),
    isSpent: toFunctionSelector("isSpent(bytes32)"),
    insertCommitment: toFunctionSelector("insertCommitment(bytes32)"),
    markNullifierSpent: toFunctionSelector("markNullifierSpent(bytes32)"),
  },

  // ──────────────────────────────
  // PolicyFacet
  // ──────────────────────────────
  Policy: {
    isPaused: toFunctionSelector("isPaused()"),
    isFeaturePaused: toFunctionSelector("isFeaturePaused(bytes4)"),
    setFeaturePause: toFunctionSelector("setFeaturePause(bytes4,bool)"),
    setGlobalPause: toFunctionSelector("setGlobalPause(bool)"),
    getMaxDepositPerBlock: toFunctionSelector("getMaxDepositPerBlock()"),
    getLastDepositBlock: toFunctionSelector("getLastDepositBlock()"),
    getBlockDepositAmount: toFunctionSelector("getBlockDepositAmount()"),
  },

  // ──────────────────────────────
  // OwnershipFacet
  // ──────────────────────────────
  Ownership: {
    owner: toFunctionSelector("owner()"),
    transferOwnership: toFunctionSelector("transferOwnership(address)"),
  },

  // ──────────────────────────────
  // VerifierAdminFacet
  // ──────────────────────────────
  VerifierAdmin: {
    getWithdrawVerifier: toFunctionSelector("getWithdrawVerifier()"),
    setWithdrawVerifier: toFunctionSelector("setWithdrawVerifier(address)"),
  },

  // ──────────────────────────────
  // DiamondCutFacet
  // ──────────────────────────────
  DiamondCut: {
    diamondCut: toFunctionSelector("diamondCut((address,uint8,bytes4[])[],address,bytes)")
},
  // ──────────────────────────────
  // DiamondLoupeFacet
  // ──────────────────────────────
} as const;
