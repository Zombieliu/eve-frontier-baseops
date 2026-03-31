import {
  getObjectWithJson,
  getOwnedObjectsByType,
  getSingletonObjectByType,
  parseCharacterFromJson,
} from "@evefrontier/dapp-kit";
import { bcs } from "@mysten/sui/bcs";
import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { Transaction } from "@mysten/sui/transactions";
import { deriveObjectID } from "@mysten/sui/utils";

const CLOCK_OBJECT_ID = "0x6";

const DEFAULT_RPC_URLS = {
  localnet: "http://127.0.0.1:9000",
  devnet: "https://fullnode.devnet.sui.io:443",
  testnet: "https://fullnode.testnet.sui.io:443",
} as const;

const TenantItemId = bcs.struct("TenantItemId", {
  id: bcs.u64(),
  tenant: bcs.string(),
});

const registryAddressCache = new Map<string, string>();

export type BaseOpsRuntimeConfig = {
  tenant: string;
  worldPackageId: string;
  builderPackageId: string;
  extensionConfigId: string;
  rpcUrl: string;
  sourceGateObjectId: string;
  sourceGateItemId: string;
  destinationGateObjectId: string;
  destinationGateItemId: string;
  storageUnitObjectId: string;
  storageUnitItemId: string;
  characterObjectId: string;
  characterItemId: string;
  corpseTypeId: string;
  corpseQuantity: string;
  recentDigests: string;
};

export type DiscoveredCharacter = {
  characterObjectId: string;
  characterItemId: number;
  ownerCapId: string;
  name: string;
  tribeId: number;
};

export type EventFeedEntry = {
  id: string;
  digest: string;
  time: string;
  label: string;
  detail: string;
  kind: "access" | "storage" | "system";
  status: "success" | "error";
  eventType?: string;
};

export type TxReadback = {
  digest: string;
  status: "success" | "error";
  mutatedObjectIds: string[];
  entries: EventFeedEntry[];
};

export type ObjectReadback = {
  objectId: string;
  version: string;
  digest: string;
  type: string;
};

export type ResolvedActionTargets = {
  sourceGateId: string;
  destinationGateId: string;
  characterId: string;
  storageUnitId?: string;
};

function parseJsonRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function isNonEmpty(value: string | null | undefined): value is string {
  return Boolean(value?.trim());
}

