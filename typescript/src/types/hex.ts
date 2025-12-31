// src/types/hex.ts
export type Hex = `0x${string}`;

/** Convenience alias for readability (cannot enforce length at compile-time). */
export type Bytes32 = Hex;

export function assertBytes32(value: Hex, label = "value"): asserts value is Bytes32 {
  // 0x + 64 hex chars = 66 length
  if (!value || value.length !== 66) {
    throw new Error(`${label} must be bytes32 (0x + 64 hex chars). Got: ${value}`);
  }
}
