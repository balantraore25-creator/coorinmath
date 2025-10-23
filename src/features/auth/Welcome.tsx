import BandeauIcon from '../../components/BandeauIcon';
import { Box, Text, Icon } from "@chakra-ui/react";
import { FaArrowTurnDown } from "react-icons/fa6";
import useAuth from '../../hooks/useAuth'

const Welcome = () => {

  const {username} = useAuth()

  const date = new Date();
  const today = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(date);

  return (
  

<Box p={6}>
  <Box textAlign="center" mt={8}>
    <Text fontSize="lg" mb={2}>{today}</Text>
    <Text fontSize="4xl" fontWeight="bold" mb={4}>Bienvenue { username }!</Text>
    <Text mb={2} color="teal.500" fontWeight="bold" >
      Choisissez une action via les icônes
    </Text>

    <Icon
      as={FaArrowTurnDown}
      color="teal.500"
      boxSize="30px"
      mt={1}
    />
  </Box>

  <BandeauIcon />
</Box>

  );
};
export default Welcome;