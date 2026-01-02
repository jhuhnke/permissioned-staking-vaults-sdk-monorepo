import { writable, derived, type Readable } from "svelte/store";
import { createClient } from "../../src/clients/createClient";
import type { ClientConfig, ProtocolClient } from "../../src/clients/createClient";

export function createProtocolStores(config: ClientConfig) {
  const client = createClient(config);

  const protocol = writable<ProtocolClient>(client);

  const vault = derived(protocol, ($p) => $p.vault);
  const policy = derived(protocol, ($p) => $p.policy);
  const nullifier = derived(protocol, ($p) => $p.nullifier);
  const shieldedDeposit = derived(protocol, ($p) => $p.shieldedDeposit);
  const privateWithdraw = derived(protocol, ($p) => $p.privateWithdraw);

  const privacy = derived(protocol, ($p) => ({
    nullifier: $p.nullifier,
    shieldedDeposit: $p.shieldedDeposit,
    privateWithdraw: $p.privateWithdraw,
    verifierAdmin: $p.verifierAdmin,
  }));

  // Optional derived accounting (simple version now)
  const accountingSummary: Readable<{ totalAssets: bigint }> = derived(vault, (v, set) => {
    let cancelled = false;
    (async () => {
      const totalAssets = await v.totalAssets();
      if (!cancelled) set({ totalAssets });
    })();
    return () => {
      cancelled = true;
    };
  });

  return {
    protocol,
    vault,
    policy,
    privacy,
    accountingSummary,

    // if you want these individually too:
    nullifier,
    shieldedDeposit,
    privateWithdraw,
  };
}
