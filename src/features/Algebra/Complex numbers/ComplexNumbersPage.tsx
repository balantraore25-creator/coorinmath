import { PiStudentBold } from "react-icons/pi"; // 🎓 Icône d'étudiant
import { chakra, Flex, Heading } from "@chakra-ui/react";
import   BandeauUnites    from './BandeauUnites'


const ComplexNumbersPage = () => {
  return (
    <chakra.main px="6" py="8">
      <Flex align="center" gap="2" mb="6">
        <PiStudentBold size={24} />
        <Heading as="h1" size="lg">
         Complex Numbers 101 : du chaos au contrôle
        </Heading>
      </Flex>
      <BandeauUnites />
    </chakra.main>
  );
};

export default ComplexNumbersPage;
