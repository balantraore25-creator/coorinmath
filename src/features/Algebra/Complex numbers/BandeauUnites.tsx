import { Box, Grid, Heading, Text} from "@chakra-ui/react";
import { RouterChakraLink } from "@/components/ui/RouterChakraLink"
import { List } from "@chakra-ui/react"; // Chakra v3: List.Root et List.Item sont des sous-composants

const getActivitesForUnite = (unite: number): string[] => [
  `Activité ${unite}.1`,
  `Activité ${unite}.2`,
  `Activité ${unite}.3`,
];

const BandeauUnites = () => {
  const unites = Array.from({ length: 16 }, (_, i) => i + 1);

  return (
    <Grid
      templateColumns="repeat(4, 1fr)"
      gap={6}
      p={6}
      bg="transparent"
      backdropFilter="blur(6px)"
    >
      {unites.map((unite) => (
        <Box
          key={unite}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          boxShadow="md"
          bg="white"
          _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
          transition="all 0.2s ease-in-out"
        >
          <Heading size="md" mb={2}>
            Unité {unite}
          </Heading>

          <Text fontWeight="semibold" mb={2}>
            Activités :
          </Text>

          <List.Root gap={1} mb={4}>
            {getActivitesForUnite(unite).map((activite, index) => (
              <List.Item key={index}>• {activite}</List.Item>
            ))}
          </List.Root>

          <RouterChakraLink to={`/unite/${unite}`} color="teal.500" fontWeight="bold">
            Voir l’unité →
          </RouterChakraLink>
        </Box>
      ))}
    </Grid>
  );
};

export default BandeauUnites;




/*import { Box, Grid, Heading, List, ListItem, Text } from "@chakra-ui/react";

import { RouterChakraLink } from "@/components/ui/RouterChakraLink"

// Exemple d'activités fictives par unité
const getActivitesForUnite = (unite: number): string[] => {
  return [
    `Activité ${unite}.1`,
    `Activité ${unite}.2`,
    `Activité ${unite}.3`,
  ];
};

const BandeauUnites = () => {
  const unites = Array.from({ length: 16 }, (_, i) => i + 1); // [1, 2, ..., 16]

  return (
    <Grid
      templateColumns="repeat(4, 1fr)"
      gap={6}
      p={6}
      bg="transparent"
      backdropFilter="blur(6px)"
    >
      {unites.map((unite) => (
        <Box
          key={unite}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          boxShadow="md"
          bg="white"
          _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
          transition="all 0.2s ease-in-out"
        >
          <Heading size="md" mb={2}>
            Unité {unite}
          </Heading>

          <Text fontWeight="semibold" mb={2}>
            Activités :
          </Text>
          <List gap={1} mb={4}>
            {getActivitesForUnite(unite).map((activite, index) => (
              <ListItem key={index}>• {activite}</ListItem>
            ))}
          </List>

          <RouterChakraLink to={`/unite/${unite}`} color="teal.500" fontWeight="bold">
            Voir l’unité →
          </RouterChakraLink>
        </Box>
      ))}
    </Grid>
  );
};

export default BandeauUnites;*/
