// react/hooks/usePolicy.ts
import { useProtocolClient } from "./useProtocolClient";
export function usePolicy() {
  return useProtocolClient().policy;
}