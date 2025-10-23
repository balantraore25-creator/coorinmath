import { PiNumberCircleTwoBold } from "react-icons/pi"; // 🔢 Icône pour numération
import { chakra, Flex, Heading } from "@chakra-ui/react";
import Onglets02 from "./Onglets02";

const NumerationPage = () => {
  return (
    <chakra.main px="6" py="8">
      <Flex align="center" gap="2" mb="6">
        <PiNumberCircleTwoBold size={24} />
        <Heading as="h1" size="lg">
          La Nation des Nombres : Les Systèmes de Numération à Travers les Âges
        </Heading>
      </Flex>
      <Onglets02 />
    </chakra.main>
  );
};

export default NumerationPage;
