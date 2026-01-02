# HushPools SDK

TypeScript SDK for interacting with the **HushPools Permissioned Staking Vaults** protocol.

This repository contains the **source code** for the SDK, including:
- Core protocol client
- Facet-level abstractions (Vault, Privacy, Policy, Admin)
- Framework adapters (React hooks, Svelte stores)
- ABI bindings pinned to on-chain deployments

The SDK is designed to work in:
- Node.js scripts
- Browser apps
- React
- Svelte

---

## Packages

This repo currently publishes **one package** with multiple entrypoints:

```
@second-breakfast-labs/hushpools-typescript-sdk
├── core SDK           → import from "@…/sdk"
├── React hooks        → import from "@…/sdk/react"
└── Svelte stores      → import from "@…/sdk/svelte"
```

Framework-specific code lives in **isolated entrypoints** so consumers don’t pull unnecessary dependencies.

---

## Architecture Overview

HushPools is built using the **EIP-2535 Diamond pattern**.

All protocol functionality lives behind a single **Diamond address**, and is split into facets:

- **VaultCoreFacet** — public deposits / redeems (ERC-4626-like)
- **ShieldedDepositFacet** — private deposits
- **PrivateWithdrawFacet** — ZK withdrawals
- **NullifierFacet** — nullifier & Merkle tree tracking
- **PolicyFacet** — global + per-feature controls
- **VerifierAdminFacet** — verifier rotation
- **DiamondCutFacet** — admin-only upgrades
- **DiamondLoupeFacet** — introspection

The SDK mirrors this structure with one client per facet.

---

## Repository Structure

```
src/
  abi/
  clients/
  selectors.ts
  types/
  index.ts

react/
  useVault.ts
  usePrivacy.ts
  usePolicy.ts

svelte/
  vaultStore.ts
  privacyStore.ts
  policyStore.ts
```

---

## Development

```bash
pnpm install
pnpm build
pnpm dev
```

---

## Design Principles

- Diamond-aware
- No hidden state
- No proof generation
- Strict typing
- Framework-agnostic core

---

## License

MIT
