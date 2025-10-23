import { Box, Text } from "@chakra-ui/react";

export const FinalCarryRow: React.FC<{ carry: string; base: string }> = ({ carry, base }) => {
  return (
    <Box mt={4} p={2} border="2px dashed green" borderRadius="md" bg="green.50">
      <Text fontWeight="bold" color="green.700">
        Retenue finale en base {base} : {carry}
      </Text>
    </Box>
  );
};
