import {
  Assemblies,
  abbreviateAddress,
  useSmartObject,
} from "@evefrontier/dapp-kit";
import {
  useCurrentAccount,
  useCurrentNetwork,
  useDAppKit,
} from "@mysten/dapp-kit-react";
import { useEffect, useState } from "react";
import {
  buildAuthorizeLiveRouteTransaction,
  buildCollectCorpseBountyTransaction,
  buildIssueJumpPermitTransaction,
  createRpcClient,
  discoverWalletCharacter,
  type DiscoveredCharacter,
  type EventFeedEntry,
  getGateOwnerCapId,
  getDefaultRuntimeConfig,
  getObjectReadback,
  getOwnedJumpPermitId,
  getStorageUnitOwnerCapId,
  getTransactionReadback,
  getCharacterOwnerCapId,
  resolveWorldCallPackageId,
  resolveWorldObjectId,
  type BaseOpsRuntimeConfig,
} from "./baseops";
import { AppIcon } from "./AppIcon";
import { frontierMedia } from "./frontierMedia";
import { formatTemplate, useI18n } from "./i18n";

const STORAGE_KEY = "frontier-baseops-runtime-config:v4";

const OFFICIAL_UTOPIA_WORLD_PACKAGE_ID =
  "0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75";

const LOCALNET_DEMO_PROFILE: Partial<BaseOpsRuntimeConfig> = {
  tenant: "dev",
  rpcUrl: "http://127.0.0.1:9000",
  worldPackageId: "0x7f5837a27fa739c8b18aabeb4c3fe5a54cf3d89167c115d1067acbc111b90da3",
  builderPackageId: "0x24297582d94b483e3aba826c7a27f18199402a32c79ea22a42683858c928029e",
  extensionConfigId: "0x8030a20fe16cdf934ab00f0af2694e5a9a1ea82faf09322a1304515b8cd2f022",
  sourceGateObjectId: "0x3874abd2cadf5e840bd108c742596d37ee0e6a785a20a3bd2e3e84376231e9fd",
  sourceGateItemId: "90185",
  destinationGateObjectId: "0x9592302250a4bcf03cf0304d648dba4f8048c7931788e1b446ded6d798033008",
  destinationGateItemId: "90186",
  storageUnitObjectId: "0x86ed3945fc52d633fd8cafae21b7404f11781930fdf9912ea8844b0cd668a430",
  storageUnitItemId: "888800006",
  characterObjectId: "0xfdcb693951a7d401f761a342cbc5fb4206152aa2abaab4b4e503b7bfacd2d057",
  characterItemId: "900000001",
  corpseTypeId: "446",
  corpseQuantity: "1",
  recentDigests:
    "Gw4RKyzHw5F3K3bShnk6u1H89ApKiyjpTQw3rcvSB68a,9HQGjf8Gxd1KVS3hfjXrZaJQ4PiGgCuvGsTquUS9P4kh,327ubsAVYEFJh8TKi4V1ZNYs59wfz7gEXS42NydTFxhC",
};

const UTOPIA_WORLD_PROFILE: Partial<BaseOpsRuntimeConfig> = {
  tenant: "utopia",
  rpcUrl: "https://fullnode.testnet.sui.io:443",
  worldPackageId: OFFICIAL_UTOPIA_WORLD_PACKAGE_ID,
  builderPackageId: "0x34c884b88860af000965b80eebe74c52a6a64d79b44a70b77278d44e436aab56",
  extensionConfigId: "0xb395adba3e55fabcaaa7f200d068224e01f43b59732c8a69b7f6d6c8187942e4",
  sourceGateObjectId: "0x81a1818311b41511c66a91146e5cac404748918abde3ab6ccca9bc3398a62940",
  sourceGateItemId: "1000000023120",
  destinationGateObjectId: "0x84cdf964babb640b1f62da75d71c392c57563cc51b69b63a59f6c8f3b42f0884",
  destinationGateItemId: "1000000023122",
  storageUnitObjectId: "0x69d370ef18f0c6dd4dc70032d6912dc49d488668dda46448624007e225f7b3d5",
  storageUnitItemId: "1000000023116",
  characterObjectId: "0xc7bee895a266a87cf32d4db6c2c5567dd5c46192d2ba6b51a2bc23c139db7aa4",
  characterItemId: "2112000086",
  corpseTypeId: "446",
  corpseQuantity: "1",
  recentDigests: "",
};

const TESTNET_BUILDER_PROFILE: Partial<BaseOpsRuntimeConfig> = {
  tenant: "dev",
  rpcUrl: "https://fullnode.testnet.sui.io:443",
  worldPackageId: "0x284dde8463dc1888671287ff330d1cc6757c08b56c19cbef3fe85e0c1447f9d2",
  builderPackageId: "0x522f00da02494c4bc6feddb4d3a964c822cfdf0fb439849f074544b59ed86882",
  extensionConfigId: "0x25a3ca9edd24a19be1cb7874844d14ebcc982679c180316c82c12581d1445e93",
  sourceGateObjectId: "0xc5c4135678039b15960dc52136732f50a84458f6457ecc5b803ccdb9fcbd5eda",
  sourceGateItemId: "90185",
  destinationGateObjectId: "0x5b497d6b228311de0f86e48065d10c2fcc3b99a299bb389224d3202409b92a30",
  destinationGateItemId: "90186",
  storageUnitObjectId: "0xf975428edf3dd09364afb609179656cde5a3ad5aa17c72268951839573fd7eb0",
  storageUnitItemId: "888800006",
  characterObjectId: "0xd7cf4a82fdb2671ebe20ec3d390a8e33b77daaa498272f4038939347f88b28c8",
  characterItemId: "900000001",
  corpseTypeId: "446",
  corpseQuantity: "1",
  recentDigests:
    "95yHMjVHfdUw6wF61b5kTzVv1nW8Vop6wbSjb7hvds7s,6HyWNKRp4oLuRVx3M7qvXb45hZVNmSQei2DYkhGitkbm,Gqx4a1einjozQyJAbCcsz9gFtoy1kpaZby1EBABdkwaR",
};

