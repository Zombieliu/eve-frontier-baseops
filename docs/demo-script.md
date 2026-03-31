# Frontier BaseOps Demo Script

## 45-second judge version

1. Open Frontier BaseOps and say: `This is a live operator console for EVE Frontier bases, not a generic admin dashboard.`
2. Point to the top bar and say: `The console can switch environments, but for the judged flow we use the validated testnet profile.`
3. In the Operator Manual section, load the `TESTNET PROFILE` and say: `This preloads the exact world, builder extension, gate route, storage unit, and character used in the demo.`
4. Point to `SMART GATE CONTROL` and say: `First I issue a route permit through a real Smart Gate extension.`
5. Trigger `ISSUE PERMIT`.
6. Point to `STORAGE LOGISTICS` and say: `Then I run a storage-side workflow that issues or uses permission based on an in-world asset handoff.`
7. Trigger `TERMINAL_OVERRIDE`.
8. Point to `OPERATIONAL LOG // PROOF TIMELINE` and say: `The important part is not the button click. The important part is that the resulting digest comes back into the same operator surface as proof.`
9. Close with: `Frontier BaseOps turns native gate, storage, and delegate primitives into one readable operations workflow for organizations.`

## 90-second technical version

1. `This project is anchored in Frontier-native primitives: Smart Gates, Storage Units, Character ownership, and transaction proof.`
2. `The app can run against localnet for deterministic rehearsal, but this version also has a validated testnet path.`
3. `The control surface is intentionally split into operations, infrastructure state, and proof timeline.`
4. `Gate Ops issues a live permit through the builder extension.`
5. `Storage Ops runs a live storage mutation and captures the resulting state transition.`
6. `The proof timeline reads back the digest and displays the result in a way an operator can actually use.`
7. `The advanced controls remain visible because this is an operator tool, not a polished black-box consumer app.`

## Demo checklist

1. Open `http://127.0.0.1:4178/`
2. Ensure the top bar network is `testnet`
3. Click `LOAD TESTNET PROFILE`
4. Confirm source gate, destination gate, storage unit, and character are all populated
5. Connect the wallet if browser-side testnet signing is available
6. Trigger `ISSUE PERMIT`
7. Trigger `TERMINAL_OVERRIDE`
8. Point to the proof timeline and the infrastructure rail

## Current validated testnet assets

- `WORLD_PACKAGE_ID`: `0x284dde8463dc1888671287ff330d1cc6757c08b56c19cbef3fe85e0c1447f9d2`
- `BUILDER_PACKAGE_ID`: `0x522f00da02494c4bc6feddb4d3a964c822cfdf0fb439849f074544b59ed86882`
- `EXTENSION_CONFIG_ID`: `0x25a3ca9edd24a19be1cb7874844d14ebcc982679c180316c82c12581d1445e93`
- Source gate object: `0xc5c4135678039b15960dc52136732f50a84458f6457ecc5b803ccdb9fcbd5eda`
- Destination gate object: `0x5b497d6b228311de0f86e48065d10c2fcc3b99a299bb389224d3202409b92a30`
- Storage unit object: `0xf975428edf3dd09364afb609179656cde5a3ad5aa17c72268951839573fd7eb0`
- Character object: `0xd7cf4a82fdb2671ebe20ec3d390a8e33b77daaa498272f4038939347f88b28c8`
