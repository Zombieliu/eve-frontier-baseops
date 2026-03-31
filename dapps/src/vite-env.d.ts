/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EVE_WORLD_PACKAGE_ID?: string;
  readonly VITE_SUI_GRAPHQL_ENDPOINT?: string;
  readonly VITE_SUI_RPC_URL?: string;
  readonly VITE_BASEOPS_LOCALNET_RPC_URL?: string;
  readonly VITE_BASEOPS_DEFAULT_NETWORK?: "localnet" | "testnet" | "devnet";
  readonly VITE_BASEOPS_TENANT?: string;
  readonly VITE_BASEOPS_BUILDER_PACKAGE_ID?: string;
  readonly VITE_BASEOPS_EXTENSION_CONFIG_ID?: string;
  readonly VITE_BASEOPS_SOURCE_GATE_OBJECT_ID?: string;
  readonly VITE_BASEOPS_SOURCE_GATE_ITEM_ID?: string;
  readonly VITE_BASEOPS_DESTINATION_GATE_OBJECT_ID?: string;
  readonly VITE_BASEOPS_DESTINATION_GATE_ITEM_ID?: string;
  readonly VITE_BASEOPS_STORAGE_UNIT_OBJECT_ID?: string;
  readonly VITE_BASEOPS_STORAGE_UNIT_ITEM_ID?: string;
  readonly VITE_BASEOPS_CHARACTER_OBJECT_ID?: string;
  readonly VITE_BASEOPS_CHARACTER_ITEM_ID?: string;
  readonly VITE_BASEOPS_CORPSE_TYPE_ID?: string;
  readonly VITE_BASEOPS_CORPSE_QUANTITY?: string;
  readonly VITE_BASEOPS_RECENT_DIGESTS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