function formatTimestamp(timestampMs: number | string | undefined): string {
  const numeric =
    typeof timestampMs === "string" ? Number(timestampMs) : timestampMs ?? Date.now();
  const date = Number.isFinite(numeric) ? new Date(Number(numeric)) : new Date();
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function describeParsedJson(parsedJson: unknown): string {
  const record = parseJsonRecord(parsedJson);
  if (!record) {
    return "Transaction confirmed on-chain.";
  }

  const entries = Object.entries(record)
    .filter(([, value]) =>
      ["string", "number", "boolean"].includes(typeof value),
    )
    .slice(0, 4)
    .map(([key, value]) => `${key}: ${String(value)}`);

  return entries.length > 0 ? entries.join(" · ") : "Transaction confirmed on-chain.";
}

function labelForEventType(eventType: string, kind: EventFeedEntry["kind"]): string {
  const segments = eventType.split("::");
  const suffix = segments[segments.length - 1] ?? eventType;
  if (suffix.toLowerCase().includes("permit")) {
    return kind === "access" ? "Jump permit issued" : "Permit state updated";
  }
  if (suffix.toLowerCase().includes("jump")) {
    return "Gate jump recorded";
  }
  if (suffix.toLowerCase().includes("storage") || suffix.toLowerCase().includes("inventory")) {
    return "Storage mutation recorded";
  }
  if (suffix.toLowerCase().includes("bounty")) {
    return "Bounty workflow recorded";
  }
  return suffix.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function getWorldType(worldPackageId: string, typeSuffix: string): string {
  return `${worldPackageId}::${typeSuffix}`;
}

function toNumberString(value: string): string {
  return value.trim().replace(/^0+/, "") || "0";
}

export function createRpcClient(
  network: keyof typeof DEFAULT_RPC_URLS,
  overrideUrl?: string,
): SuiJsonRpcClient {
  return new SuiJsonRpcClient({
    url: overrideUrl?.trim() || DEFAULT_RPC_URLS[network],
    network,
  });
}

export function getDefaultRuntimeConfig(): BaseOpsRuntimeConfig {
  return {
    tenant: import.meta.env.VITE_BASEOPS_TENANT ?? "dev",
    worldPackageId: import.meta.env.VITE_EVE_WORLD_PACKAGE_ID ?? "",
    builderPackageId: import.meta.env.VITE_BASEOPS_BUILDER_PACKAGE_ID ?? "",
    extensionConfigId: import.meta.env.VITE_BASEOPS_EXTENSION_CONFIG_ID ?? "",
    rpcUrl: import.meta.env.VITE_SUI_RPC_URL ?? "",
    sourceGateObjectId: import.meta.env.VITE_BASEOPS_SOURCE_GATE_OBJECT_ID ?? "",
    sourceGateItemId: import.meta.env.VITE_BASEOPS_SOURCE_GATE_ITEM_ID ?? "",
    destinationGateObjectId:
      import.meta.env.VITE_BASEOPS_DESTINATION_GATE_OBJECT_ID ?? "",
    destinationGateItemId: import.meta.env.VITE_BASEOPS_DESTINATION_GATE_ITEM_ID ?? "",
    storageUnitObjectId: import.meta.env.VITE_BASEOPS_STORAGE_UNIT_OBJECT_ID ?? "",
    storageUnitItemId: import.meta.env.VITE_BASEOPS_STORAGE_UNIT_ITEM_ID ?? "",
    characterObjectId: import.meta.env.VITE_BASEOPS_CHARACTER_OBJECT_ID ?? "",
    characterItemId: import.meta.env.VITE_BASEOPS_CHARACTER_ITEM_ID ?? "",
    corpseTypeId: import.meta.env.VITE_BASEOPS_CORPSE_TYPE_ID ?? "",
    corpseQuantity: import.meta.env.VITE_BASEOPS_CORPSE_QUANTITY ?? "1",
    recentDigests: import.meta.env.VITE_BASEOPS_RECENT_DIGESTS ?? "",
  };
}

export async function getRegistryAddress(worldPackageId: string): Promise<string> {
  const cached = registryAddressCache.get(worldPackageId);
  if (cached) {
    return cached;
  }

  const result = await getSingletonObjectByType(
    getWorldType(worldPackageId, "object_registry::ObjectRegistry"),
  );
  const address = result.data?.objects?.nodes?.[0]?.address;

  if (!isNonEmpty(address)) {
    throw new Error(`ObjectRegistry not found for ${worldPackageId}`);
  }

  registryAddressCache.set(worldPackageId, address);
  return address;
}

export async function deriveWorldObjectId(params: {
  worldPackageId: string;
  tenant: string;
  itemId: string;
}): Promise<string> {
  const registryAddress = await getRegistryAddress(params.worldPackageId);
  const keyBytes = TenantItemId.serialize({
    id: BigInt(toNumberString(params.itemId)),
    tenant: params.tenant.trim(),
  }).toBytes();

  return deriveObjectID(
    registryAddress,
    getWorldType(params.worldPackageId, "in_game_id::TenantItemId"),
    keyBytes,
  );
}

export async function resolveWorldObjectId(params: {
  worldPackageId: string;
  tenant: string;
  objectId?: string;
  itemId?: string;
  label: string;
}): Promise<string> {
  if (isNonEmpty(params.objectId)) {
    return params.objectId.trim();
  }

  if (isNonEmpty(params.itemId)) {
    return deriveWorldObjectId({
      worldPackageId: params.worldPackageId,
      tenant: params.tenant,
      itemId: params.itemId,
    });
  }

  throw new Error(`${params.label} requires either an object ID or an item ID.`);
}

export async function discoverWalletCharacter(params: {
  walletAddress: string;
  worldPackageId: string;
}): Promise<DiscoveredCharacter | null> {
  const profileType = `${params.worldPackageId}::character::PlayerProfile`;
  const ownedProfiles = await getOwnedObjectsByType(params.walletAddress, profileType);
  const playerProfileId = ownedProfiles.data?.address?.objects?.nodes?.[0]?.address;

  if (!isNonEmpty(playerProfileId)) {
    return null;
  }

  const playerProfileObject = await getObjectWithJson(playerProfileId);
  const playerProfileJson = parseJsonRecord(
    playerProfileObject.data?.object?.asMoveObject?.contents?.json,
  );
  const characterObjectId =
    typeof playerProfileJson?.character_id === "string"
      ? playerProfileJson.character_id
      : "";

  if (!isNonEmpty(characterObjectId)) {
    return null;
  }

  const characterObject = await getObjectWithJson(characterObjectId);
  const character = parseCharacterFromJson(
    characterObject.data?.object?.asMoveObject?.contents?.json,
  );

  if (!character) {
    return null;
  }

  const characterJson = parseJsonRecord(
    characterObject.data?.object?.asMoveObject?.contents?.json,
  );
  const ownerCapId =
    typeof characterJson?.owner_cap_id === "string" ? characterJson.owner_cap_id : "";

  return {
    characterObjectId,
    characterItemId: character.characterId,
    ownerCapId,
    name: character.name || "Unnamed Operator",
    tribeId: character.tribeId,
  };
}

export async function getCharacterOwnerCapId(params: {
  client: SuiJsonRpcClient;
  worldPackageId: string;
  worldCallPackageId?: string;
  characterId: string;
  senderAddress: string;
}): Promise<string> {
  const worldCallPackageId = params.worldCallPackageId?.trim() || params.worldPackageId;
  const tx = new Transaction();
  tx.moveCall({
    target: `${worldCallPackageId}::character::owner_cap_id`,
    arguments: [tx.object(params.characterId)],
  });

  const result = await params.client.devInspectTransactionBlock({
    sender: params.senderAddress,
    transactionBlock: tx,
  });

  if (result.effects?.status?.status !== "success") {
    throw new Error("Failed to resolve the character OwnerCap via dev inspect.");
  }

  const bytes = result.results?.[0]?.returnValues?.[0]?.[0];
  if (!bytes) {
    throw new Error("Character OwnerCap lookup returned no data.");
  }

  return bcs.Address.parse(Uint8Array.from(bytes));
}

async function getAssemblyOwnerCapId(params: {
  client: SuiJsonRpcClient;
  objectId: string;
  senderAddress: string;
  target: string;
}): Promise<string> {
  const tx = new Transaction();
  tx.moveCall({
    target: params.target,
    arguments: [tx.object(params.objectId)],
  });

  const result = await params.client.devInspectTransactionBlock({
    sender: params.senderAddress,
    transactionBlock: tx,
  });

  if (result.effects?.status?.status !== "success") {
    throw new Error(`Failed to resolve OwnerCap via ${params.target}.`);
  }

  const bytes = result.results?.[0]?.returnValues?.[0]?.[0];
  if (!bytes) {
    throw new Error(`OwnerCap lookup returned no data for ${params.objectId}.`);
  }

  return bcs.Address.parse(Uint8Array.from(bytes));
}

export async function getGateOwnerCapId(params: {
  client: SuiJsonRpcClient;
  worldPackageId: string;
  worldCallPackageId?: string;
  gateId: string;
  senderAddress: string;
}): Promise<string> {
  const worldCallPackageId = params.worldCallPackageId?.trim() || params.worldPackageId;
  return getAssemblyOwnerCapId({
    client: params.client,
    objectId: params.gateId,
    senderAddress: params.senderAddress,
    target: `${worldCallPackageId}::gate::owner_cap_id`,
  });
}

export async function getStorageUnitOwnerCapId(params: {
  client: SuiJsonRpcClient;
  worldPackageId: string;
  worldCallPackageId?: string;
  storageUnitId: string;
  senderAddress: string;
}): Promise<string> {
  const worldCallPackageId = params.worldCallPackageId?.trim() || params.worldPackageId;
  return getAssemblyOwnerCapId({
    client: params.client,
    objectId: params.storageUnitId,
    senderAddress: params.senderAddress,
    target: `${worldCallPackageId}::storage_unit::owner_cap_id`,
  });
}

export function resolveWorldCallPackageId(worldPackageId: string): string {
  const trimmed = worldPackageId.trim();
  if (trimmed === "0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75") {
    return "0x07e6b810c2dff6df56ea7fbad9ff32f4d84cbee53e496267515887b712924bd1";
  }
  return trimmed;
}

export async function getOwnedJumpPermitId(params: {
  client: SuiJsonRpcClient;
  owner: string;
  worldPackageId: string;
}): Promise<string | null> {
  const response = await params.client.getOwnedObjects({
    owner: params.owner,
    filter: {
      StructType: `${params.worldPackageId}::gate::JumpPermit`,
    },
    limit: 1,
  });

  return response.data?.[0]?.data?.objectId ?? null;
}

export async function getObjectReadback(params: {
  client: SuiJsonRpcClient;
  objectId: string;
}): Promise<ObjectReadback | null> {
  const result = await params.client.getObject({
    id: params.objectId,
    options: {
      showContent: true,
      showType: true,
      showPreviousTransaction: true,
    },
  });

  if (!result.data) {
    return null;
  }

  return {
    objectId: params.objectId,
    version: String(result.data.version),
    digest: result.data.previousTransaction ?? "",
    type: result.data.type ?? "unknown",
  };
}

async function waitForTransactionReadback(params: {
  client: SuiJsonRpcClient;
  digest: string;
}): Promise<Awaited<ReturnType<SuiJsonRpcClient["getTransactionBlock"]>>> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      return await params.client.getTransactionBlock({
        digest: params.digest,
        options: {
          showEffects: true,
          showEvents: true,
          showInput: true,
          showObjectChanges: true,
        },
      });
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 900));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Failed to fetch transaction ${params.digest}`);
}

export async function getTransactionReadback(params: {
  client: SuiJsonRpcClient;
  digest: string;
  kind: EventFeedEntry["kind"];
}): Promise<TxReadback> {
  const transaction = await waitForTransactionReadback(params);
  const timestamp = formatTimestamp(transaction.timestampMs ?? undefined);
  const events = transaction.events ?? [];
  const mutatedObjectIds = (transaction.objectChanges ?? [])
    .map((change) => ("objectId" in change ? change.objectId : null))
    .filter((value): value is string => Boolean(value));
  const status: EventFeedEntry["status"] =
    transaction.effects?.status?.status === "success" ? "success" : "error";

  const entries: EventFeedEntry[] =
    events.length > 0
      ? events.map((event, index) => {
          const eventType = event.type ?? "UnknownEvent";

          return {
            id: `${params.digest}-${index}`,
            digest: params.digest,
            time: timestamp,
            label: labelForEventType(eventType, params.kind),
            detail: describeParsedJson(event.parsedJson),
            kind: params.kind,
            status,
            eventType,
          };
        })
      : [
          {
            id: `${params.digest}-fallback`,
            digest: params.digest,
            time: timestamp,
            label: params.kind === "access" ? "Access mutation confirmed" : "Storage mutation confirmed",
            detail:
              mutatedObjectIds.length > 0
                ? `Mutated objects: ${mutatedObjectIds.slice(0, 3).join(", ")}`
                : "Transaction confirmed on-chain, but no parsed events were returned.",
            kind: params.kind,
            status,
          },
        ];

  return {
    digest: params.digest,
    status,
    mutatedObjectIds,
    entries,
  };
}

export function buildIssueJumpPermitTransaction(params: {
  builderPackageId: string;
  extensionConfigId: string;
  sourceGateId: string;
  destinationGateId: string;
  characterId: string;
}): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${params.builderPackageId}::tribe_permit::issue_jump_permit`,
    arguments: [
      tx.object(params.extensionConfigId),
      tx.object(params.sourceGateId),
      tx.object(params.destinationGateId),
      tx.object(params.characterId),
      tx.object(CLOCK_OBJECT_ID),
    ],
  });
  return tx;
}

