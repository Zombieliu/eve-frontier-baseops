# Frontier BaseOps

An operations control plane for EVE Frontier bases.

Frontier BaseOps turns native primitives like Smart Gates, Storage Units, delegated execution, and live events into one operator workflow for organizations.
`permit` is part of the product, but it is not the whole product.

## Core pitch

- overview the current state of a base in one place
- issue access actions for external executors
- coordinate storage handoffs and delivery operations
- read live permit, jump, and storage events back as proof

## Live demo

- local app: `http://127.0.0.1:4178/`
- public repo: `https://github.com/Zombieliu/eve-frontier-baseops`
- recommended demo path: official `Utopia` world profile on Sui `testnet`

## Why this is a competition project

Frontier BaseOps is intentionally framed as a product, not only a contract example.
It combines Frontier-native Smart Gates, Storage Units, delegated execution, and digest-backed proof into one operator surface that judges can understand in under a minute.

## Architecture

```text
┌──────────────────────────────────────────────────────┐
│                  EVE Frontier dApp                   │
│      operator console + in-app docs/manual view     │
│      wallet connect + live actions + proof feed     │
└───────────────────────┬──────────────────────────────┘
                        │
            ┌───────────▼───────────┐
            │   EVE Vault / Wallet  │
            │  signs operator txs   │
            └───────────┬───────────┘
                        │
      ┌─────────────────▼──────────────────┐
      │     smart_gate_extension package    │
      │ tribe_permit + corpse_gate_bounty   │
      └─────────────────┬──────────────────┘
                        │
        ┌───────────────▼────────────────┐
        │  EVE Frontier world primitives │
        │ Smart Gate / Storage / Character│
        └────────────────────────────────┘
```

## Current environment anchors

### Official Utopia world

- `WORLD_PACKAGE_ID` (`published-at`): `0x07e6b810c2dff6df56ea7fbad9ff32f4d84cbee53e496267515887b712924bd1`
- `WORLD_PACKAGE_ID` (`original-id`): `0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75`
- `BUILDER_PACKAGE_ID`: `0x34c884b88860af000965b80eebe74c52a6a64d79b44a70b77278d44e436aab56`
- `EXTENSION_CONFIG_ID`: `0xb395adba3e55fabcaaa7f200d068224e01f43b59732c8a69b7f6d6c8187942e4`
- `TENANT`: `utopia`
- `EXTERNAL_BROWSER_HINT`: `https://uat.dapps.evefrontier.com/?tenant=utopia`
- Note: live Utopia route and storage authorization are not configured yet for the current keys.

### Repo builder validation on testnet

- `WORLD_PACKAGE_ID`: `0x284dde8463dc1888671287ff330d1cc6757c08b56c19cbef3fe85e0c1447f9d2`
- `BUILDER_PACKAGE_ID`: `0x522f00da02494c4bc6feddb4d3a964c822cfdf0fb439849f074544b59ed86882`
- `EXTENSION_CONFIG_ID`: `0x25a3ca9edd24a19be1cb7874844d14ebcc982679c180316c82c12581d1445e93`

### Localnet

- `WORLD_PACKAGE_ID`: `0x7f5837a27fa739c8b18aabeb4c3fe5a54cf3d89167c115d1067acbc111b90da3`
- `BUILDER_PACKAGE_ID`: `0x24297582d94b483e3aba826c7a27f18199402a32c79ea22a42683858c928029e`
- `EXTENSION_CONFIG_ID`: `0x8030a20fe16cdf934ab00f0af2694e5a9a1ea82faf09322a1304515b8cd2f022`

## Category fit

- `Utility`: a concrete base operations tool for organizations and structure operators
- `Technical implementation`: real extension package, real scripts, real wallet flow, real proof readback
- `Live Frontier integration`: direct use of Smart Gates, Storage Units, Character ownership, official Utopia world targeting, and repo-validated testnet extension deployment

## Why this repo exists

This repo starts from the Dubhe `eve-builder` template because that is the fastest path to a real EVE Frontier integration surface:

- EVE Vault wallet connection
- Smart Gate and Storage Unit primitives
- live read + live write workflow
- Dubhe-compatible scripts and extension flow

## MVP shape

The day-one MVP is intentionally narrow:

1. Overview
2. Access Ops
3. Storage Ops + Event Feed

The detailed information architecture lives in `docs/mvp-ia.md`.

## Repo layout

- `dapps/` operator console UI
- `move-contracts/` Smart Assembly extensions
- `ts-scripts/` operational scripts for rule config and live actions
- `setup-world/` world bootstrap helpers
- `docs/` submission notes and product framing
- `zklogin/` optional zkLogin support

## Competition materials

- `docs/deepsurge-submission.md` submission framing and Stillness bonus notes
- `docs/submission-copy.md` short / medium / long submission copy
- `docs/demo-script.md` judged live demo walkthrough
- `docs/video-script.md` recording structure and voiceover beats

## Demo surfaces

- `dapps/` command-interface operator console
- app-level docs/manual view accessible from the top `hub` button
- language support for `en`, `zh-CN`, `zh-TW`, `ko`, and `ja`

## Quick start

Install the root toolchain and dapp dependencies:

```bash
pnpm install
pnpm run install:dapp
cp .env.example .env
```

Verify the baseline:

```bash
pnpm run type-check
pnpm run type-check:dapp
pnpm run build
```

Run the operator console locally:

```bash
pnpm run dev
```

## Existing live-flow scripts

The template already includes gate and storage scripts that can be repurposed into the BaseOps workflow:

```bash
pnpm run configure-rules
pnpm run authorise-gate-extension
pnpm run authorise-storage-unit-extension
pnpm run issue-tribe-jump-permit
pnpm run jump-with-permit
pnpm run collect-corpse-bounty
```

## Current baseline

- public GitHub repo: `https://github.com/Zombieliu/eve-frontier-baseops`
- local path: `eve/eve-frontier-baseops/`
- bootstrap source: Dubhe `templates/eve-builder/sui-template`
- current focus: reshape the reference builder flow into a real operator console surface
