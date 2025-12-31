// src/index.ts
export { createClient } from "./clients/createClient";

export { nullifierAbi } from "./abi/nullifier";
export { ownershipAbi } from "./abi/ownership";

export type { ProtocolClientConfig } from "./types/client";
export type { Hex, Bytes32 } from "./types/hex";
export type { NullifierClient } from "./clients/NullifierClient";
export { createOwnershipClient } from "./clients/OwnershipClient";

