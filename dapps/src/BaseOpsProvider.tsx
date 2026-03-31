import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  NotificationProvider,
  SmartObjectProvider,
  VaultProvider,
} from "@evefrontier/dapp-kit";
import { DAppKitProvider, createDAppKit } from "@mysten/dapp-kit-react";
import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import type { ReactNode } from "react";

const RPC_URLS = {
  localnet: import.meta.env.VITE_BASEOPS_LOCALNET_RPC_URL?.trim() || "http://127.0.0.1:9000",
  testnet: "https://fullnode.testnet.sui.io:443",
  devnet: "https://fullnode.devnet.sui.io:443",
} as const;

const SUPPORTED_NETWORKS: ["localnet", "testnet", "devnet"] = [
  "localnet",
  "testnet",
  "devnet",
];

const DEFAULT_NETWORK =
  import.meta.env.VITE_BASEOPS_DEFAULT_NETWORK === "localnet" ||
  import.meta.env.VITE_BASEOPS_DEFAULT_NETWORK === "devnet" ||
  import.meta.env.VITE_BASEOPS_DEFAULT_NETWORK === "testnet"
    ? import.meta.env.VITE_BASEOPS_DEFAULT_NETWORK
    : "testnet";

const dAppKit = createDAppKit({
  networks: SUPPORTED_NETWORKS,
  defaultNetwork: DEFAULT_NETWORK,
  createClient(network) {
    return new SuiJsonRpcClient({
      url: RPC_URLS[network],
      network,
    });
  },
});

export function BaseOpsProvider({
  children,
  queryClient,
}: {
  children: ReactNode;
  queryClient: QueryClient;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <DAppKitProvider dAppKit={dAppKit}>
        <VaultProvider>
          <SmartObjectProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </SmartObjectProvider>
        </VaultProvider>
      </DAppKitProvider>
    </QueryClientProvider>
  );
}
