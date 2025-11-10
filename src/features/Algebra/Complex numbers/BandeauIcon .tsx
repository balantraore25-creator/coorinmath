import { Grid, IconButton, Text, Center } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { RouterChakraLink } from "@/components/ui/RouterChakraLink"
import { Tooltip } from "@/components/ui/tooltip";
import type { ComponentPropsWithoutRef } from "react";

// ✅ Typage correct pour motion(IconButton)
const MotionIconButton = motion<Omit<ComponentPropsWithoutRef<typeof IconButton>, "ref">>(IconButton);

const BandeauIcon = () => {
  const units = Array.from({ length: 16 }, (_, i) => i + 1); // [1, 2, ..., 16]

  return (
    <Grid
      templateColumns="repeat(4, 1fr)"
      gap={6}
      p={6}
      justifyItems="center"
      bg="transparent"
      backdropFilter="blur(6px)"
    >
      {units.map((unit) => (
        <Tooltip
          key={unit}
          content={`Unité ${unit}`}
          showArrow
          openDelay={300}
          closeDelay={100}
          contentProps={{
            bg: "gray.800",
            color: "white",
            px: 3,
            py: 2,
            borderRadius: "md",
            fontSize: "sm",
          }}
          positioning={{ placement: "top", offset: { mainAxis: 8 } }}
        >
          <RouterChakraLink to={`/unite/${unit}`}>
            <MotionIconButton
              aria-label={`Unité ${unit}`}
              whileHover={{ scale: 1.2, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Center>
                <Text fontWeight="bold" fontSize="md">
                  {unit}
                </Text>
              </Center>
            </MotionIconButton>
          </RouterChakraLink>
        </Tooltip>
      ))}
    </Grid>
  );
};

export default BandeauIcon;
