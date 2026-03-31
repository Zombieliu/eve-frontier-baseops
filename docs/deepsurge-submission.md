# DeepSurge Submission And Stillness Bonus

## Recommended project

- Project name: `Frontier BaseOps`
- One-line pitch: `A live operations control plane for EVE Frontier organizations to manage Smart Gates, Storage Units, delegates, and proof-backed event workflows.`
- Core surface: `dapps/`
- Core on-chain path: `move-contracts/smart_gate_extension`
- Core scripts: `ts-scripts/smart_gate_extension/*`

## Why this is the strongest submission now

- It is framed as a real product surface, not only a contract demo.
- It uses Frontier-native primitives directly: Smart Gates, Storage Units, Character ownership, and transaction proof.
- It already demonstrates both live write and live readback paths.
- It can be validated in controlled localnet rehearsal, aligned to the official Utopia world on Sui testnet, and demonstrated on a real owner-controlled Utopia route.

## What Frontier BaseOps does

Frontier BaseOps turns EVE Frontier base operations into one readable control surface.

The current MVP focuses on three connected capabilities:

1. `Gate Ops`
   - issue a real route permit through a live Smart Gate extension
   - demonstrate route access as an operator action, not only a script

2. `Storage Ops`
   - run a storage-side workflow tied to in-world asset handoff
   - demonstrate that storage, access, and route control can live in one operator workflow

3. `Proof Timeline`
   - read the resulting digest back into the same console
   - prove that the action succeeded without leaving the operator surface

## Score alignment

- `Utility`
  - strong: this is a concrete base operations tool for orgs and structure operators
- `Technical implementation`
  - strong: real contract extension, real scripts, real wallet flow, real readback
- `Live Frontier integration`
  - strong: works with native Frontier primitives, targets the official Utopia world, and retains a repo-validated testnet builder path
- `Creativity`
  - medium-high: the novelty comes from combining official primitives into a coherent operations product

## Recommended submission package

- Project name: `Frontier BaseOps`
- Headline: `Operate gates, storage, and delegates from one live Frontier control plane.`
- Categories to target:
  - `Utility`
  - `Technical implementation`
  - `Live Frontier integration`
- Source repo:
  - repo: `https://github.com/Zombieliu/eve-frontier-baseops`
  - branch: current working branch for submission snapshot

## Core proof points to show on the submission page

- a real operator console UI, not a starter page
- one live access operation (`issue_jump_permit`)
- one live storage operation (`collect_corpse_bounty`)
- digest-backed proof timeline in the same console
- official Utopia world profile + live Utopia route
- fallback localnet rehearsal path for deterministic demo recovery

## Demo checklist

Before submitting, capture these artifacts:

- screenshot of the main console on the official Utopia world profile
- short clip showing `LOAD UTOPIA PROFILE`
- short clip showing `AUTHORISE LIVE ROUTE`
- clip or screenshots for:
  - `ISSUE PERMIT`
  - `TERMINAL_OVERRIDE`
  - proof timeline updating
  - one digest opened in `SuiScan` or `SuiVision`
- publish transaction digest for the `smart_gate_extension` testnet package
- `ExtensionConfig` object ID
- logs for:
  - `pnpm configure-rules`
  - `pnpm authorise-gate-extension`
  - `pnpm authorise-storage-unit-extension`
  - `pnpm issue-tribe-jump-permit`
  - `pnpm collect-corpse-bounty`
  - `pnpm jump-with-permit`

## Official Utopia world anchors

- `WORLD_PACKAGE_ID` (`published-at`): `0x07e6b810c2dff6df56ea7fbad9ff32f4d84cbee53e496267515887b712924bd1`
- `WORLD_PACKAGE_ID` (`original-id`): `0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75`
- `BUILDER_PACKAGE_ID`: `0x34c884b88860af000965b80eebe74c52a6a64d79b44a70b77278d44e436aab56`
- `EXTENSION_CONFIG_ID`: `0xb395adba3e55fabcaaa7f200d068224e01f43b59732c8a69b7f6d6c8187942e4`
- `TENANT`: `utopia`
- `EXTERNAL_BROWSER_HINT`: `https://uat.dapps.evefrontier.com/?tenant=utopia`

## Current live Utopia route

- `CHARACTER_ITEM_ID`: `2112000086`
- `NETWORK_NODE_ITEM_ID`: `1000000023104`
- `STORAGE_UNIT_ITEM_ID`: `1000000023116`
- `SOURCE_GATE_ITEM_ID`: `1000000023120`
- `DESTINATION_GATE_ITEM_ID`: `1000000023122`
- `LIVE_STORAGE_TYPE_ID`: `77810`

## Repo builder fallback on testnet

- `WORLD_PACKAGE_ID`: `0x284dde8463dc1888671287ff330d1cc6757c08b56c19cbef3fe85e0c1447f9d2`
- `BUILDER_PACKAGE_ID`: `0x522f00da02494c4bc6feddb4d3a964c822cfdf0fb439849f074544b59ed86882`
- `EXTENSION_CONFIG_ID`: `0x25a3ca9edd24a19be1cb7874844d14ebcc982679c180316c82c12581d1445e93`

## Repo runbook

From the project root:

```bash
pnpm install
pnpm run install:dapp
pnpm run type-check
pnpm run type-check:dapp
pnpm run build
```

For the repo-published testnet contract flow:

```bash
pnpm configure-rules
pnpm authorise-gate-extension
pnpm authorise-storage-unit-extension
pnpm issue-tribe-jump-permit
pnpm collect-corpse-bounty
pnpm jump-with-permit
```

## Stillness bonus after April 1

To earn the `+10%` live deployment bonus, the project must be deployed into `Stillness`, the live EVE Frontier server.

Minimum checklist:

1. Deploy the mod into a live Smart Assembly structure on Stillness.
2. Open the deployed object in-game.
3. Copy the `Object ID`.
4. If `Object ID` is unavailable, copy the `Item ID` as fallback.
5. Email `community@evefrontier.com` with:
   - project name
   - DeepSurge project page URL
   - deployed Object ID or Item ID

Suggested subject line:

```text
DeepSurge Stillness deployment - Frontier BaseOps
```

Suggested email body:

```text
Project name: Frontier BaseOps
DeepSurge project page: <paste URL>
Stillness Object ID: <paste object id>
Stillness Item ID: <optional fallback>

This project was deployed into a live Smart Assembly structure on Stillness for the 2026 EVE Frontier hackathon bonus review.
```

## Remaining polish items

1. Confirm browser-side wallet compatibility on official Utopia and, if possible, Stillness.
2. Record one clean 45-second judged demo on the official Utopia world profile.
3. Keep the project framing centered on `Frontier BaseOps`; permit remains a sub-feature, not the project definition.
