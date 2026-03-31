import { Box, Flex, Text } from "@radix-ui/themes";
import { AssemblyInfo } from "./AssemblyInfo";
import { useCurrentAccount } from "@mysten/dapp-kit-react";

export function WalletStatus() {
  const account = useCurrentAccount();

  return (
    <Flex direction="column" gap="3" className="status-stack">
      {account ? (
        <Flex direction="column" gap="2">
          <Box className="status-pill">EVE Vault connected</Box>
          <Text className="item-meta">Operator address</Text>
          <Text className="mono-text">{account.address}</Text>
        </Flex>
      ) : (
        <Flex direction="column" gap="2">
          <Box className="status-pill status-pill--muted">Wallet idle</Box>
          <Text className="item-meta">
            Connect EVE Vault to turn this panel into a live operator session.
          </Text>
        </Flex>
      )}

      <div className="divider" />

      <AssemblyInfo />
    </Flex>
  );
}
