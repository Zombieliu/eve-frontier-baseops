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
- It can be validated in controlled localnet rehearsal and in a public testnet environment.

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
  - strong: works with native Frontier primitives and now has a validated testnet path
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
- validated testnet world + builder flow
- fallback localnet rehearsal path for deterministic demo recovery

## Demo checklist

Before submitting, capture these artifacts:

- screenshot of the main console on the validated testnet profile
- short clip showing `LOAD TESTNET PROFILE`
- clip or screenshots for:
  - `ISSUE PERMIT`
  - `TERMINAL_OVERRIDE`
  - proof timeline updating
- publish transaction digest for the `smart_gate_extension` testnet package
- `ExtensionConfig` object ID
- logs for:
  - `pnpm configure-rules`
  - `pnpm authorise-gate-extension`
  - `pnpm authorise-storage-unit-extension`
  - `pnpm issue-tribe-jump-permit`
  - `pnpm collect-corpse-bounty`
  - `pnpm jump-with-permit`

## Current validated testnet assets

- `WORLD_PACKAGE_ID`: `0x284dde8463dc1888671287ff330d1cc6757c08b56c19cbef3fe85e0c1447f9d2`
- `BUILDER_PACKAGE_ID`: `0x522f00da02494c4bc6feddb4d3a964c822cfdf0fb439849f074544b59ed86882`
- `EXTENSION_CONFIG_ID`: `0x25a3ca9edd24a19be1cb7874844d14ebcc982679c180316c82c12581d1445e93`
- Source gate object: `0xc5c4135678039b15960dc52136732f50a84458f6457ecc5b803ccdb9fcbd5eda`
- Destination gate object: `0x5b497d6b228311de0f86e48065d10c2fcc3b99a299bb389224d3202409b92a30`
- Storage unit object: `0xf975428edf3dd09364afb609179656cde5a3ad5aa17c72268951839573fd7eb0`
- Character object: `0xd7cf4a82fdb2671ebe20ec3d390a8e33b77daaa498272f4038939347f88b28c8`

## Repo runbook

From the project root:

```bash
pnpm install
pnpm run install:dapp
pnpm run type-check
pnpm run type-check:dapp
pnpm run build
```

For the live testnet contract flow:

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

1. Confirm browser-side wallet compatibility on testnet and, if possible, Stillness.
2. Record one clean 45-second judged demo on the validated testnet profile.
3. Keep the project framing centered on `Frontier BaseOps`; permit remains a sub-feature, not the project definition.
