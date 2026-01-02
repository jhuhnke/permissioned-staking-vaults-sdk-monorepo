# @second-breakfast-labs/hushpools-typescript-sdk

TypeScript SDK for interacting with the **HushPools Permissioned Staking Vaults** protocol.

Supports:
- Public deposits & redeems
- Shielded (private) deposits
- Private withdrawals via ZK proofs
- Policy & pause checks
- Admin-only operations

---

## Installation

```bash
npm install @second-breakfast-labs/hushpools-typescript-sdk
```

---

## Quick Start

```ts
import { createClient } from "@second-breakfast-labs/hushpools-typescript-sdk";

const client = createClient({
  diamondAddress: "0x...",
  rpcUrl: "https://...",
  account: "0xYourEOA",
});

await client.vault.deposit({
  assets: 1_000_000_000_000_000_000n,
  receiver: "0xYourEOA",
});
```

---

## Facet Clients

```ts
client.vault
client.shieldedDeposit
client.privateWithdraw
client.nullifier
client.policy
client.verifierAdmin
```

---

## Framework Integrations

### React
```ts
import { useVault } from "@second-breakfast-labs/hushpools-typescript-sdk/react";
```

### Svelte
```ts
import { vaultStore } from "@second-breakfast-labs/hushpools-typescript-sdk/svelte";
```

---

## Notes

- Admin actions are namespaced under `client.admin`
- Proof generation happens off-chain
- All writes require an explicit account

---

## License

MIT
