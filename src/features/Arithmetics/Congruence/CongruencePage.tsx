import { PiStudentBold } from "react-icons/pi"; // 🎓 Icône d'étudiant
import { chakra, Flex, Heading } from "@chakra-ui/react";
import  Onglets04  from './Onglets04'


const CongruencePage = () => {
  return (
    <chakra.main px="6" py="8">
      <Flex align="center" gap="2" mb="6">
        <PiStudentBold size={24} />
        <Heading as="h1" size="lg">
         Confusément Congruent : Guide Express du Chaos Modulaire
        </Heading>
      </Flex>
      <Onglets04 />
    </chakra.main>
  );
};

export default CongruencePage;
