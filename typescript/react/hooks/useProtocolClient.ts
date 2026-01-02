import React, { createContext, useContext, useMemo } from "react";
import type { ProtocolClient, ClientConfig } from "../src/clients/createClient";
import { createClient } from "../src/clients/createClient";

/**
 * In apps, you usually already have walletClient/publicClient from somewhere.
 * This Provider wires them into a ProtocolClient once.
 */
const ProtocolClientContext = createContext<ProtocolClient | null>(null);

export function ProtocolClientProvider({
  config,
  children,
}: {
  config: ClientConfig;
  children: React.ReactNode;
}) {
  const client = useMemo(() => createClient(config), [stableConfigKey(config)]);
  return (
    <ProtocolClientContext.Provider value={client}>
      {children}
    </ProtocolClientContext.Provider>
  );
}

export function useProtocolClient(): ProtocolClient {
  const client = useContext(ProtocolClientContext);
  if (!client) {
    throw new Error("useProtocolClient must be used within <ProtocolClientProvider />");
  }
  return client;
}

/**
 * Avoid deep object identity causing re-creates.
 * Keep it simple: users can pass stable objects (recommended).
 * This key is a best-effort fallback.
 */
function stableConfigKey(cfg: ClientConfig) {
  return JSON.stringify({
    diamondAddress: cfg.diamondAddress,
    rpcUrl: cfg.rpcUrl,
    chainId: cfg.chain?.id,
    account: cfg.account,
    // walletClient/publicClient are intentionally omitted (non-serializable).
  });
}