type OperationState = {
  pending: boolean;
  message: string;
  status: "idle" | "success" | "error";
};

type PermitState = {
  permitId: string | null;
  lastDigest: string;
};

function loadStoredConfig(): BaseOpsRuntimeConfig {
  const defaults = { ...getDefaultRuntimeConfig(), ...UTOPIA_WORLD_PROFILE };
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return defaults;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<BaseOpsRuntimeConfig>;
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

function resolveAssemblyHints(assembly: ReturnType<typeof useSmartObject>["assembly"]) {
  const gateAssembly = assembly?.type === Assemblies.SmartGate ? assembly : null;
  const storageAssembly = assembly?.type === Assemblies.SmartStorageUnit ? assembly : null;

  return {
    sourceGateObjectId: gateAssembly?.id ?? "",
    sourceGateItemId: gateAssembly ? String(gateAssembly.item_id) : "",
    destinationGateObjectId: gateAssembly?.gate.destinationGate?.id ?? "",
    destinationGateItemId: gateAssembly?.gate.destinationGate?.key?.item_id ?? "",
    storageUnitObjectId: storageAssembly?.id ?? "",
    storageUnitItemId: storageAssembly ? String(storageAssembly.item_id) : "",
  };
}

function ConfigField({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <label className="cmd-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          className="cmd-textarea"
          rows={3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

export function BaseOpsPanels() {
  const { m } = useI18n();
  const dAppKit = useDAppKit();
  const currentAccount = useCurrentAccount();
  const currentNetwork = useCurrentNetwork();
  const activeNetwork =
    currentNetwork === "localnet" || currentNetwork === "devnet"
      ? currentNetwork
      : "testnet";
  const { assembly, refetch } = useSmartObject();

  const [config, setConfig] = useState<BaseOpsRuntimeConfig>(() => loadStoredConfig());
  const [discoveredCharacter, setDiscoveredCharacter] =
    useState<DiscoveredCharacter | null>(null);
  const [feed, setFeed] = useState<EventFeedEntry[]>([]);
  const [accessState, setAccessState] = useState<OperationState>({
    pending: false,
    message: m.console.statusMessages.waiting,
    status: "idle",
  });
  const [storageState, setStorageState] = useState<OperationState>({
    pending: false,
    message: m.console.statusMessages.waiting,
    status: "idle",
  });
  const [authState, setAuthState] = useState<OperationState>({
    pending: false,
    message: "Waiting to authorize the live route.",
    status: "idle",
  });
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [permitState, setPermitState] = useState<PermitState>({
    permitId: null,
    lastDigest: "",
  });
  const [storageReadback, setStorageReadback] = useState<string>("");
  const [replayPending, setReplayPending] = useState(false);
  const [autoReplayDone, setAutoReplayDone] = useState(false);

  useEffect(() => {
    setAccessState((current) =>
      current.status === "idle"
        ? { ...current, message: m.console.statusMessages.waiting }
        : current,
    );
    setStorageState((current) =>
      current.status === "idle"
        ? { ...current, message: m.console.statusMessages.waiting }
        : current,
    );
  }, [m.console.statusMessages.waiting]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    let cancelled = false;

    async function hydrateCharacter() {
      if (!currentAccount?.address || !config.worldPackageId.trim()) {
        if (!cancelled) {
          setDiscoveredCharacter(null);
        }
        return;
      }

      try {
        const discovered = await discoverWalletCharacter({
          walletAddress: currentAccount.address,
          worldPackageId: config.worldPackageId.trim(),
        });

        if (!cancelled) {
          setDiscoveredCharacter(discovered);
          if (discovered && !config.characterObjectId && !config.characterItemId) {
            setConfig((current) => ({
              ...current,
              characterObjectId: discovered.characterObjectId,
              characterItemId: String(discovered.characterItemId),
            }));
          }
        }
      } catch {
        if (!cancelled) {
          setDiscoveredCharacter(null);
        }
      }
    }

    hydrateCharacter();

    return () => {
      cancelled = true;
    };
  }, [currentAccount?.address, config.worldPackageId]);

  useEffect(() => {
    let cancelled = false;

    async function hydratePermit() {
      if (!currentAccount?.address || !config.worldPackageId.trim()) {
        if (!cancelled) {
          setPermitState({ permitId: null, lastDigest: "" });
        }
        return;
      }

      try {
        const client = createRpcClient(activeNetwork, config.rpcUrl);
        const permitId = await getOwnedJumpPermitId({
          client,
          owner: currentAccount.address,
          worldPackageId: config.worldPackageId.trim(),
        });

        if (!cancelled) {
          setPermitState((current) => ({ ...current, permitId }));
        }
      } catch {
        if (!cancelled) {
          setPermitState((current) => ({ ...current, permitId: null }));
        }
      }
    }

    hydratePermit();

    return () => {
      cancelled = true;
    };
  }, [currentAccount?.address, currentNetwork, config.rpcUrl, config.worldPackageId]);

  const assemblyHints = resolveAssemblyHints(assembly);
  const effectiveSourceGateObjectId = config.sourceGateObjectId || assemblyHints.sourceGateObjectId;
  const effectiveSourceGateItemId = config.sourceGateItemId || assemblyHints.sourceGateItemId;
  const effectiveDestinationGateObjectId =
    config.destinationGateObjectId || assemblyHints.destinationGateObjectId;
  const effectiveDestinationGateItemId =
    config.destinationGateItemId || assemblyHints.destinationGateItemId;
  const effectiveStorageUnitObjectId =
    config.storageUnitObjectId || assemblyHints.storageUnitObjectId;
  const effectiveStorageUnitItemId = config.storageUnitItemId || assemblyHints.storageUnitItemId;
  const effectiveCharacterObjectId =
    config.characterObjectId || discoveredCharacter?.characterObjectId || "";
  const effectiveCharacterItemId =
    config.characterItemId ||
    (discoveredCharacter ? String(discoveredCharacter.characterItemId) : "");
  const runtimeCoverage = [
    config.worldPackageId.trim(),
    config.builderPackageId.trim(),
    config.extensionConfigId.trim(),
    effectiveSourceGateObjectId || effectiveSourceGateItemId,
    effectiveDestinationGateObjectId || effectiveDestinationGateItemId,
    effectiveCharacterObjectId || effectiveCharacterItemId,
    effectiveStorageUnitObjectId || effectiveStorageUnitItemId,
  ].filter(Boolean).length;
  const accessReady = Boolean(
    currentAccount?.address &&
      config.worldPackageId.trim() &&
      config.builderPackageId.trim() &&
      config.extensionConfigId.trim() &&
      (effectiveSourceGateObjectId || effectiveSourceGateItemId) &&
      (effectiveDestinationGateObjectId || effectiveDestinationGateItemId) &&
      (effectiveCharacterObjectId || effectiveCharacterItemId),
  );
  const storageReady = Boolean(
    accessReady &&
      (effectiveStorageUnitObjectId || effectiveStorageUnitItemId) &&
      config.corpseTypeId.trim(),
  );
  const replayDigests = config.recentDigests
    .split(/[\n,]/)
    .map((value) => value.trim())
    .filter(Boolean);

  async function resolveTargets(includeStorage: boolean) {
    const worldPackageId = config.worldPackageId.trim();
    const tenant = config.tenant.trim();

    const sourceGateId = await resolveWorldObjectId({
      worldPackageId,
      tenant,
      objectId: effectiveSourceGateObjectId,
      itemId: effectiveSourceGateItemId,
      label: "Source gate",
    });

    const destinationGateId = await resolveWorldObjectId({
      worldPackageId,
      tenant,
      objectId: effectiveDestinationGateObjectId,
      itemId: effectiveDestinationGateItemId,
      label: "Destination gate",
    });

    const characterId = await resolveWorldObjectId({
      worldPackageId,
      tenant,
      objectId: effectiveCharacterObjectId,
      itemId: effectiveCharacterItemId,
      label: "Character",
    });

    if (!includeStorage) {
      return { sourceGateId, destinationGateId, characterId };
    }

    const storageUnitId = await resolveWorldObjectId({
      worldPackageId,
      tenant,
      objectId: effectiveStorageUnitObjectId,
      itemId: effectiveStorageUnitItemId,
      label: "Storage unit",
    });

    return {
      sourceGateId,
      destinationGateId,
      characterId,
      storageUnitId,
    };
  }

  async function appendReadbackEntries(digest: string, kind: EventFeedEntry["kind"]) {
    const client = createRpcClient(activeNetwork, config.rpcUrl);
    const readback = await getTransactionReadback({ client, digest, kind });

    setFeed((current) => [...readback.entries, ...current].slice(0, 12));
    if (kind === "access") {
      const permitId = currentAccount?.address
        ? await getOwnedJumpPermitId({
            client,
            owner: currentAccount.address,
            worldPackageId: config.worldPackageId.trim(),
          })
        : null;
      setPermitState({ permitId, lastDigest: digest });
    }

    if (kind === "storage" && readback.mutatedObjectIds.length > 0) {
      const objectId = readback.mutatedObjectIds[0];
      const snapshot = await getObjectReadback({ client, objectId });
      setStorageReadback(
        snapshot
          ? `${snapshot.objectId} · v${snapshot.version} · ${snapshot.type}`
          : readback.mutatedObjectIds.join(", "),
      );
    }
  }

  async function handleAccessMutation() {
    if (!currentAccount?.address) {
      setAccessState({
        pending: false,
        message: m.console.statusMessages.connectPermit,
        status: "error",
      });
      return;
    }

    if (!config.worldPackageId.trim() || !config.builderPackageId.trim() || !config.extensionConfigId.trim()) {
      setAccessState({
        pending: false,
        message: m.console.statusMessages.missingAccess,
        status: "error",
      });
      return;
    }

    setAccessState({
      pending: true,
      message: m.console.statusMessages.buildingAccess,
      status: "idle",
    });

    try {
      const targets = await resolveTargets(false);
      const transaction = buildIssueJumpPermitTransaction({
        builderPackageId: config.builderPackageId.trim(),
        extensionConfigId: config.extensionConfigId.trim(),
        sourceGateId: targets.sourceGateId,
        destinationGateId: targets.destinationGateId,
        characterId: targets.characterId,
      });

      const result = await dAppKit.signAndExecuteTransaction({ transaction });
      const digest = result.$kind === "Transaction"
        ? result.Transaction.digest
        : result.FailedTransaction.digest;

      await appendReadbackEntries(digest, "access");
      await refetch();
      setAccessState({
        pending: false,
        message: `${m.console.statusMessages.permitConfirmedPrefix}: ${digest}`,
        status: "success",
      });
    } catch (error) {
      setAccessState({
        pending: false,
        message: error instanceof Error ? error.message : m.console.statusMessages.accessFailed,
        status: "error",
      });
    }
  }

  async function handleStorageMutation() {
    if (!currentAccount?.address) {
      setStorageState({
        pending: false,
        message: m.console.statusMessages.connectStorage,
        status: "error",
      });
      return;
    }

    if (
      !config.worldPackageId.trim() ||
      !config.builderPackageId.trim() ||
      !config.extensionConfigId.trim() ||
      !config.corpseTypeId.trim()
    ) {
      setStorageState({
        pending: false,
        message: m.console.statusMessages.missingStorage,
        status: "error",
      });
      return;
    }

    setStorageState({
      pending: true,
      message: m.console.statusMessages.buildingStorage,
      status: "idle",
    });

    try {
      const targets = await resolveTargets(true);
      const client = createRpcClient(activeNetwork, config.rpcUrl);
      const worldCallPackageId = resolveWorldCallPackageId(config.worldPackageId.trim());
      const characterOwnerCapId = await getCharacterOwnerCapId({
        client,
        worldPackageId: config.worldPackageId.trim(),
        worldCallPackageId,
        characterId: targets.characterId,
        senderAddress: currentAccount.address,
      });

      const transaction = buildCollectCorpseBountyTransaction({
        worldPackageId: config.worldPackageId.trim(),
        worldCallPackageId,
        builderPackageId: config.builderPackageId.trim(),
        extensionConfigId: config.extensionConfigId.trim(),
        sourceGateId: targets.sourceGateId,
        destinationGateId: targets.destinationGateId,
        storageUnitId: targets.storageUnitId ?? "",
        characterId: targets.characterId,
        characterOwnerCapId,
        corpseTypeId: config.corpseTypeId.trim(),
        quantity: config.corpseQuantity.trim() || "1",
      });

      const result = await dAppKit.signAndExecuteTransaction({ transaction });
      const digest = result.$kind === "Transaction"
        ? result.Transaction.digest
        : result.FailedTransaction.digest;

      await appendReadbackEntries(digest, "storage");
      await refetch();
      setStorageState({
        pending: false,
        message: `${m.console.statusMessages.storageConfirmedPrefix}: ${digest}`,
        status: "success",
      });
    } catch (error) {
      setStorageState({
        pending: false,
        message: error instanceof Error ? error.message : m.console.statusMessages.storageFailed,
        status: "error",
      });
    }
  }

  async function handleAuthoriseLiveRoute() {
    if (!currentAccount?.address) {
      setAuthState({
        pending: false,
        message: "Connect a wallet before authorizing the live route.",
        status: "error",
      });
      return;
    }

    if (!config.worldPackageId.trim() || !config.builderPackageId.trim() || !config.extensionConfigId.trim()) {
      setAuthState({
        pending: false,
        message: "World package, builder package, and extension config are required before route authorization.",
        status: "error",
      });
      return;
    }

    setAuthState({
      pending: true,
      message: "Borrowing gate and storage OwnerCaps for live route authorization...",
      status: "idle",
    });

    try {
      const targets = await resolveTargets(true);
      const client = createRpcClient(activeNetwork, config.rpcUrl);
      const worldPackageId = config.worldPackageId.trim();
      const worldCallPackageId = resolveWorldCallPackageId(worldPackageId);

      const [sourceGateOwnerCapId, destinationGateOwnerCapId, storageUnitOwnerCapId] = await Promise.all([
        getGateOwnerCapId({
          client,
          worldPackageId,
          worldCallPackageId,
          gateId: targets.sourceGateId,
          senderAddress: currentAccount.address,
        }),
        getGateOwnerCapId({
          client,
          worldPackageId,
          worldCallPackageId,
          gateId: targets.destinationGateId,
          senderAddress: currentAccount.address,
        }),
        getStorageUnitOwnerCapId({
          client,
          worldPackageId,
          worldCallPackageId,
          storageUnitId: targets.storageUnitId ?? "",
          senderAddress: currentAccount.address,
        }),
      ]);

      const transaction = buildAuthorizeLiveRouteTransaction({
        worldPackageId,
        worldCallPackageId,
        builderPackageId: config.builderPackageId.trim(),
        characterId: targets.characterId,
        sourceGateId: targets.sourceGateId,
        sourceGateOwnerCapId,
        destinationGateId: targets.destinationGateId,
        destinationGateOwnerCapId,
        storageUnitId: targets.storageUnitId ?? "",
        storageUnitOwnerCapId,
      });

      const result = await dAppKit.signAndExecuteTransaction({ transaction });
      const digest = result.$kind === "Transaction"
        ? result.Transaction.digest
        : result.FailedTransaction.digest;

      await appendReadbackEntries(digest, "system");
      await refetch();
      setAuthState({
        pending: false,
        message: `Live route authorized on-chain: ${digest}`,
        status: "success",
      });
    } catch (error) {
      setAuthState({
        pending: false,
        message: error instanceof Error ? error.message : "Live route authorization failed.",
        status: "error",
      });
    }
  }

  async function handleReplayDigests() {
    const digests = replayDigests;

    if (digests.length === 0) {
      return;
    }

    setReplayPending(true);
    try {
      const client = createRpcClient(activeNetwork, config.rpcUrl);
      const entries = [] as EventFeedEntry[];

      for (const digest of digests.slice(0, 4)) {
        const readback = await getTransactionReadback({
          client,
          digest,
          kind: "system",
        });
        entries.push(...readback.entries);
      }

      setFeed((current) => entries.concat(current).slice(0, 12));
    } finally {
      setReplayPending(false);
    }
  }

  function loadDemoProfile(profile: Partial<BaseOpsRuntimeConfig>) {
    setConfig((current) => ({ ...current, ...profile }));
    setFeed([]);
    setAutoReplayDone(false);
  }

  useEffect(() => {
    if (autoReplayDone || replayPending || replayDigests.length === 0 || feed.length > 0) {
      return;
    }

    setAutoReplayDone(true);
    void handleReplayDigests();
  }, [autoReplayDone, replayPending, replayDigests, feed.length]);

  const liveProofCount = Math.max(feed.length, replayDigests.length);
  const runtimePercent = Math.round((runtimeCoverage / 7) * 100);
  const activePermitCount = permitState.permitId ? 1 : 0;
  const securityAlertCount =
    feed.filter((entry) => entry.status === "error").length +
    (accessState.status === "error" ? 1 : 0) +
    (storageState.status === "error" ? 1 : 0);
  const storageLoadPercent = storageReadback ? 84 : storageReady ? 67 : 24;
  const sourceGateLabel = effectiveSourceGateItemId || abbreviateAddress(effectiveSourceGateObjectId || "unset");
  const destinationGateLabel =
    effectiveDestinationGateItemId || abbreviateAddress(effectiveDestinationGateObjectId || "unset");
  const storageLabel = effectiveStorageUnitItemId || abbreviateAddress(effectiveStorageUnitObjectId || "unset");
  const infraNodes = [
    {
      label: m.console.infra.nodes.source,
      status: accessReady ? m.console.infra.nodes.operational : m.console.infra.nodes.pendingConfig,
      metric: `${m.console.infra.nodes.idPrefix}: ${sourceGateLabel || m.console.common.none}`,
      tone: accessReady ? "ok" : "warn",
      percent: accessReady ? 82 : 34,
    },
    {
      label: m.console.infra.nodes.destination,
      status: accessReady ? m.console.infra.nodes.linked : m.console.infra.nodes.awaitingRoute,
      metric: `${m.console.infra.nodes.idPrefix}: ${destinationGateLabel || m.console.common.none}`,
      tone: accessReady ? "neutral" : "warn",
      percent: accessReady ? 72 : 28,
    },
    {
      label: m.console.infra.nodes.storage,
      status: storageReady ? m.console.infra.nodes.readyForHandoff : m.console.infra.nodes.degradedSetup,
      metric: `${m.console.infra.nodes.idPrefix}: ${storageLabel || m.console.common.none}`,
      tone: storageReady ? "ok" : "error",
      percent: storageReady ? 84 : 22,
    },
  ] as const;
  const latestFeedEntries = feed.slice(0, 3);
  const operatorManualCards = m.console.manual.cards;
  const operatorSteps = m.console.manual.steps.map((step) =>
    formatTemplate(step, { network: activeNetwork }),
  );
  const judgeScriptLines = m.console.manual.judgeLines;

  return (
    <>
      <section className="cmd-hero" id="hero">
        <div className="cmd-hero-copy">
          <div className="cmd-hero-kicker-row">
            <span className="cmd-kicker-chip">{m.console.hero.kicker}</span>
            <span className="cmd-kicker-meta">{m.console.hero.meta}</span>
          </div>
          <h1 className="cmd-hero-title">
            {m.console.hero.titleBefore} <span>{m.console.hero.titleAccent}</span>
          </h1>
          <p className="cmd-hero-description">{m.console.hero.description}</p>
          <div className="cmd-hero-metrics">
            <article className="cmd-metric-card">
              <div className="cmd-metric-label">{m.console.hero.metrics.liveProofs}</div>
              <div className="cmd-metric-value">{liveProofCount.toString().padStart(2, "0")}</div>
            </article>
            <article className="cmd-metric-card">
              <div className="cmd-metric-label cmd-metric-label-success">{m.console.hero.metrics.runtime}</div>
              <div className="cmd-metric-value">{runtimePercent}</div>
            </article>
          </div>
        </div>

        <div className="cmd-hero-stage">
          <img
            alt="industrial frontier station"
            className="cmd-hero-stage-image"
            src={frontierMedia.launchArtHorizontal}
          />
          <div className="cmd-hero-stage-scrim" />
          <div className="cmd-hero-stage-camera">
            <AppIcon name="videocam" />
          </div>
          <div className="cmd-hero-stage-readout">
            <div className="cmd-hero-stage-lines">
              <div><span className="cmd-readout-dot" /> {m.console.hero.readouts.radarLock}</div>
              <div><span className="cmd-readout-dot" /> {m.console.hero.readouts.transit}</div>
            </div>
            <div className="cmd-hero-progress"><span style={{ width: `${Math.min(100, runtimePercent)}%` }} /></div>
          </div>
        </div>
      </section>

      <section className="cmd-manual-card" id="operator-manual">
        <div className="cmd-manual-hero">
          <div className="cmd-manual-copy">
            <div className="cmd-kicker-chip">{m.console.manual.pill}</div>
            <h2>{m.console.manual.title}</h2>
            <p>{m.console.manual.description}</p>
          </div>
          <div className="cmd-manual-visual">
            <img alt="Frontier operator manual visual" src={frontierMedia.launchArtHorizontal} />
          </div>
        </div>

        <div className="cmd-manual-grid">
          {operatorManualCards.map((card) => (
            <article className="cmd-manual-mini-card" key={card.label}>
              <div className="cmd-manual-mini-label">{card.label}</div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>

        <div className="cmd-manual-actions">
          <button className="cmd-primary-cta" onClick={() => loadDemoProfile(UTOPIA_WORLD_PROFILE)} type="button">
            {m.console.manual.actions.utopia}
          </button>
          <button className="cmd-secondary-cta" onClick={() => loadDemoProfile(TESTNET_BUILDER_PROFILE)} type="button">
            {m.console.manual.actions.builderTestnet}
          </button>
          <button className="cmd-secondary-cta" onClick={() => loadDemoProfile(LOCALNET_DEMO_PROFILE)} type="button">
            {m.console.manual.actions.localnet}
          </button>
        </div>

        <div className="cmd-manual-steps">
          {operatorSteps.map((step, index) => (
            <div className="cmd-manual-step" key={step}>
              <div className="cmd-manual-step-index">0{index + 1}</div>
              <p>{step}</p>
            </div>
          ))}
        </div>

        <div className="cmd-judge-card">
          <div className="cmd-log-header">
            <h3>{m.console.manual.judgeTitle}</h3>
          </div>
          <div className="cmd-judge-lines">
            {judgeScriptLines.map((line, index) => (
              <div className="cmd-judge-line" key={line}>
                <span className="cmd-judge-index">0{index + 1}</span>
                <p>{line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cmd-workspace">
        <section className="cmd-main-column">
          <div className="cmd-summary-grid">
            <article className="cmd-summary-card cmd-summary-card-accent">
              <div className="cmd-summary-label">{m.console.summary.gateStatus}</div>
              <div className="cmd-summary-row">
                <div className="cmd-summary-value">{accessReady ? m.console.summary.operational : m.console.summary.unconfigured}</div>
                <AppIcon className="cmd-summary-icon cmd-summary-icon-success" name="check_circle" />
              </div>
            </article>
            <article className="cmd-summary-card">
              <div className="cmd-summary-label">{m.console.summary.activePermits}</div>
              <div className="cmd-summary-row">
                <div className="cmd-summary-value">{String(activePermitCount).padStart(2, "0")}</div>
                <AppIcon className="cmd-summary-icon" name="badge" />
              </div>
            </article>
            <article className="cmd-summary-card">
              <div className="cmd-summary-label">{m.console.summary.storageLoad}</div>
              <div className="cmd-summary-row">
                <div className="cmd-summary-value">{storageLoadPercent}%</div>
                <div className="cmd-inline-progress"><span style={{ width: `${storageLoadPercent}%` }} /></div>
              </div>
            </article>
            <article className="cmd-summary-card cmd-summary-card-warning">
              <div className="cmd-summary-label">{m.console.summary.securityAlerts}</div>
              <div className="cmd-summary-row">
                <div className="cmd-summary-value cmd-summary-value-warning">{String(securityAlertCount).padStart(2, "0")}</div>
                <AppIcon className="cmd-summary-icon cmd-summary-icon-warning" name="warning" />
              </div>
            </article>
          </div>

          <div className="cmd-action-grid">
            <article className="cmd-action-card" id="gate-control">
              <div className="cmd-action-header">
                <div>
                  <h3>{m.console.gate.title}</h3>
                  <p>{m.console.gate.unitId}: {effectiveSourceGateItemId || m.console.common.unsetGate}</p>
                </div>
                <span className="cmd-status-chip cmd-status-chip-success">{m.console.gate.active}</span>
              </div>

              <div className="cmd-destination-row">
                <div className="cmd-destination-box">
                  <span>{m.console.gate.destination}</span>
                  <strong>{effectiveDestinationGateItemId || effectiveDestinationGateObjectId || m.console.common.unsetRoute}</strong>
                </div>
                <button className="cmd-square-button" onClick={() => void refetch()} type="button">
                  <AppIcon name="sync_alt" />
                </button>
              </div>

              <div className="cmd-action-buttons">
                <button
                  className="cmd-primary-cta"
                  disabled={accessState.pending || !accessReady}
                  onClick={() => void handleAccessMutation()}
                  type="button"
                >
                  {accessState.pending ? m.console.gate.issuingPermit : m.console.gate.issuePermit}
                </button>
                <button className="cmd-secondary-cta" disabled onClick={() => {}} type="button">
                  {m.console.gate.initiateWarp}
                </button>
              </div>

              {accessState.status !== "idle" ? (
                <div className={accessState.status === "error" ? "cmd-feedback cmd-feedback-error" : "cmd-feedback"}>
                  {accessState.message}
                </div>
              ) : null}
            </article>

            <article className="cmd-action-card" id="storage-logistics">
              <div className="cmd-action-header">
                <div>
                  <h3>{m.console.storage.title}</h3>
                  <p>{m.console.storage.unitId}: {effectiveStorageUnitItemId || m.console.common.unsetStorage}</p>
                </div>
                <span className="cmd-status-chip">{m.console.storage.mode}</span>
              </div>

              <div className="cmd-storage-bars">
                <div>
                  <div className="cmd-storage-row"><span>{m.console.storage.fuelRods}</span><span>{storageLoadPercent * 100} / 10000</span></div>
                  <div className="cmd-storage-bar"><span style={{ width: `${storageLoadPercent}%` }} /></div>
                </div>
                <div>
                  <div className="cmd-storage-row"><span>{m.console.storage.assetType}</span><span>{config.corpseTypeId || m.console.common.none}</span></div>
                  <div className="cmd-storage-bar"><span style={{ width: `${Math.max(14, Math.min(100, runtimePercent - 12))}%` }} /></div>
                </div>
              </div>

              <button
                className="cmd-block-button"
                disabled={storageState.pending || !storageReady}
                onClick={() => void handleStorageMutation()}
                type="button"
              >
                {storageState.pending ? m.console.storage.running : m.console.storage.override}
              </button>

              {storageState.status !== "idle" ? (
                <div className={storageState.status === "error" ? "cmd-feedback cmd-feedback-error" : "cmd-feedback"}>
                  {storageState.message}
                </div>
              ) : null}
            </article>
          </div>

          <article className="cmd-log-card" id="proof-timeline">
            <div className="cmd-log-header">
              <h3>{m.console.log.title}</h3>
              <button className="cmd-link-button" disabled={replayPending || replayDigests.length === 0} onClick={() => void handleReplayDigests()} type="button">
                {replayPending ? m.console.log.refreshing : m.console.log.export}
              </button>
            </div>

            <div className="cmd-log-list">
              {(latestFeedEntries.length > 0 ? latestFeedEntries : [
                {
                  id: "placeholder-a",
                  label: m.console.log.placeholderTitle,
                  detail: m.console.log.placeholderDetail,
                  time: "T+ 00:00:00",
                  status: "success",
                  kind: "access" as const,
                  digest: m.console.common.noDigest,
                },
              ]).map((entry, index) => (
                <article
                  className={entry.status === "error" ? "cmd-log-item cmd-log-item-error" : "cmd-log-item"}
                  key={entry.id}
                >
                  <AppIcon
                    className="cmd-log-icon"
                    name={entry.status === "error" ? "security" : index === 0 ? "verified_user" : "toll"}
                  />
                  <div className="cmd-log-content">
                    <div className="cmd-log-title-row">
                      <span className={entry.status === "error" ? "cmd-log-title cmd-log-title-error" : "cmd-log-title"}>
                        {entry.label.toUpperCase().replace(/\s+/g, "_")}
                      </span>
                      <span className="cmd-log-time">{entry.time}</span>
                    </div>
                    <p>{entry.detail}</p>
                    <code>{entry.digest}</code>
                  </div>
                  <AppIcon className="cmd-log-open" name="open_in_new" />
                </article>
              ))}
            </div>
          </article>
        </section>

        <aside className="cmd-side-column">
          <article className="cmd-infra-card" id="infra-state">
            <h3><span className="cmd-readout-dot" /> {m.console.infra.title}</h3>
            <div className="cmd-infra-list">
              {infraNodes.map((node) => (
                <div className="cmd-infra-node" key={node.label}>
                  <div className={`cmd-infra-node-dot cmd-infra-node-dot-${node.tone}`} />
                  <div className="cmd-infra-node-body">
                    <div className="cmd-infra-node-label">{node.label}</div>
                    <div className="cmd-infra-node-row">
                      <div className="cmd-infra-state-bar">
                        <span className={`cmd-infra-state-fill cmd-infra-state-fill-${node.tone}`} style={{ width: `${node.percent}%` }} />
                        <strong>{node.status}</strong>
                      </div>
                      <span className={`cmd-infra-metric cmd-infra-metric-${node.tone}`}>{node.metric}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="cmd-map-card">
            <img alt="sector mapping" src={frontierMedia.asteroidDebris} />
            <div className="cmd-map-overlay">
              <div className="cmd-map-title">{m.console.infra.mapTitle}</div>
              <p>{formatTemplate(m.console.infra.mapDescription, { count: runtimeCoverage })}</p>
            </div>
          </article>

          <article className="cmd-delegate-card" id="delegate-execution">
            <h3>{m.console.delegate.title}</h3>
            <div className="cmd-delegate-entry">
              <div className="cmd-delegate-entry-header">
                <span>{m.console.delegate.autoWarp}</span>
                <AppIcon name="play_arrow" />
              </div>
              <p>{m.console.delegate.condition}</p>
            </div>
            <button className="cmd-block-button" onClick={() => setShowAdvancedControls((value) => !value)} type="button">
              {showAdvancedControls ? m.console.delegate.hideAdvanced : m.console.delegate.addAutomation}
            </button>
          </article>
        </aside>
      </div>

      <section className="cmd-controls-card" id="operator-controls">
        <div className="cmd-log-header">
          <h3>{m.console.controls.title}</h3>
        </div>

        <div className="cmd-action-buttons cmd-controls-actions">
          <button className="cmd-primary-cta" disabled={authState.pending || !storageReady} onClick={() => void handleAuthoriseLiveRoute()} type="button">
            {authState.pending ? "AUTHORIZING LIVE ROUTE" : "AUTHORISE LIVE ROUTE"}
          </button>
          <button className="cmd-secondary-cta" onClick={() => void refetch()} type="button">
            {m.console.controls.refreshAssembly}
          </button>
        </div>

        {authState.status !== "idle" ? (
          <div className={authState.status === "error" ? "cmd-feedback cmd-feedback-error cmd-controls-feedback" : "cmd-feedback cmd-controls-feedback"}>
            {authState.message}
          </div>
        ) : null}

        <details className="cmd-details" onToggle={(event) => setShowAdvancedControls(event.currentTarget.open)} open={showAdvancedControls}>
          <summary>
            <span>{m.console.controls.advanced}</span>
            <span>{showAdvancedControls ? m.console.controls.hideFields : m.console.controls.showFields}</span>
          </summary>

          <div className="cmd-controls-grid">
            <ConfigField
              label={m.console.controls.fields.tenant}
              value={config.tenant}
              onChange={(value) => setConfig((current) => ({ ...current, tenant: value }))}
              placeholder={m.console.controls.placeholders.tenant}
            />
            <ConfigField
              label={m.console.controls.fields.rpcUrl}
              value={config.rpcUrl}
              onChange={(value) => setConfig((current) => ({ ...current, rpcUrl: value }))}
              placeholder={m.console.controls.placeholders.rpcUrl}
            />
            <ConfigField
              label={m.console.controls.fields.worldPackage}
              value={config.worldPackageId}
              onChange={(value) => setConfig((current) => ({ ...current, worldPackageId: value }))}
              placeholder={m.console.controls.placeholders.objectId}
            />
            <ConfigField
              label={m.console.controls.fields.builderPackage}
              value={config.builderPackageId}
              onChange={(value) => setConfig((current) => ({ ...current, builderPackageId: value }))}
              placeholder={m.console.controls.placeholders.objectId}
            />
            <ConfigField
              label={m.console.controls.fields.extensionConfig}
              value={config.extensionConfigId}
              onChange={(value) => setConfig((current) => ({ ...current, extensionConfigId: value }))}
              placeholder={m.console.controls.placeholders.objectId}
            />
            <ConfigField
              label={m.console.controls.fields.recentDigests}
              value={config.recentDigests}
              onChange={(value) => setConfig((current) => ({ ...current, recentDigests: value }))}
              placeholder={m.console.controls.placeholders.recentDigests}
              multiline
            />
            <ConfigField
              label={m.console.controls.fields.sourceGateItemId}
              value={config.sourceGateItemId}
              onChange={(value) => setConfig((current) => ({ ...current, sourceGateItemId: value }))}
              placeholder={assemblyHints.sourceGateItemId || m.console.controls.placeholders.sourceItem}
            />
            <ConfigField
              label={m.console.controls.fields.sourceGateObjectId}
              value={config.sourceGateObjectId}
              onChange={(value) => setConfig((current) => ({ ...current, sourceGateObjectId: value }))}
              placeholder={assemblyHints.sourceGateObjectId || m.console.controls.placeholders.objectId}
            />
            <ConfigField
              label={m.console.controls.fields.destinationGateItemId}
              value={config.destinationGateItemId}
              onChange={(value) => setConfig((current) => ({ ...current, destinationGateItemId: value }))}
              placeholder={assemblyHints.destinationGateItemId || m.console.controls.placeholders.destinationItem}
            />
            <ConfigField
              label={m.console.controls.fields.destinationGateObjectId}
              value={config.destinationGateObjectId}
              onChange={(value) => setConfig((current) => ({ ...current, destinationGateObjectId: value }))}
              placeholder={assemblyHints.destinationGateObjectId || m.console.controls.placeholders.objectId}
            />
            <ConfigField
              label={m.console.controls.fields.characterItemId}
              value={config.characterItemId}
              onChange={(value) => setConfig((current) => ({ ...current, characterItemId: value }))}
              placeholder={effectiveCharacterItemId || m.console.controls.placeholders.autoFromWallet}
            />
            <ConfigField
              label={m.console.controls.fields.characterObjectId}
              value={config.characterObjectId}
              onChange={(value) => setConfig((current) => ({ ...current, characterObjectId: value }))}
              placeholder={effectiveCharacterObjectId || m.console.controls.placeholders.objectId}
            />
            <ConfigField
              label={m.console.controls.fields.storageItemId}
              value={config.storageUnitItemId}
              onChange={(value) => setConfig((current) => ({ ...current, storageUnitItemId: value }))}
              placeholder={assemblyHints.storageUnitItemId || m.console.controls.placeholders.storageItem}
            />
            <ConfigField
              label={m.console.controls.fields.storageObjectId}
              value={config.storageUnitObjectId}
              onChange={(value) => setConfig((current) => ({ ...current, storageUnitObjectId: value }))}
              placeholder={assemblyHints.storageUnitObjectId || m.console.controls.placeholders.objectId}
            />
            <ConfigField
              label={m.console.controls.fields.corpseTypeId}
              value={config.corpseTypeId}
              onChange={(value) => setConfig((current) => ({ ...current, corpseTypeId: value }))}
              placeholder={m.console.controls.placeholders.corpseTypeId}
            />
            <ConfigField
              label={m.console.controls.fields.quantity}
              value={config.corpseQuantity}
              onChange={(value) => setConfig((current) => ({ ...current, corpseQuantity: value }))}
              placeholder={m.console.controls.placeholders.quantity}
            />
          </div>
        </details>
      </section>
    </>
  );
}
