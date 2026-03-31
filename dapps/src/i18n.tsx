import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "en" | "zh-CN" | "zh-TW" | "ko" | "ja";

const LOCALE_STORAGE_KEY = "frontier-baseops-locale:v1";

export const localeOptions: Array<{ value: Locale; label: string }> = [
  { value: "en", label: "English" },
  { value: "zh-CN", label: "简体中文" },
  { value: "zh-TW", label: "繁體中文" },
  { value: "ko", label: "한국어" },
  { value: "ja", label: "日本語" },
];

function inferLocale(): Locale {
  const language = window.navigator.language.toLowerCase();

  if (
    language.startsWith("zh-tw") ||
    language.startsWith("zh-hk") ||
    language.includes("hant")
  ) {
    return "zh-TW";
  }

  if (language.startsWith("zh")) {
    return "zh-CN";
  }

  if (language.startsWith("ko")) {
    return "ko";
  }

  if (language.startsWith("ja")) {
    return "ja";
  }

  return "en";
}

export function formatTemplate(
  template: string,
  params: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(params[key] ?? ""),
  );
}

export const messages = {
  en: {
    app: {
      brand: "FRONTIER BASEOPS",
      networkPrefix: "NETWORK",
      wallet: {
        connectVault: "CONNECT_VAULT",
        noVault: "NO_VAULT",
        liveOperator: "LIVE OPERATOR",
        ready: "READY",
        offline: "OFFLINE",
      },
      sidebar: {
        sector: "SECTOR-7G",
        status: "OPERATIONAL STATUS: ACTIVE",
        nav: [
          "COMMAND",
          "GATE OPS",
          "STORAGE",
          "DELEGATES",
          "PROOF FEED",
          "INFRA STATE",
        ],
        openManual: "OPEN MANUAL",
      },
      footer: {
        copy:
          "© 2026 FRONTIER BASEOPS // ENCRYPTED CONNECTION // AUTH_TOKEN: B0PS-992-X",
        links: ["SYSTEM_LOGS", "TERMINAL_OUT", "NETWORK_MAP"],
      },
      localeLabel: "LANG",
    },
    docs: {
      pill: "OPERATOR MANUAL",
      kicker: "Frontier BaseOps dossier",
      title:
        "Documentation that feels like an operational brief, not a generic help center.",
      description:
        "Use this manual to understand the product surface, move through the live workflow, and keep the judged demo readable under pressure.",
      actions: {
        quickstart: "Open quickstart in console",
        proof: "Jump to proof feed",
      },
      quickLinks: ["Start Here", "Operate", "Reference"],
      sections: {
        start: {
          kicker: "Start Here",
          title: "What this product actually does",
          cards: [
            {
              title: "Gate Ops",
              body: "Issue a real route permit through a live Smart Gate extension.",
            },
            {
              title: "Storage Ops",
              body: "Run a storage-side workflow that depends on in-world asset handoff.",
            },
            {
              title: "Proof Timeline",
              body: "Read the resulting digest back on the same screen as operator proof.",
            },
          ],
        },
        operate: {
          kicker: "Operate",
          title: "Fast path for the judged flow",
          steps: [
            "Choose testnet in the top bar and connect the operator wallet.",
            "Load the validated testnet profile from the Operator Manual block.",
            "Issue a permit from SMART GATE CONTROL.",
            "Run the storage workflow from STORAGE LOGISTICS.",
            "Point to the proof timeline to show the digest-backed result.",
          ],
        },
        reference: {
          kicker: "Reference",
          title: "Current validated testnet assets",
          labels: [
            "World package",
            "Builder package",
            "Extension config",
            "Route",
          ],
        },
      },
    },
    console: {
      hero: {
        kicker: "SECURED_NODE",
        meta: "SYS_REF: A-99-ALPHA",
        titleBefore: "DOMINATE THE",
        titleAccent: "FRONTIER",
        description:
          "Orchestrate infrastructure with lethal precision. Manage Smart Gates, Storage Units, and delegated operational mandates from a single, hardened command deck.",
        metrics: {
          liveProofs: "LIVE PROOFS",
          runtime: "RUNTIME %",
        },
        readouts: {
          radarLock: "RADAR LOCK: ACTIVE",
          transit: "TRANSIT PKT: 104MB/S",
        },
      },
      manual: {
        pill: "OPERATOR MANUAL",
        title: "Use this like a dossier, not a generic help page.",
        description:
          "BaseOps is easiest to understand when the workflow is explicit: choose the environment, run one operation, then prove it in the same surface.",
        cards: [
          {
            label: "Start Here",
            title: "Connect an operator and pick a network",
            body: "Use the top bar to choose localnet or testnet, then connect EVE Vault or a compatible wallet before touching any action surface.",
          },
          {
            label: "Operate",
            title: "Run one access or storage loop",
            body: "Issue a route permit, execute the storage workflow, and keep the runtime controls available in case you need to adjust route or object IDs.",
          },
          {
            label: "Reference",
            title: "Prove the result in the same console",
            body: "The operational log is the real endpoint of the demo. A successful workflow must resolve into a digest-backed proof item on screen.",
          },
        ],
        actions: {
          localnet: "LOAD LOCALNET PROFILE",
          testnet: "LOAD TESTNET PROFILE",
        },
        steps: [
          "Choose {network} in the top bar and connect the operator wallet.",
          "Check that source gate, destination gate, storage, and character inputs are resolved.",
          "Use SMART GATE CONTROL or STORAGE LOGISTICS for the live action you want to demonstrate.",
          "Verify the resulting transaction in OPERATIONAL LOG // PROOF TIMELINE.",
        ],
        judgeTitle: "JUDGE SCRIPT // 45 SECOND VERSION",
        judgeLines: [
          "This is a live operator console for EVE Frontier bases, not a generic dashboard.",
          "I will load one real route and one real storage workflow that already exist on-chain.",
          "First I issue a route permit, then I run the storage action, and finally I prove the result on the same screen.",
          "The important point is that Frontier BaseOps turns native gate and storage primitives into a readable organization workflow.",
        ],
      },
      summary: {
        gateStatus: "GATE STATUS",
        activePermits: "ACTIVE PERMITS",
        storageLoad: "STORAGE LOAD",
        securityAlerts: "SECURITY ALERTS",
        operational: "OPERATIONAL",
        unconfigured: "UNCONFIGURED",
      },
      gate: {
        title: "SMART GATE CONTROL",
        unitId: "UNIT_ID",
        active: "ACTIVE",
        destination: "DESTINATION",
        issuePermit: "ISSUE PERMIT",
        issuingPermit: "ISSUING PERMIT",
        initiateWarp: "INITIATE WARP",
      },
      storage: {
        title: "STORAGE LOGISTICS",
        unitId: "UNIT_ID",
        mode: "DEPOSIT_ONLY",
        fuelRods: "FUEL_RODS",
        assetType: "ASSET_TYPE",
        override: "TERMINAL_OVERRIDE",
        running: "RUNNING WORKFLOW",
      },
      log: {
        title: "OPERATIONAL LOG // PROOF TIMELINE",
        export: "EXPORT_DATA",
        refreshing: "REFRESHING",
        placeholderTitle: "SMART GATE: PERMIT_ISSUED",
        placeholderDetail:
          "Execute a live route action to populate the proof timeline.",
      },
      infra: {
        title: "INFRA_STATE",
        nodes: {
          source: "SOURCE_GATE",
          destination: "DESTINATION_GATE",
          storage: "STORAGE_UNIT",
          operational: "OPERATIONAL",
          pendingConfig: "PENDING_CONFIG",
          linked: "LINKED",
          awaitingRoute: "AWAITING_ROUTE",
          readyForHandoff: "READY_FOR_HANDOFF",
          degradedSetup: "DEGRADED_SETUP",
          idPrefix: "ID",
        },
        mapTitle: "LIVE SECTOR MAPPING",
        mapDescription:
          "Tracking {count} active runtime inputs and attached structure targets",
      },
      delegate: {
        title: "DELEGATED_EXECUTION",
        autoWarp: "AUTO-WARP V2",
        condition:
          "Condition: If proof feed contains a successful storage release, keep route replay armed for the next operator pass.",
        hideAdvanced: "- HIDE_ADVANCED",
        addAutomation: "+ ADD_AUTOMATION",
      },
      controls: {
        title: "OPERATOR CONTROLS // RUNTIME CONFIGURATION",
        refreshAssembly: "REFRESH_ASSEMBLY",
        advanced: "ADVANCED CONFIGURATION",
        hideFields: "HIDE_FIELDS",
        showFields: "SHOW_FIELDS",
        fields: {
          tenant: "Tenant",
          rpcUrl: "RPC URL",
          worldPackage: "World package",
          builderPackage: "Builder package",
          extensionConfig: "Extension config",
          recentDigests: "Recent digests",
          sourceGateItemId: "Source gate item ID",
          sourceGateObjectId: "Source gate object ID",
          destinationGateItemId: "Destination gate item ID",
          destinationGateObjectId: "Destination gate object ID",
          characterItemId: "Character item ID",
          characterObjectId: "Character object ID",
          storageItemId: "Storage item ID",
          storageObjectId: "Storage object ID",
          corpseTypeId: "Corpse type ID",
          quantity: "Quantity",
        },
        placeholders: {
          tenant: "dev or testevenet",
          rpcUrl: "https://fullnode.testnet.sui.io:443",
          objectId: "0x...",
          sourceItem: "e.g. 12345",
          destinationItem: "e.g. 67890",
          storageItem: "e.g. 24680",
          corpseTypeId: "u64 item type",
          quantity: "1",
          recentDigests: "One digest per line or comma-separated",
          autoFromWallet: "Auto from wallet",
        },
      },
      statusMessages: {
        waiting: "Waiting for operator input.",
        connectPermit: "Connect a wallet before issuing a permit.",
        missingAccess:
          "World package, builder package, and extension config are all required.",
        buildingAccess: "Building access transaction...",
        permitConfirmedPrefix: "Permit transaction confirmed",
        accessFailed: "Access mutation failed.",
        connectStorage: "Connect a wallet before running the storage workflow.",
        missingStorage:
          "World package, builder package, extension config, and corpse type are required.",
        buildingStorage: "Borrowing OwnerCap and preparing the storage mutation...",
        storageConfirmedPrefix: "Storage transaction confirmed",
        storageFailed: "Storage mutation failed.",
      },
      common: {
        noDigest: "NO_DIGEST_YET",
        none: "NONE",
        unsetRoute: "UNSET_ROUTE",
        unsetGate: "SG-UNSET",
        unsetStorage: "STO-UNSET",
      },
    },
  },
  "zh-CN": {
    app: {
      brand: "FRONTIER BASEOPS",
      networkPrefix: "网络",
      wallet: {
        connectVault: "连接钱包",
        noVault: "无钱包",
        liveOperator: "在线操作员",
        ready: "可连接",
        offline: "离线",
      },
      sidebar: {
        sector: "SECTOR-7G",
        status: "运行状态：激活",
        nav: ["总控", "星门操作", "仓储", "代理执行", "证明时间线", "基础设施"],
        openManual: "打开手册",
      },
      footer: {
        copy: "© 2026 FRONTIER BASEOPS // 加密连接 // AUTH_TOKEN: B0PS-992-X",
        links: ["系统日志", "控制台输出", "网络地图"],
      },
      localeLabel: "语言",
    },
    docs: {
      pill: "操作手册",
      kicker: "Frontier BaseOps 档案",
      title: "这是一份更像行动简报、而不是普通帮助中心的文档。",
      description: "用这份手册理解产品界面、走完 live 流程，并在评审时保持叙事清晰。",
      actions: {
        quickstart: "在控制台打开快速开始",
        proof: "跳转到证明时间线",
      },
      quickLinks: ["开始这里", "操作流程", "参考信息"],
      sections: {
        start: {
          kicker: "开始这里",
          title: "这个产品实际在做什么",
          cards: [
            { title: "星门操作", body: "通过真实的 Smart Gate 扩展发放路线 permit。" },
            { title: "仓储操作", body: "执行依赖游戏内资产交付的 storage workflow。" },
            { title: "证明时间线", body: "把交易 digest 在同一屏读回，作为操作证明。" },
          ],
        },
        operate: {
          kicker: "操作流程",
          title: "评委演示的最快路径",
          steps: [
            "在顶部切到 testnet 并连接操作钱包。",
            "在 Operator Manual 区块加载已验证的 testnet profile。",
            "在 SMART GATE CONTROL 中发起 permit。",
            "在 STORAGE LOGISTICS 中运行 storage workflow。",
            "把证明时间线指给评委看，说明 digest 已回流。",
          ],
        },
        reference: {
          kicker: "参考信息",
          title: "当前已验证的 testnet 资产",
          labels: ["World 包", "Builder 包", "扩展配置", "路线"],
        },
      },
    },
    console: {
      hero: {
        kicker: "SECURED_NODE",
        meta: "SYS_REF: A-99-ALPHA",
        titleBefore: "掌控这片",
        titleAccent: "边疆",
        description: "用一块硬核指挥台管理 Smart Gate、Storage Unit 与代理执行，让基地运营动作具备真正的链上证明。",
        metrics: { liveProofs: "实时证明", runtime: "运行就绪率 %" },
        readouts: {
          radarLock: "雷达锁定：已激活",
          transit: "传输吞吐：104MB/S",
        },
      },
      manual: {
        pill: "操作手册",
        title: "把它当成行动档案，而不是普通说明页。",
        description: "BaseOps 最容易理解的方式，就是明确环境、执行一次操作，然后在同一界面里证明结果。",
        cards: [
          {
            label: "开始这里",
            title: "连接操作员并选择网络",
            body: "先在顶部选择 localnet 或 testnet，再连接 EVE Vault 或兼容钱包，然后再触发动作。",
          },
          {
            label: "操作流程",
            title: "跑一条 permit 或 storage 闭环",
            body: "发起一条路线 permit，执行一次 storage workflow，并在需要时通过运行时配置修正 route / object IDs。",
          },
          {
            label: "参考信息",
            title: "在同一屏证明结果",
            body: "真正的 demo 终点是 operational log。只有 digest-backed 的 proof 回到同屏，这条链路才算完成。",
          },
        ],
        actions: { localnet: "加载 LOCALNET 配置", testnet: "加载 TESTNET 配置" },
        steps: [
          "在顶部选择 {network}，并连接操作钱包。",
          "确认 source gate、destination gate、storage 与 character 已解析。",
          "使用 SMART GATE CONTROL 或 STORAGE LOGISTICS 执行 live 动作。",
          "在 OPERATIONAL LOG // PROOF TIMELINE 中验证交易结果。",
        ],
        judgeTitle: "评委讲稿 // 45 秒版本",
        judgeLines: [
          "这是一个给 EVE Frontier 基地使用的 live operator console，不是普通后台。",
          "我会加载一条真实存在于链上的路线和 storage workflow。",
          "先发 permit，再跑 storage 动作，最后在同一屏证明结果。",
          "重点在于：BaseOps 把原生 gate 和 storage primitive 组织成可读的运营工作流。",
        ],
      },
      summary: {
        gateStatus: "星门状态",
        activePermits: "生效中的 Permit",
        storageLoad: "仓储负载",
        securityAlerts: "安全告警",
        operational: "运行中",
        unconfigured: "未配置",
      },
      gate: {
        title: "SMART GATE CONTROL",
        unitId: "单元编号",
        active: "已激活",
        destination: "目标路由",
        issuePermit: "发放 PERMIT",
        issuingPermit: "正在发放 PERMIT",
        initiateWarp: "发起跃迁",
      },
      storage: {
        title: "STORAGE LOGISTICS",
        unitId: "单元编号",
        mode: "仅存入",
        fuelRods: "燃料棒",
        assetType: "资产类型",
        override: "执行仓储动作",
        running: "正在执行流程",
      },
      log: {
        title: "操作日志 // 证明时间线",
        export: "导出数据",
        refreshing: "刷新中",
        placeholderTitle: "SMART GATE: PERMIT_ISSUED",
        placeholderDetail: "执行一条真实路线动作后，这里会出现证明记录。",
      },
      infra: {
        title: "基础设施状态",
        nodes: {
          source: "源星门",
          destination: "目标星门",
          storage: "仓储单元",
          operational: "运行中",
          pendingConfig: "等待配置",
          linked: "已链接",
          awaitingRoute: "等待路线",
          readyForHandoff: "可交付",
          degradedSetup: "配置不足",
          idPrefix: "编号",
        },
        mapTitle: "实时区域映射",
        mapDescription: "正在跟踪 {count} 个已绑定的运行时输入与结构目标",
      },
      delegate: {
        title: "代理执行",
        autoWarp: "AUTO-WARP V2",
        condition: "条件：如果 proof feed 出现成功的 storage release，就保持路线回放处于待命状态。",
        hideAdvanced: "- 收起高级项",
        addAutomation: "+ 添加自动化",
      },
      controls: {
        title: "操作控制 // 运行时配置",
        refreshAssembly: "刷新结构",
        advanced: "高级配置",
        hideFields: "隐藏字段",
        showFields: "显示字段",
        fields: {
          tenant: "Tenant",
          rpcUrl: "RPC 地址",
          worldPackage: "World 包",
          builderPackage: "Builder 包",
          extensionConfig: "扩展配置",
          recentDigests: "最近 digests",
          sourceGateItemId: "源星门 item ID",
          sourceGateObjectId: "源星门 object ID",
          destinationGateItemId: "目标星门 item ID",
          destinationGateObjectId: "目标星门 object ID",
          characterItemId: "角色 item ID",
          characterObjectId: "角色 object ID",
          storageItemId: "仓储 item ID",
          storageObjectId: "仓储 object ID",
          corpseTypeId: "物品类型 ID",
          quantity: "数量",
        },
        placeholders: {
          tenant: "dev 或 testevenet",
          rpcUrl: "https://fullnode.testnet.sui.io:443",
          objectId: "0x...",
          sourceItem: "例如 12345",
          destinationItem: "例如 67890",
          storageItem: "例如 24680",
          corpseTypeId: "u64 类型 ID",
          quantity: "1",
          recentDigests: "每行一个 digest，或逗号分隔",
          autoFromWallet: "从钱包自动发现",
        },
      },
      statusMessages: {
        waiting: "等待操作员输入。",
        connectPermit: "发 permit 之前请先连接钱包。",
        missingAccess: "World 包、Builder 包和扩展配置都是必填项。",
        buildingAccess: "正在构建 permit 交易...",
        permitConfirmedPrefix: "Permit 交易已确认",
        accessFailed: "Permit 动作失败。",
        connectStorage: "执行 storage workflow 之前请先连接钱包。",
        missingStorage: "World 包、Builder 包、扩展配置和物品类型都是必填项。",
        buildingStorage: "正在借出 OwnerCap 并准备 storage 交易...",
        storageConfirmedPrefix: "Storage 交易已确认",
        storageFailed: "Storage 动作失败。",
      },
      common: {
        noDigest: "暂无 DIGEST",
        none: "无",
        unsetRoute: "路线未设置",
        unsetGate: "星门未设置",
        unsetStorage: "仓储未设置",
      },
    },
  },
  "zh-TW": {
    app: {
      brand: "FRONTIER BASEOPS",
      networkPrefix: "網路",
      wallet: {
        connectVault: "連接錢包",
        noVault: "無錢包",
        liveOperator: "線上操作員",
        ready: "可連接",
        offline: "離線",
      },
      sidebar: {
        sector: "SECTOR-7G",
        status: "運行狀態：啟動",
        nav: ["總控", "星門操作", "倉儲", "代理執行", "證明時間線", "基礎設施"],
        openManual: "打開手冊",
      },
      footer: {
        copy: "© 2026 FRONTIER BASEOPS // 加密連線 // AUTH_TOKEN: B0PS-992-X",
        links: ["系統日誌", "終端輸出", "網路地圖"],
      },
      localeLabel: "語言",
    },
    docs: {
      pill: "操作手冊",
      kicker: "Frontier BaseOps 檔案",
      title: "這是一份更像行動簡報、而不是一般幫助中心的文件。",
      description: "用這份手冊理解產品界面、走完 live 流程，並在評審時保持敘事清晰。",
      actions: {
        quickstart: "在控制台打開快速開始",
        proof: "跳到證明時間線",
      },
      quickLinks: ["從這裡開始", "操作流程", "參考資訊"],
      sections: {
        start: {
          kicker: "從這裡開始",
          title: "這個產品實際在做什麼",
          cards: [
            { title: "星門操作", body: "透過真實的 Smart Gate 擴展發放路線 permit。" },
            { title: "倉儲操作", body: "執行依賴遊戲內資產交付的 storage workflow。" },
            { title: "證明時間線", body: "把交易 digest 在同一畫面讀回，作為操作證明。" },
          ],
        },
        operate: {
          kicker: "操作流程",
          title: "評審演示的最快路徑",
          steps: [
            "在頂部切到 testnet 並連接操作錢包。",
            "在 Operator Manual 區塊載入已驗證的 testnet profile。",
            "在 SMART GATE CONTROL 中發起 permit。",
            "在 STORAGE LOGISTICS 中執行 storage workflow。",
            "把證明時間線指給評審看，說明 digest 已回流。",
          ],
        },
        reference: {
          kicker: "參考資訊",
          title: "目前已驗證的 testnet 資產",
          labels: ["World 套件", "Builder 套件", "擴展設定", "路線"],
        },
      },
    },
    console: {
      hero: {
        kicker: "SECURED_NODE",
        meta: "SYS_REF: A-99-ALPHA",
        titleBefore: "掌控這片",
        titleAccent: "邊疆",
        description: "用一塊硬派指揮台管理 Smart Gate、Storage Unit 與代理執行，讓基地營運動作具備真正的鏈上證明。",
        metrics: { liveProofs: "即時證明", runtime: "運行就緒率 %" },
        readouts: {
          radarLock: "雷達鎖定：已啟動",
          transit: "傳輸吞吐：104MB/S",
        },
      },
      manual: {
        pill: "操作手冊",
        title: "把它當成行動檔案，而不是一般說明頁。",
        description: "BaseOps 最容易理解的方式，就是先明確環境、執行一次操作，再在同一介面裡證明結果。",
        cards: [
          {
            label: "從這裡開始",
            title: "連接操作員並選擇網路",
            body: "先在頂部選擇 localnet 或 testnet，再連接 EVE Vault 或相容錢包，然後再觸發動作。",
          },
          {
            label: "操作流程",
            title: "跑一條 permit 或 storage 閉環",
            body: "發起一條路線 permit，執行一次 storage workflow，並在需要時透過運行時設定修正 route / object IDs。",
          },
          {
            label: "參考資訊",
            title: "在同一畫面證明結果",
            body: "真正的 demo 終點是 operational log。只有 digest-backed 的 proof 回到同畫面，這條鏈路才算完成。",
          },
        ],
        actions: { localnet: "載入 LOCALNET 設定", testnet: "載入 TESTNET 設定" },
        steps: [
          "在頂部選擇 {network}，並連接操作錢包。",
          "確認 source gate、destination gate、storage 與 character 已解析。",
          "使用 SMART GATE CONTROL 或 STORAGE LOGISTICS 執行 live 動作。",
          "在 OPERATIONAL LOG // PROOF TIMELINE 中驗證交易結果。",
        ],
        judgeTitle: "評審講稿 // 45 秒版本",
        judgeLines: [
          "這是一個給 EVE Frontier 基地使用的 live operator console，不是一般後台。",
          "我會載入一條真實存在於鏈上的路線和 storage workflow。",
          "先發 permit，再跑 storage 動作，最後在同一畫面證明結果。",
          "重點在於：BaseOps 把原生 gate 和 storage primitive 組織成可讀的營運工作流。",
        ],
      },
      summary: {
        gateStatus: "星門狀態",
        activePermits: "生效中的 Permit",
        storageLoad: "倉儲負載",
        securityAlerts: "安全警報",
        operational: "運行中",
        unconfigured: "未設定",
      },
      gate: {
        title: "SMART GATE CONTROL",
        unitId: "單元編號",
        active: "已啟動",
        destination: "目標路由",
        issuePermit: "發放 PERMIT",
        issuingPermit: "正在發放 PERMIT",
        initiateWarp: "發起躍遷",
      },
      storage: {
        title: "STORAGE LOGISTICS",
        unitId: "單元編號",
        mode: "僅存入",
        fuelRods: "燃料棒",
        assetType: "資產類型",
        override: "執行倉儲動作",
        running: "正在執行流程",
      },
      log: {
        title: "操作日誌 // 證明時間線",
        export: "匯出資料",
        refreshing: "重新整理中",
        placeholderTitle: "SMART GATE: PERMIT_ISSUED",
        placeholderDetail: "執行一條真實路線動作後，這裡會出現證明紀錄。",
      },
      infra: {
        title: "基礎設施狀態",
        nodes: {
          source: "來源星門",
          destination: "目標星門",
          storage: "倉儲單元",
          operational: "運行中",
          pendingConfig: "等待設定",
          linked: "已連結",
          awaitingRoute: "等待路線",
          readyForHandoff: "可交付",
          degradedSetup: "設定不足",
          idPrefix: "編號",
        },
        mapTitle: "即時區域映射",
        mapDescription: "正在追蹤 {count} 個已綁定的運行時輸入與結構目標",
      },
      delegate: {
        title: "代理執行",
        autoWarp: "AUTO-WARP V2",
        condition: "條件：如果 proof feed 出現成功的 storage release，就保持路線回放處於待命狀態。",
        hideAdvanced: "- 收起進階項",
        addAutomation: "+ 新增自動化",
      },
      controls: {
        title: "操作控制 // 運行時設定",
        refreshAssembly: "重新整理結構",
        advanced: "進階設定",
        hideFields: "隱藏欄位",
        showFields: "顯示欄位",
        fields: {
          tenant: "Tenant",
          rpcUrl: "RPC 位址",
          worldPackage: "World 套件",
          builderPackage: "Builder 套件",
          extensionConfig: "擴展設定",
          recentDigests: "最近 digests",
          sourceGateItemId: "來源星門 item ID",
          sourceGateObjectId: "來源星門 object ID",
          destinationGateItemId: "目標星門 item ID",
          destinationGateObjectId: "目標星門 object ID",
          characterItemId: "角色 item ID",
          characterObjectId: "角色 object ID",
          storageItemId: "倉儲 item ID",
          storageObjectId: "倉儲 object ID",
          corpseTypeId: "物品類型 ID",
          quantity: "數量",
        },
        placeholders: {
          tenant: "dev 或 testevenet",
          rpcUrl: "https://fullnode.testnet.sui.io:443",
          objectId: "0x...",
          sourceItem: "例如 12345",
          destinationItem: "例如 67890",
          storageItem: "例如 24680",
          corpseTypeId: "u64 類型 ID",
          quantity: "1",
          recentDigests: "每行一個 digest，或用逗號分隔",
          autoFromWallet: "由錢包自動帶入",
        },
      },
      statusMessages: {
        waiting: "等待操作員輸入。",
        connectPermit: "發 permit 之前請先連接錢包。",
        missingAccess: "World 套件、Builder 套件和擴展設定都是必填。",
        buildingAccess: "正在建立 permit 交易...",
        permitConfirmedPrefix: "Permit 交易已確認",
        accessFailed: "Permit 動作失敗。",
        connectStorage: "執行 storage workflow 之前請先連接錢包。",
        missingStorage: "World 套件、Builder 套件、擴展設定與物品類型都是必填。",
        buildingStorage: "正在借出 OwnerCap 並準備 storage 交易...",
        storageConfirmedPrefix: "Storage 交易已確認",
        storageFailed: "Storage 動作失敗。",
      },
      common: {
        noDigest: "尚無 DIGEST",
        none: "無",
        unsetRoute: "路線未設定",
        unsetGate: "星門未設定",
        unsetStorage: "倉儲未設定",
      },
    },
  },
  ko: {
    app: {
      brand: "FRONTIER BASEOPS",
      networkPrefix: "네트워크",
      wallet: {
        connectVault: "지갑 연결",
        noVault: "지갑 없음",
        liveOperator: "실행 중 운영자",
        ready: "준비됨",
        offline: "오프라인",
      },
      sidebar: {
        sector: "SECTOR-7G",
        status: "운영 상태: 활성",
        nav: ["지휘", "게이트 작업", "스토리지", "위임 실행", "증명 타임라인", "인프라 상태"],
        openManual: "매뉴얼 열기",
      },
      footer: {
        copy: "© 2026 FRONTIER BASEOPS // 암호화 연결 // AUTH_TOKEN: B0PS-992-X",
        links: ["시스템 로그", "터미널 출력", "네트워크 맵"],
      },
      localeLabel: "언어",
    },
    docs: {
      pill: "운영 매뉴얼",
      kicker: "Frontier BaseOps 도시에",
      title: "일반 도움말 센터가 아니라 작전 브리프처럼 읽히는 문서입니다.",
      description: "이 매뉴얼로 제품 표면을 이해하고, 라이브 플로우를 따라가며, 심사 시 데모를 명확하게 유지하세요.",
      actions: {
        quickstart: "콘솔에서 퀵스타트 열기",
        proof: "증명 피드로 이동",
      },
      quickLinks: ["시작", "운영", "참고"],
      sections: {
        start: {
          kicker: "시작",
          title: "이 제품이 실제로 하는 일",
          cards: [
            { title: "게이트 작업", body: "실제 Smart Gate 확장을 통해 경로 permit을 발급합니다." },
            { title: "스토리지 작업", body: "인게임 자산 인도에 의존하는 storage workflow를 실행합니다." },
            { title: "증명 타임라인", body: "같은 화면에서 digest를 다시 읽어 운영 증명으로 사용합니다." },
          ],
        },
        operate: {
          kicker: "운영",
          title: "심사용 데모의 가장 빠른 경로",
          steps: [
            "상단에서 testnet을 선택하고 운영자 지갑을 연결합니다.",
            "Operator Manual 블록에서 검증된 testnet profile을 불러옵니다.",
            "SMART GATE CONTROL에서 permit을 발급합니다.",
            "STORAGE LOGISTICS에서 storage workflow를 실행합니다.",
            "proof timeline을 가리키며 digest 기반 결과를 보여줍니다.",
          ],
        },
        reference: {
          kicker: "참고",
          title: "현재 검증된 testnet 자산",
          labels: ["World 패키지", "Builder 패키지", "확장 설정", "경로"],
        },
      },
    },
    console: {
      hero: {
        kicker: "SECURED_NODE",
        meta: "SYS_REF: A-99-ALPHA",
        titleBefore: "프런티어를",
        titleAccent: "장악하라",
        description: "하나의 단단한 지휘면에서 Smart Gate, Storage Unit, 위임 실행을 운영하고 그 결과를 체인 증명으로 되돌려 받습니다.",
        metrics: { liveProofs: "라이브 증명", runtime: "런타임 준비율 %" },
        readouts: {
          radarLock: "레이더 락: 활성",
          transit: "전송량: 104MB/S",
        },
      },
      manual: {
        pill: "운영 매뉴얼",
        title: "이 화면을 일반 도움말이 아니라 작전 문서처럼 사용하세요.",
        description: "BaseOps를 가장 쉽게 이해하는 방법은 환경을 선택하고, 한 번의 작업을 실행한 뒤, 같은 화면에서 결과를 증명하는 것입니다.",
        cards: [
          {
            label: "시작",
            title: "운영자 연결 및 네트워크 선택",
            body: "상단에서 localnet 또는 testnet을 선택하고 EVE Vault 또는 호환 지갑을 연결한 후에 액션을 실행하세요.",
          },
          {
            label: "운영",
            title: "permit 또는 storage 루프 실행",
            body: "경로 permit을 발급하고 storage workflow를 실행한 뒤 필요하면 runtime controls로 route / object IDs를 조정하세요.",
          },
          {
            label: "참고",
            title: "같은 콘솔에서 결과 증명",
            body: "데모의 진짜 종착점은 operational log입니다. digest 기반 증명이 같은 화면으로 돌아와야 루프가 완성됩니다.",
          },
        ],
        actions: { localnet: "LOCALNET 프로필 불러오기", testnet: "TESTNET 프로필 불러오기" },
        steps: [
          "상단에서 {network}을 선택하고 운영자 지갑을 연결합니다.",
          "source gate, destination gate, storage, character가 모두 해석되었는지 확인합니다.",
          "SMART GATE CONTROL 또는 STORAGE LOGISTICS에서 라이브 액션을 실행합니다.",
          "OPERATIONAL LOG // PROOF TIMELINE에서 거래 결과를 확인합니다.",
        ],
        judgeTitle: "심사 멘트 // 45초 버전",
        judgeLines: [
          "이것은 일반 대시보드가 아니라 EVE Frontier 기지를 위한 라이브 운영 콘솔입니다.",
          "체인 위에 실제로 존재하는 경로와 storage workflow를 불러오겠습니다.",
          "먼저 permit을 발급하고, 다음으로 storage 액션을 실행하며, 마지막으로 같은 화면에서 결과를 증명합니다.",
          "핵심은 BaseOps가 native gate와 storage primitive를 읽기 쉬운 조직 운영 플로우로 바꾼다는 점입니다.",
        ],
      },
      summary: {
        gateStatus: "게이트 상태",
        activePermits: "활성 permit",
        storageLoad: "스토리지 부하",
        securityAlerts: "보안 경고",
        operational: "운영 중",
        unconfigured: "미설정",
      },
      gate: {
        title: "SMART GATE CONTROL",
        unitId: "유닛 ID",
        active: "활성",
        destination: "목적지",
        issuePermit: "PERMIT 발급",
        issuingPermit: "PERMIT 발급 중",
        initiateWarp: "워프 시작",
      },
      storage: {
        title: "STORAGE LOGISTICS",
        unitId: "유닛 ID",
        mode: "입고 전용",
        fuelRods: "연료 로드",
        assetType: "자산 타입",
        override: "스토리지 실행",
        running: "워크플로 실행 중",
      },
      log: {
        title: "운영 로그 // 증명 타임라인",
        export: "데이터 내보내기",
        refreshing: "새로고침 중",
        placeholderTitle: "SMART GATE: PERMIT_ISSUED",
        placeholderDetail: "라이브 경로 액션을 실행하면 여기에 증명 항목이 표시됩니다.",
      },
      infra: {
        title: "인프라 상태",
        nodes: {
          source: "SOURCE_GATE",
          destination: "DESTINATION_GATE",
          storage: "STORAGE_UNIT",
          operational: "운영 중",
          pendingConfig: "설정 대기",
          linked: "연결됨",
          awaitingRoute: "경로 대기",
          readyForHandoff: "인계 준비",
          degradedSetup: "설정 부족",
          idPrefix: "ID",
        },
        mapTitle: "라이브 섹터 맵",
        mapDescription: "현재 {count}개의 런타임 입력과 연결된 구조 대상을 추적 중입니다.",
      },
      delegate: {
        title: "위임 실행",
        autoWarp: "AUTO-WARP V2",
        condition: "조건: proof feed에 성공적인 storage release가 들어오면 다음 운영 패스를 위해 route replay를 유지합니다.",
        hideAdvanced: "- 고급 옵션 숨기기",
        addAutomation: "+ 자동화 추가",
      },
      controls: {
        title: "운영자 제어 // 런타임 설정",
        refreshAssembly: "구조 새로고침",
        advanced: "고급 설정",
        hideFields: "필드 숨기기",
        showFields: "필드 표시",
        fields: {
          tenant: "Tenant",
          rpcUrl: "RPC URL",
          worldPackage: "World 패키지",
          builderPackage: "Builder 패키지",
          extensionConfig: "확장 설정",
          recentDigests: "최근 digests",
          sourceGateItemId: "Source gate item ID",
          sourceGateObjectId: "Source gate object ID",
          destinationGateItemId: "Destination gate item ID",
          destinationGateObjectId: "Destination gate object ID",
          characterItemId: "Character item ID",
          characterObjectId: "Character object ID",
          storageItemId: "Storage item ID",
          storageObjectId: "Storage object ID",
          corpseTypeId: "Corpse type ID",
          quantity: "Quantity",
        },
        placeholders: {
          tenant: "dev 또는 testevenet",
          rpcUrl: "https://fullnode.testnet.sui.io:443",
          objectId: "0x...",
          sourceItem: "예: 12345",
          destinationItem: "예: 67890",
          storageItem: "예: 24680",
          corpseTypeId: "u64 타입 ID",
          quantity: "1",
          recentDigests: "줄마다 하나의 digest 또는 콤마 구분",
          autoFromWallet: "지갑에서 자동 감지",
        },
      },
      statusMessages: {
        waiting: "운영자 입력 대기 중입니다.",
        connectPermit: "permit을 발급하기 전에 지갑을 연결하세요.",
        missingAccess: "World 패키지, Builder 패키지, 확장 설정이 모두 필요합니다.",
        buildingAccess: "permit 거래를 구성하는 중...",
        permitConfirmedPrefix: "Permit 거래 확인됨",
        accessFailed: "Permit 액션에 실패했습니다.",
        connectStorage: "storage workflow 실행 전에 지갑을 연결하세요.",
        missingStorage: "World 패키지, Builder 패키지, 확장 설정, 아이템 타입이 모두 필요합니다.",
        buildingStorage: "OwnerCap을 빌리고 storage 거래를 준비하는 중...",
        storageConfirmedPrefix: "Storage 거래 확인됨",
        storageFailed: "Storage 액션에 실패했습니다.",
      },
      common: {
        noDigest: "DIGEST 없음",
        none: "없음",
        unsetRoute: "경로 미설정",
        unsetGate: "게이트 미설정",
        unsetStorage: "스토리지 미설정",
      },
    },
  },
  ja: {
    app: {
      brand: "FRONTIER BASEOPS",
      networkPrefix: "ネットワーク",
      wallet: {
        connectVault: "ウォレット接続",
        noVault: "ウォレットなし",
        liveOperator: "オンライン運用者",
        ready: "接続可",
        offline: "オフライン",
      },
      sidebar: {
        sector: "SECTOR-7G",
        status: "運用状態: アクティブ",
        nav: ["コマンド", "ゲート運用", "ストレージ", "委任実行", "証明タイムライン", "インフラ状態"],
        openManual: "マニュアルを開く",
      },
      footer: {
        copy: "© 2026 FRONTIER BASEOPS // 暗号化接続 // AUTH_TOKEN: B0PS-992-X",
        links: ["システムログ", "ターミナル出力", "ネットワークマップ"],
      },
      localeLabel: "言語",
    },
    docs: {
      pill: "運用マニュアル",
      kicker: "Frontier BaseOps ドシエ",
      title: "一般的なヘルプセンターではなく、運用ブリーフのように読めるドキュメントです。",
      description: "このマニュアルでプロダクト面を理解し、ライブフローをたどり、審査時のデモを明快に保ちます。",
      actions: {
        quickstart: "コンソールでクイックスタートを開く",
        proof: "証明フィードへ移動",
      },
      quickLinks: ["開始", "操作", "参照"],
      sections: {
        start: {
          kicker: "開始",
          title: "このプロダクトが実際に行うこと",
          cards: [
            { title: "ゲート運用", body: "実際の Smart Gate 拡張を通じてルート permit を発行します。" },
            { title: "ストレージ運用", body: "ゲーム内資産の受け渡しに依存する storage workflow を実行します。" },
            { title: "証明タイムライン", body: "同じ画面で digest を読み戻し、運用証明として示します。" },
          ],
        },
        operate: {
          kicker: "操作",
          title: "審査用デモの最短ルート",
          steps: [
            "上部で testnet を選択し、運用ウォレットを接続します。",
            "Operator Manual ブロックで検証済み testnet profile を読み込みます。",
            "SMART GATE CONTROL で permit を発行します。",
            "STORAGE LOGISTICS で storage workflow を実行します。",
            "proof timeline を示して digest ベースの結果を説明します。",
          ],
        },
        reference: {
          kicker: "参照",
          title: "現在検証済みの testnet 資産",
          labels: ["World パッケージ", "Builder パッケージ", "拡張設定", "ルート"],
        },
      },
    },
    console: {
      hero: {
        kicker: "SECURED_NODE",
        meta: "SYS_REF: A-99-ALPHA",
        titleBefore: "フロンティアを",
        titleAccent: "掌握せよ",
        description: "Smart Gate、Storage Unit、委任実行を一つの堅牢な指揮面で運用し、その結果をオンチェーン証明として同じ画面に戻します。",
        metrics: { liveProofs: "ライブ証明", runtime: "ランタイム準備率 %" },
        readouts: {
          radarLock: "レーダーロック: ACTIVE",
          transit: "転送スループット: 104MB/S",
        },
      },
      manual: {
        pill: "運用マニュアル",
        title: "これを一般的なヘルプではなく、作戦ドシエとして使ってください。",
        description: "BaseOps を最も理解しやすい形にするには、環境を選び、1つの操作を実行し、同じ画面で結果を証明することです。",
        cards: [
          {
            label: "開始",
            title: "運用者を接続してネットワークを選ぶ",
            body: "上部で localnet または testnet を選択し、EVE Vault か互換ウォレットを接続してから操作を実行します。",
          },
          {
            label: "操作",
            title: "permit または storage のループを実行する",
            body: "ルート permit を発行し、storage workflow を実行し、必要に応じて runtime controls で route / object IDs を調整します。",
          },
          {
            label: "参照",
            title: "同じコンソールで結果を証明する",
            body: "デモの本当の終点は operational log です。digest ベースの proof が同じ画面に戻ってきて初めてループが完了します。",
          },
        ],
        actions: { localnet: "LOCALNET プロファイルを読み込む", testnet: "TESTNET プロファイルを読み込む" },
        steps: [
          "上部で {network} を選び、運用ウォレットを接続します。",
          "source gate、destination gate、storage、character が解決されていることを確認します。",
          "SMART GATE CONTROL または STORAGE LOGISTICS でライブ操作を実行します。",
          "OPERATIONAL LOG // PROOF TIMELINE で取引結果を確認します。",
        ],
        judgeTitle: "審査用スクリプト // 45 秒版",
        judgeLines: [
          "これは一般的なダッシュボードではなく、EVE Frontier 基地のためのライブ運用コンソールです。",
          "チェーン上に実在するルートと storage workflow を読み込みます。",
          "まず permit を発行し、次に storage の操作を実行し、最後に同じ画面で結果を証明します。",
          "重要なのは、BaseOps が native gate と storage primitive を読みやすい運用ワークフローに変えていることです。",
        ],
      },
      summary: {
        gateStatus: "ゲート状態",
        activePermits: "有効な Permit",
        storageLoad: "ストレージ負荷",
        securityAlerts: "セキュリティ警告",
        operational: "運用中",
        unconfigured: "未設定",
      },
      gate: {
        title: "SMART GATE CONTROL",
        unitId: "ユニット ID",
        active: "ACTIVE",
        destination: "宛先",
        issuePermit: "PERMIT 発行",
        issuingPermit: "PERMIT 発行中",
        initiateWarp: "ワープ開始",
      },
      storage: {
        title: "STORAGE LOGISTICS",
        unitId: "ユニット ID",
        mode: "入庫専用",
        fuelRods: "燃料ロッド",
        assetType: "資産タイプ",
        override: "ストレージ実行",
        running: "ワークフロー実行中",
      },
      log: {
        title: "運用ログ // 証明タイムライン",
        export: "データ出力",
        refreshing: "更新中",
        placeholderTitle: "SMART GATE: PERMIT_ISSUED",
        placeholderDetail: "ライブのルート操作を実行すると、ここに証明項目が表示されます。",
      },
      infra: {
        title: "インフラ状態",
        nodes: {
          source: "SOURCE_GATE",
          destination: "DESTINATION_GATE",
          storage: "STORAGE_UNIT",
          operational: "運用中",
          pendingConfig: "設定待ち",
          linked: "接続済み",
          awaitingRoute: "ルート待ち",
          readyForHandoff: "受け渡し準備完了",
          degradedSetup: "設定不足",
          idPrefix: "ID",
        },
        mapTitle: "ライブセクターマッピング",
        mapDescription: "{count} 個のランタイム入力と接続済み構造ターゲットを追跡中",
      },
      delegate: {
        title: "委任実行",
        autoWarp: "AUTO-WARP V2",
        condition: "条件: proof feed に成功した storage release が現れたら、次の運用パスのため route replay を維持します。",
        hideAdvanced: "- 高度設定を隠す",
        addAutomation: "+ 自動化を追加",
      },
      controls: {
        title: "運用コントロール // ランタイム設定",
        refreshAssembly: "構造を再読込",
        advanced: "高度設定",
        hideFields: "フィールドを隠す",
        showFields: "フィールドを表示",
        fields: {
          tenant: "Tenant",
          rpcUrl: "RPC URL",
          worldPackage: "World パッケージ",
          builderPackage: "Builder パッケージ",
          extensionConfig: "拡張設定",
          recentDigests: "最近の digests",
          sourceGateItemId: "Source gate item ID",
          sourceGateObjectId: "Source gate object ID",
          destinationGateItemId: "Destination gate item ID",
          destinationGateObjectId: "Destination gate object ID",
          characterItemId: "Character item ID",
          characterObjectId: "Character object ID",
          storageItemId: "Storage item ID",
          storageObjectId: "Storage object ID",
          corpseTypeId: "Corpse type ID",
          quantity: "Quantity",
        },
        placeholders: {
          tenant: "dev または testevenet",
          rpcUrl: "https://fullnode.testnet.sui.io:443",
          objectId: "0x...",
          sourceItem: "例 12345",
          destinationItem: "例 67890",
          storageItem: "例 24680",
          corpseTypeId: "u64 タイプ ID",
          quantity: "1",
          recentDigests: "1 行 1 digest またはカンマ区切り",
          autoFromWallet: "ウォレットから自動取得",
        },
      },
      statusMessages: {
        waiting: "操作入力を待っています。",
        connectPermit: "permit を発行する前にウォレットを接続してください。",
        missingAccess: "World パッケージ、Builder パッケージ、拡張設定がすべて必要です。",
        buildingAccess: "permit 取引を構築中...",
        permitConfirmedPrefix: "Permit 取引を確認済み",
        accessFailed: "Permit 操作に失敗しました。",
        connectStorage: "storage workflow を実行する前にウォレットを接続してください。",
        missingStorage: "World パッケージ、Builder パッケージ、拡張設定、アイテムタイプがすべて必要です。",
        buildingStorage: "OwnerCap を借用し storage 取引を準備中...",
        storageConfirmedPrefix: "Storage 取引を確認済み",
        storageFailed: "Storage 操作に失敗しました。",
      },
      common: {
        noDigest: "DIGEST なし",
        none: "なし",
        unsetRoute: "ルート未設定",
        unsetGate: "ゲート未設定",
        unsetStorage: "ストレージ未設定",
      },
    },
  },
} as const;

type Messages = (typeof messages)[Locale];

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  m: Messages;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (stored && stored in messages) {
      return stored;
    }
    return inferLocale();
  });

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, m: messages[locale] }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}
