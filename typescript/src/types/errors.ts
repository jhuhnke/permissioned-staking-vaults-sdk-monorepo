import type { Address, Hex } from "viem";

export type Bytes4 = Hex; 

/** Thrown when a method requires a walletClient but the SDK was created read-only. */
export class MissingWalletClientError extends Error {
  name = "MissingWalletClientError";
  constructor(message = "This action requires a walletClient (signer).") {
    super(message);
  }
}

/** OwnershipFacet custom errors */
export class NewOwnerIsZeroAddressError extends Error {
  name = "NewOwnerIsZeroAddressError";
  constructor() {
    super("New owner cannot be the zero address.");
  }
}

export class NotContractOwnerError extends Error {
  name = "NotContractOwnerError";
  caller: Address;
  constructor(caller: Address) {
    super(`Caller is not the contract owner: ${caller}`);
    this.caller = caller;
  }
}

export class PolicyInvalidSelectorError extends Error {
  name = "PolicyInvalidSelectorError";
  selector: Bytes4;
  constructor(selector: Bytes4) {
    super(`Invalid selector: ${selector}`);
    this.selector = selector;
  }
}

export class PolicyUnauthorizedError extends Error {
  name = "PolicyUnauthorizedError";
  sender: Address;
  requiredRole: Hex; // bytes32
  constructor(sender: Address, requiredRole: Hex) {
    super(`Unauthorized: sender=${sender} requiredRole=${requiredRole}`);
    this.sender = sender;
    this.requiredRole = requiredRole;
  }
}
