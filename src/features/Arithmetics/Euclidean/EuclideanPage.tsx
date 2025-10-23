import { PiFunctionBold } from "react-icons/pi"; // 📐 Icône pour logique/math
import { chakra, Flex, Heading } from "@chakra-ui/react";
import Onglets01 from "./Onglets01";

const EuclideanPage = () => {
  return (
    <chakra.main px="6" py="8">
      <Flex align="center" gap="2" mb="6">
        <PiFunctionBold size={24} />
        <Heading as="h1" size="lg">
          Euclidean Essentials: Cracking the Code of Divisibility
        </Heading>
      </Flex>
      <Onglets01 />
    </chakra.main>
  );
};

export default EuclideanPage;
