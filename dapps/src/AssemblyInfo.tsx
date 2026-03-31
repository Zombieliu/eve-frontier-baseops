import { Box, Flex, Text } from "@radix-ui/themes";
import { useSmartObject } from "@evefrontier/dapp-kit";

export function AssemblyInfo() {
  const { assembly, assemblyOwner, loading, error } = useSmartObject();

  if (loading) {
    return <Text className="item-meta">Loading live structure context...</Text>;
  }

  if (error) {
    return <Text className="item-meta">Live structure lookup failed: {error}</Text>;
  }

  if (!assembly) {
    return (
      <Text className="item-meta">
        No live structure context yet. Open the app from an assembly-aware
        entry point or set `VITE_ITEM_ID` to load a real Gate or Storage Unit.
      </Text>
    );
  }

  return (
    <Flex direction="column" gap="2">
      <Text className="section-label">Live Structure Context</Text>
      <Box className="kv-row">
        <Text className="item-meta">Name</Text>
        <Text>{assembly.name || assembly.typeDetails?.name}</Text>
      </Box>
      <Box className="kv-row">
        <Text className="item-meta">Type</Text>
        <Text>{assembly.type}</Text>
      </Box>
      <Box className="kv-row">
        <Text className="item-meta">State</Text>
        <Text>{assembly.state}</Text>
      </Box>
      <Box className="kv-row">
        <Text className="item-meta">ID</Text>
        <Text className="mono-text">{assembly.id}</Text>
      </Box>
      {assemblyOwner ? (
        <Box className="kv-row">
          <Text className="item-meta">Owner</Text>
          <Text>{assemblyOwner.name}</Text>
        </Box>
      ) : null}
    </Flex>
  );
}
