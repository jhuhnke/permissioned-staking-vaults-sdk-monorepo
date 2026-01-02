// react/hooks/usePrivacy.ts
import { useProtocolClient } from "./useProtocolClient";
export function usePrivacy() {
  const c = useProtocolClient();
  return {
    nullifier: c.nullifier,
    shieldedDeposit: c.shieldedDeposit,
    privateWithdraw: c.privateWithdraw,
    verifierAdmin: c.verifierAdmin,
  };
}