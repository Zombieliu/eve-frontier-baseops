# AGENTS.md

## Scope

- This repo is the Frontier BaseOps hackathon project for EVE Frontier.
- It starts from the Dubhe EVE builder template and is being reshaped into an operations control plane for bases, gates, storage, and delegated execution.
- Keep cross-project notes in `~/obelisk/ai/_shared/`; keep repo-local guidance here.

## Key Areas

- `dapps/` operator console UI built with EVE Frontier dapp-kit
- `move-contracts/` on-chain extensions for gate and storage workflows
- `ts-scripts/` operational scripts for configuring rules and issuing live actions
- `setup-world/` world bootstrap and seed helpers
- `docs/` product notes, IA, and hackathon submission material

## Common Commands

```bash
pnpm install
pnpm install:dapp
pnpm dev
pnpm build
pnpm type-check
pnpm type-check:dapp
pnpm configure-rules
pnpm authorise-gate-extension
pnpm authorise-storage-unit-extension
```

## Working Rules

- Keep the MVP framed as an operations console, not a standalone permit form.
- Prefer real EVE Frontier primitives, live reads, and verifiable event flows over mocked product polish.
- If a contract or script flow changes, update the dapp copy and docs in the same pass.
- Treat environment-specific values, deployment artifacts, and private keys as local-only.

## Verification

- Run the narrowest relevant type-check, build, or flow script for the area you touched.
- For UI changes, verify `pnpm build` inside `dapps/` before calling the surface ready.
- For contract or script changes, verify both the Move build and the calling TypeScript script entrypoint.
