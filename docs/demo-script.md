# Frontier BaseOps Demo Script

## 45-second judge version

1. Open Frontier BaseOps and say: `This is a live operator console for EVE Frontier bases, not a generic admin dashboard.`
2. Point to the top bar and say: `The chain network stays on Sui testnet, but the world profile is switched to the official Utopia environment.`
3. In the Operator Manual section, load the `UTOPIA PROFILE` and say: `This aligns the console with the official Utopia world package and tenant.`
4. If you need the repo's deterministic extension write path for rehearsal, click `LOAD BUILDER TESTNET` before touching the action panels.
5. Point to `SMART GATE CONTROL` and say: `First I issue a route permit through a real Smart Gate extension.`
6. Trigger `ISSUE PERMIT`.
7. Point to `STORAGE LOGISTICS` and say: `Then I run a storage-side workflow that issues or uses permission based on an in-world asset handoff.`
8. Trigger `TERMINAL_OVERRIDE`.
9. Point to `OPERATIONAL LOG // PROOF TIMELINE` and say: `The important part is not the button click. The important part is that the resulting digest comes back into the same operator surface as proof.`
10. Close with: `Frontier BaseOps turns native gate, storage, and delegate primitives into one readable operations workflow for organizations.`

## 90-second technical version

1. `This project is anchored in Frontier-native primitives: Smart Gates, Storage Units, Character ownership, and transaction proof.`
2. `The app can run against localnet for deterministic rehearsal, points at the official Utopia world by default, and keeps a repo testnet builder fallback for deterministic extension writes.`
3. `The control surface is intentionally split into operations, infrastructure state, and proof timeline.`
4. `Gate Ops issues a live permit through the builder extension.`
5. `Storage Ops runs a live storage mutation and captures the resulting state transition.`
6. `The proof timeline reads back the digest and displays the result in a way an operator can actually use.`
7. `The advanced controls remain visible because this is an operator tool, not a polished black-box consumer app.`

## Demo checklist

1. Open `http://127.0.0.1:4178/`
2. Ensure the top bar network is `testnet`
3. Click `LOAD UTOPIA PROFILE`
4. Confirm the runtime config points to the official Utopia world package and `tenant=utopia`
5. If you need the repo's seeded write path, click `LOAD BUILDER TESTNET`
6. Connect the wallet if browser-side testnet signing is available
7. Trigger `ISSUE PERMIT`
8. Trigger `TERMINAL_OVERRIDE`
9. Point to the proof timeline and the infrastructure rail

## Official Utopia world anchors

- `WORLD_PACKAGE_ID` (`published-at`): `0x07e6b810c2dff6df56ea7fbad9ff32f4d84cbee53e496267515887b712924bd1`
- `WORLD_PACKAGE_ID` (`original-id`): `0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75`
- `BUILDER_PACKAGE_ID`: `0x34c884b88860af000965b80eebe74c52a6a64d79b44a70b77278d44e436aab56`
- `EXTENSION_CONFIG_ID`: `0xb395adba3e55fabcaaa7f200d068224e01f43b59732c8a69b7f6d6c8187942e4`
- `TENANT`: `utopia`
- `EXTERNAL_BROWSER_HINT`: `https://uat.dapps.evefrontier.com/?tenant=utopia`

## Repo builder fallback on testnet

- `WORLD_PACKAGE_ID`: `0x284dde8463dc1888671287ff330d1cc6757c08b56c19cbef3fe85e0c1447f9d2`
- `BUILDER_PACKAGE_ID`: `0x522f00da02494c4bc6feddb4d3a964c822cfdf0fb439849f074544b59ed86882`
- `EXTENSION_CONFIG_ID`: `0x25a3ca9edd24a19be1cb7874844d14ebcc982679c180316c82c12581d1445e93`
