import { useProtocolClient } from "./useProtocolClient";
export function useVault() {
  return useProtocolClient().vault;
}