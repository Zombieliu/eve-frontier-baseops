import type { ReactNode } from "react";

type AppIconName =
  | "terminal"
  | "alt_route"
  | "inventory_2"
  | "badge"
  | "timeline"
  | "lan"
  | "account_balance_wallet"
  | "hub"
  | "settings"
  | "videocam"
  | "check_circle"
  | "warning"
  | "sync_alt"
  | "security"
  | "verified_user"
  | "toll"
  | "open_in_new"
  | "play_arrow";

function Frame(props: {
  children: ReactNode;
  className?: string;
  label?: string;
  viewBox?: string;
}) {
  const { children, className, label, viewBox = "0 0 20 20" } = props;

  return (
    <span
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={className ? `cmd-app-icon ${className}` : "cmd-app-icon"}
      role={label ? "img" : undefined}
    >
      <svg viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
        {children}
      </svg>
    </span>
  );
}

export function AppIcon(props: { className?: string; label?: string; name: AppIconName }) {
  const { className, label, name } = props;

  switch (name) {
    case "terminal":
      return (
        <Frame className={className} label={label}>
          <rect x="2.5" y="3" width="15" height="14" rx="2" />
          <path d="M6 7l3 3-3 3" />
          <path d="M10.5 13h4" />
        </Frame>
      );
    case "alt_route":
      return (
        <Frame className={className} label={label}>
          <path d="M4 5h6a3 3 0 010 6H7" />
          <path d="M10 5l2-2 2 2" />
          <path d="M16 15h-6a3 3 0 010-6h3" />
          <path d="M10 15l-2 2-2-2" />
        </Frame>
      );
    case "inventory_2":
      return (
        <Frame className={className} label={label}>
          <rect x="3" y="4" width="6" height="5" rx="1" />
          <rect x="11" y="4" width="6" height="5" rx="1" />
          <rect x="3" y="11" width="6" height="5" rx="1" />
          <rect x="11" y="11" width="6" height="5" rx="1" />
        </Frame>
      );
    case "badge":
      return (
        <Frame className={className} label={label}>
          <path d="M6 4h8l2 2v10H4V6z" />
          <path d="M7 8h6" />
          <path d="M7 11h6" />
        </Frame>
      );
    case "timeline":
      return (
        <Frame className={className} label={label}>
          <circle cx="5" cy="6" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="15" cy="14" r="1.5" />
          <path d="M6.5 6.8l2 1.6" />
          <path d="M11.5 10.8l2 1.6" />
        </Frame>
      );
    case "lan":
      return (
        <Frame className={className} label={label}>
          <rect x="8" y="3" width="4" height="4" rx="1" />
          <rect x="3" y="13" width="4" height="4" rx="1" />
          <rect x="13" y="13" width="4" height="4" rx="1" />
          <path d="M10 7v3" />
          <path d="M5 13v-2h10v2" />
        </Frame>
      );
    case "account_balance_wallet":
      return (
        <Frame className={className} label={label}>
          <path d="M4 6h11a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
          <path d="M4 6l1.5-2h9" />
          <circle cx="13.5" cy="11" r="0.8" />
        </Frame>
      );
    case "hub":
      return (
        <Frame className={className} label={label}>
          <circle cx="10" cy="5" r="1.5" />
          <circle cx="5" cy="14" r="1.5" />
          <circle cx="15" cy="14" r="1.5" />
          <path d="M10 6.5v3" />
          <path d="M10 9.5L6 13" />
          <path d="M10 9.5l4 3.5" />
        </Frame>
      );
    case "settings":
      return (
        <Frame className={className} label={label}>
          <circle cx="10" cy="10" r="2.8" />
          <path d="M10 3v2" />
          <path d="M10 15v2" />
          <path d="M3 10h2" />
          <path d="M15 10h2" />
          <path d="M5.1 5.1l1.4 1.4" />
          <path d="M13.5 13.5l1.4 1.4" />
          <path d="M14.9 5.1l-1.4 1.4" />
          <path d="M6.5 13.5l-1.4 1.4" />
        </Frame>
      );
    case "videocam":
      return (
        <Frame className={className} label={label}>
          <rect x="3" y="6" width="8" height="8" rx="1.5" />
          <path d="M11 9l4-2v6l-4-2" />
        </Frame>
      );
    case "check_circle":
      return (
        <Frame className={className} label={label}>
          <circle cx="10" cy="10" r="7" />
          <path d="M6.5 10.3l2.2 2.2 4.6-4.8" />
        </Frame>
      );
    case "warning":
      return (
        <Frame className={className} label={label}>
          <path d="M10 3l7 13H3z" />
          <path d="M10 7.5v3.8" />
          <path d="M10 14h.01" />
        </Frame>
      );
    case "sync_alt":
      return (
        <Frame className={className} label={label}>
          <path d="M4 7h9" />
          <path d="M10 4l3 3-3 3" />
          <path d="M16 13H7" />
          <path d="M10 10l-3 3 3 3" />
        </Frame>
      );
    case "security":
      return (
        <Frame className={className} label={label}>
          <path d="M10 3l6 2v4c0 3.8-2.3 6.1-6 8-3.7-1.9-6-4.2-6-8V5z" />
          <path d="M10 7.5v3.5" />
          <path d="M10 13.5h.01" />
        </Frame>
      );
    case "verified_user":
      return (
        <Frame className={className} label={label}>
          <path d="M10 3l5 2v3.5c0 3.2-1.9 5.2-5 6.8-3.1-1.6-5-3.6-5-6.8V5z" />
          <path d="M7.5 9.5l1.6 1.6 3.4-3.5" />
        </Frame>
      );
    case "toll":
      return (
        <Frame className={className} label={label}>
          <path d="M4 16V8l6-4 6 4v8" />
          <path d="M7 16V9.5" />
          <path d="M13 16V9.5" />
          <path d="M7 12.5h6" />
        </Frame>
      );
    case "open_in_new":
      return (
        <Frame className={className} label={label}>
          <path d="M8 5h7v7" />
          <path d="M15 5l-7 7" />
          <path d="M12 10v5H5V8h5" />
        </Frame>
      );
    case "play_arrow":
      return (
        <Frame className={className} label={label}>
          <path d="M6 4.5l8 5.5-8 5.5z" fill="currentColor" stroke="none" />
        </Frame>
      );
  }
}