export function buildCollectCorpseBountyTransaction(params: {
  worldPackageId: string;
  worldCallPackageId?: string;
  builderPackageId: string;
  extensionConfigId: string;
  sourceGateId: string;
  destinationGateId: string;
  storageUnitId: string;
  characterId: string;
  storageUnitOwnerCapId: string;
  corpseTypeId: string;
  quantity: string;
}): Transaction {
  const tx = new Transaction();
  const storageUnitType = `${params.worldPackageId}::storage_unit::StorageUnit`;
  const worldCallPackageId = params.worldCallPackageId?.trim() || params.worldPackageId;

  const [ownerCap, returnReceipt] = tx.moveCall({
    target: `${worldCallPackageId}::character::borrow_owner_cap`,
    typeArguments: [storageUnitType],
    arguments: [tx.object(params.characterId), tx.object(params.storageUnitOwnerCapId)],
  });

  tx.moveCall({
    target: `${params.builderPackageId}::corpse_gate_bounty::collect_corpse_bounty`,
    typeArguments: [storageUnitType],
    arguments: [
      tx.object(params.extensionConfigId),
      tx.object(params.storageUnitId),
      tx.object(params.sourceGateId),
      tx.object(params.destinationGateId),
      tx.object(params.characterId),
      ownerCap,
      tx.pure.u64(BigInt(toNumberString(params.corpseTypeId))),
      tx.pure.u32(Number(toNumberString(params.quantity))),
      tx.object(CLOCK_OBJECT_ID),
    ],
  });

  tx.moveCall({
    target: `${worldCallPackageId}::character::return_owner_cap`,
    typeArguments: [storageUnitType],
    arguments: [tx.object(params.characterId), ownerCap, returnReceipt],
  });

  return tx;
}

