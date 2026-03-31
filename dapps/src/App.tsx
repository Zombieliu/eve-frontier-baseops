import { useEffect, useState } from "react";
import { AppIcon } from "./AppIcon";
import { BaseOpsPanels } from "./BaseOpsPanels";
import { BaseOpsDocsPage } from "./BaseOpsDocsPage";
import { localeOptions, useI18n } from "./i18n";
import { abbreviateAddress, useConnection } from "@evefrontier/dapp-kit";
import {
  useCurrentAccount,
  useCurrentNetwork,
  useDAppKit,
} from "@mysten/dapp-kit-react";

const commandItems = [
  { icon: "terminal", label: "COMMAND", anchor: "hero" },
  { icon: "alt_route", label: "GATE OPS", anchor: "gate-control" },
  { icon: "inventory_2", label: "STORAGE", anchor: "storage-logistics" },
  { icon: "badge", label: "DELEGATES", anchor: "delegate-execution" },
  { icon: "timeline", label: "PROOF FEED", anchor: "proof-timeline" },
  { icon: "lan", label: "INFRA STATE", anchor: "infra-state" },
] as const;

type AppView = "console" | "docs";

function App() {
  const { locale, setLocale, m } = useI18n();
  const { handleConnect, handleDisconnect, hasEveVault } = useConnection();
  const account = useCurrentAccount();
  const currentNetwork = useCurrentNetwork();
  const dAppKit = useDAppKit();
  const isConnected = Boolean(account?.address);
  const switchNetwork = dAppKit.switchNetwork as (network: "localnet" | "testnet" | "devnet") => void;
  const networkLabel = `${String(currentNetwork).toUpperCase()}_01`;
  const [view, setView] = useState<AppView>(() =>
    window.location.hash.startsWith("#docs") ? "docs" : "console",
  );
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);
  const [activeConsoleAnchor, setActiveConsoleAnchor] = useState<string>("hero");

  useEffect(() => {
    window.history.replaceState(null, "", view === "docs" ? "#docs" : "#console");
  }, [view]);

  useEffect(() => {
    if (!pendingAnchor) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(pendingAnchor)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setPendingAnchor(null);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pendingAnchor, view]);

  function openConsole(anchor?: string) {
    setView("console");
    if (anchor) {
      setActiveConsoleAnchor(anchor);
      setPendingAnchor(anchor);
    }
  }

  function openDocs(anchor?: string) {
    setView("docs");
    if (anchor) {
      setPendingAnchor(anchor);
    }
  }

  return (
    <div className="cmd-app">
      <header className="cmd-topbar">
        <div className="cmd-topbar-left">
          <button className="cmd-brand-button" onClick={() => openConsole("hero")} type="button">
            <div className="cmd-brand">{m.app.brand}</div>
          </button>
          <div className="cmd-network-box">
            <span className="cmd-network-dot" />
            <span className="cmd-network-text">{m.app.networkPrefix}: {networkLabel}</span>
          </div>
        </div>
        <div className="cmd-topbar-right">
          <label className="cmd-locale-box">
            <span>{m.app.localeLabel}</span>
            <select value={locale} onChange={(event) => setLocale(event.target.value as typeof locale)}>
              {localeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="cmd-network-switches">
            {(["localnet", "testnet", "devnet"] as const).map((network) => (
              <button
                className={currentNetwork === network ? "cmd-switch cmd-switch-active" : "cmd-switch"}
                key={network}
                onClick={() => switchNetwork(network)}
                type="button"
              >
                {network}
              </button>
            ))}
          </div>
          <button
            className="cmd-wallet-box"
            onClick={() => (isConnected ? handleDisconnect() : handleConnect())}
            type="button"
          >
            <AppIcon className="cmd-wallet-icon" name="account_balance_wallet" />
            <span className="cmd-wallet-address">
              {account
                ? abbreviateAddress(account.address)
                : hasEveVault
                  ? m.app.wallet.connectVault
                  : m.app.wallet.noVault}
            </span>
            <span className="cmd-wallet-meta">
              {isConnected
                ? m.app.wallet.liveOperator
                : hasEveVault
                  ? m.app.wallet.ready
                  : m.app.wallet.offline}
            </span>
          </button>
          <button className="cmd-icon-button" onClick={() => openDocs("docs-home")} type="button">
            <AppIcon name="hub" />
          </button>
          <button className="cmd-icon-button" onClick={() => openConsole("operator-controls")} type="button">
            <AppIcon name="settings" />
          </button>
        </div>
      </header>

      <aside className="cmd-sidebar">
        <div className="cmd-sidebar-header">
          <div className="cmd-sector">{m.app.sidebar.sector}</div>
          <div className="cmd-sidebar-meta">{m.app.sidebar.status}</div>
        </div>
        <nav className="cmd-nav" aria-label="Command sections">
          {commandItems.map((item, index) => (
            <button
              className={view === "console" && activeConsoleAnchor === item.anchor
                ? "cmd-nav-item cmd-nav-item-active"
                : "cmd-nav-item"}
              key={item.label}
              onClick={() => openConsole(item.anchor)}
              type="button"
            >
              <AppIcon name={item.icon} />
              <span>{m.app.sidebar.nav[index]}</span>
            </button>
          ))}
        </nav>
        <div className="cmd-sidebar-footer">
          <button className="cmd-mission-button" onClick={() => openDocs("docs-operate")} type="button">
            {m.app.sidebar.openManual}
          </button>
        </div>
      </aside>

      <main className="cmd-main">
        {view === "docs" ? (
          <BaseOpsDocsPage onOpenConsole={openConsole} />
        ) : (
          <BaseOpsPanels />
        )}
      </main>

      <footer className="cmd-footer">
        <div className="cmd-footer-left">
          {m.app.footer.copy}
        </div>
        <div className="cmd-footer-links">
          <button onClick={() => openConsole("proof-timeline")} type="button">{m.app.footer.links[0]}</button>
          <button onClick={() => openConsole("operator-controls")} type="button">{m.app.footer.links[1]}</button>
          <button onClick={() => openConsole("infra-state")} type="button">{m.app.footer.links[2]}</button>
        </div>
      </footer>
    </div>
  );
}

export default App;
