// src/index.ts
export { createClient } from "./clients/createClient";
export { SELECTORS } from "./selectors";

export { nullifierAbi } from "./abi/nullifier";
export { ownershipAbi } from "./abi/ownership";
export { policyAbi } from "./abi/policy";

export type { ProtocolClientConfig } from "./types/client";
export type { Hex, Bytes32 } from "./types/hex";
export type { NullifierClient } from "./clients/NullifierClient";
export { createOwnershipClient } from "./clients/OwnershipClient";
export { createPolicyClient } from "./clients/PolicyClient";

