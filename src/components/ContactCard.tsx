

import {
  Box,
  Flex,
  Icon,
  Text,
  Stack,

} from '@chakra-ui/react'
import { MdLocationOn, MdEmail, MdPhone } from 'react-icons/md'

const ContactCard = () => {
  return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="lg"
     
      shadow="md"
      maxW="400px"
      w="full"
    >
      <Stack >
        <Flex align="center">
          <Icon as={MdLocationOn} boxSize={6} color="teal.500" mr={3} />
          <Text>Rue 541 P47 Quinzambougou, Bamako, Mali</Text>
        </Flex>

        <Flex align="center">
          <Icon as={MdEmail} boxSize={6} color="teal.500" mr={3} />
          <Text>coorinmath@outlook.com</Text>
        </Flex>

        <Flex align="center">
          <Icon as={MdPhone} boxSize={6} color="teal.500" mr={3} />
          <Text>+223 76 18 61 70</Text>
        </Flex>
      </Stack>
    </Box>
  )
}

export default ContactCard
