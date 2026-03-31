# Frontier BaseOps MVP IA

## Product framing

Frontier BaseOps is an operator console for EVE Frontier organizations.
It turns native primitives like Smart Gates, Storage Units, and live activity events into one readable workflow for base operations.

## Page 1: Overview

Purpose: give an org operator a single snapshot of what matters right now.

Primary blocks:

- tracked structures list for Gate, Storage Unit, and optional Network Node
- status strip for live, degraded, or attention-needed structures
- recent event summary for permits, jumps, and storage actions
- connected wallet and current assembly context

Primary question answered: what is the state of the base right now?

## Page 2: Access Ops

Purpose: grant or review one-time execution access for external actors.

Primary blocks:

- target structure selector for a Smart Gate or other access-controlled object
- assignee panel for contractor, hauler, or allied pilot
- action composer for gate access, jump permit, or role-scoped execution
- confirmation state and resulting proof event

Primary question answered: who can do what, where, and was the operation accepted?

## Page 3: Storage Ops + Event Feed

Purpose: coordinate delivery or retrieval and prove what just happened.

Primary blocks:

- storage unit selector and inventory handoff context
- action rail for delivery, pickup, access review, or revocation
- event feed with permit, jump, and storage activity in one timeline
- live proof callouts for tx hash, actor, structure, and latest status

Primary question answered: did the storage handoff happen, and can the operator verify it immediately?

## Demo loop

1. Open Overview and show a live structure context.
2. Grant an access action for an external executor.
3. Trigger a storage operation.
4. Read the resulting event back in the feed as proof.

## MVP boundary

- In scope: Overview, Access Ops, Storage Ops, event verification, EVE Vault connection, official primitive integration.
- Out of scope for day one: full scanning product, DAO governance, overlays, broad settlement simulation, deep reputation systems.
