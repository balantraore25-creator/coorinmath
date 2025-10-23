import { PiDivideBold } from "react-icons/pi"; // ➗ Icône pour PGCD (division)
import { chakra, Flex, Heading } from "@chakra-ui/react";
import Onglets03 from "./Onglets03";

const PGCDPage = () => {
  return (
    <chakra.main px="6" py="8">
      <Flex align="center" gap="2" mb="6">
        <PiDivideBold size={24} />
        <Heading as="h1" size="lg">
          La Puissance du PGCD : Trouver le Plus Grand Diviseur Commun avec Panache
        </Heading>
      </Flex>
      <Onglets03 />
    </chakra.main>
  );
};

export default PGCDPage;
