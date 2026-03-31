# Frontier BaseOps dApp

This app is the operator-facing surface for Frontier BaseOps.
It uses `@evefrontier/dapp-kit` to connect to EVE Vault, load live assembly context, and evolve the reference builder UI into a base operations console.

## Current scope

- wallet connection via EVE Vault
- live structure context via `useSmartObject()`
- product framing for Overview, Access Ops, Storage Ops, and event proof

## Key files

- `src/main.tsx`: provider setup for React Query, dapp-kit, wallet, and assembly context
- `src/App.tsx`: BaseOps shell and MVP layout
- `src/WalletStatus.tsx`: connected account state and live structure context
- `src/AssemblyInfo.tsx`: live assembly readout powered by `useSmartObject()`

## Local development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

To load a real structure context, run the dapp from an assembly-aware entry point or provide a valid `VITE_ITEM_ID` in local environment configuration.
