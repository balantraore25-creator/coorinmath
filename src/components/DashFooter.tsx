import { Flex, Text, Box, Button } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const DashFooter: React.FC = () => {
  const { username, status } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onGoHomeClicked = () => navigate('/dash')

  return (
    <Flex
      as="footer"
      justify="space-between"
      align="center"
      px={4}
      py={3}
      bg="gray.800"
      borderTop="1px solid"
      borderColor="gray.200"
      w="full"
    >
      {pathname !== '/dash' && (
        <Button
          onClick={() => onGoHomeClicked()}
          aria-label="Retour à l'acceuil"        
          variant="solid"
          size="xl"
          p={4}
          h="60px"
          minW="60px"
          borderRadius="md"
          transition="all 0.3s ease"
          _hover={{
          transform: "scale(1.1)",
          bg: "whiteAlpha.300",
      }}
          >
           <FontAwesomeIcon icon={faHouse} />     
          </Button>
        
      )}

      <Box textAlign="right">
        <Text fontSize="sm" color="white">Current User: {username}</Text>
        <Text fontSize="sm"  color="white">Status: {status}</Text>
      </Box>
    </Flex>
  )
}

export default DashFooter



/*import { Box, Flex, Text, IconButton} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu"

import { useNavigate, useLocation } from "react-router-dom";

const DashFooter = () => {
   const navigate = useNavigate();
  const { pathname } = useLocation();

  const onGoHomeClicked = () => {
    navigate("/dash");
  };

  const showHomeButton =
    pathname.startsWith("/dash/courses") ||
    pathname.startsWith("/dash/users");

  return (
    <Box
      as="footer"
      py={4}
      px={6}
      borderTop="1px"
      borderColor="gray.700"
      bg="gray.800"
    >
      <Flex justify="space-between" align="center" flexWrap="wrap">
        <Flex align="center" gap={2}>
          {showHomeButton && (
          <IconButton aria-label="Retour à l'acceuil"  title="Accueil"
              onClick={onGoHomeClicked}
              variant="ghost"
              size="sm">
           <LuSearch />
         </IconButton>
             
          )}
          <Text fontSize="sm" color="white">
            © {new Date().getFullYear()} SiraMath. Tous droits réservés.
          </Text>
        </Flex>

        <Flex direction="column" align="flex-end" gap={1} color="white">
          <Text fontSize="sm" color="inherit">
            Current User:
          </Text>
          <Text fontSize="sm">Status:</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default DashFooter;*/
