import type { Address } from "viem";

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