export function buildAuthorizeLiveRouteTransaction(params: {
  worldPackageId: string;
  worldCallPackageId?: string;
  builderPackageId: string;
  characterId: string;
  sourceGateId: string;
  sourceGateOwnerCapId: string;
  destinationGateId: string;
  destinationGateOwnerCapId: string;
  storageUnitId: string;
  storageUnitOwnerCapId: string;
}): Transaction {
  const tx = new Transaction();
  const worldCallPackageId = params.worldCallPackageId?.trim() || params.worldPackageId;
  const gateType = `${params.worldPackageId}::gate::Gate`;
  const storageType = `${params.worldPackageId}::storage_unit::StorageUnit`;
  const authType = `${params.builderPackageId}::config::XAuth`;

  const [sourceGateOwnerCap, sourceGateReceipt] = tx.moveCall({
    target: `${worldCallPackageId}::character::borrow_owner_cap`,
    typeArguments: [gateType],
    arguments: [tx.object(params.characterId), tx.object(params.sourceGateOwnerCapId)],
  });
  tx.moveCall({
    target: `${worldCallPackageId}::gate::authorize_extension`,
    typeArguments: [authType],
    arguments: [tx.object(params.sourceGateId), sourceGateOwnerCap],
  });
  tx.moveCall({
    target: `${worldCallPackageId}::character::return_owner_cap`,
    typeArguments: [gateType],
    arguments: [tx.object(params.characterId), sourceGateOwnerCap, sourceGateReceipt],
  });

  const [destinationGateOwnerCap, destinationGateReceipt] = tx.moveCall({
    target: `${worldCallPackageId}::character::borrow_owner_cap`,
    typeArguments: [gateType],
    arguments: [tx.object(params.characterId), tx.object(params.destinationGateOwnerCapId)],
  });
  tx.moveCall({
    target: `${worldCallPackageId}::gate::authorize_extension`,
    typeArguments: [authType],
    arguments: [tx.object(params.destinationGateId), destinationGateOwnerCap],
  });
  tx.moveCall({
    target: `${worldCallPackageId}::character::return_owner_cap`,
    typeArguments: [gateType],
    arguments: [tx.object(params.characterId), destinationGateOwnerCap, destinationGateReceipt],
  });

  const [storageOwnerCap, storageReceipt] = tx.moveCall({
    target: `${worldCallPackageId}::character::borrow_owner_cap`,
    typeArguments: [storageType],
    arguments: [tx.object(params.characterId), tx.object(params.storageUnitOwnerCapId)],
  });
  tx.moveCall({
    target: `${worldCallPackageId}::storage_unit::authorize_extension`,
    typeArguments: [authType],
    arguments: [tx.object(params.storageUnitId), storageOwnerCap],
  });
  tx.moveCall({
    target: `${worldCallPackageId}::character::return_owner_cap`,
    typeArguments: [storageType],
    arguments: [tx.object(params.characterId), storageOwnerCap, storageReceipt],
  });

  return tx;
}
