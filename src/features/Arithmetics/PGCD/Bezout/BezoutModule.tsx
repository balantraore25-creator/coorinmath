import React, { useState } from 'react';
import { VStack, HStack, Button, Flex } from '@chakra-ui/react';
import { EuclideEtendu } from './EuclideEtendu';
import { RemonteeManuelle } from './RemonteeManuelle';
import { Matricielle } from './Matricielle';
import { RouterChakraLink } from "@/components/ui/RouterChakraLink"

export const BezoutModule: React.FC = () => {
  const [method, setMethod] = useState<'euclide' | 'remontee' | 'matricielle' | null>(null);

  return (
    <VStack align="start" gap={6}>
          <Flex justify="space-between" w="full">
               <RouterChakraLink to="/dash/courses/euclidean" color="teal.500">
                  ← Retour à la page précédente
                </RouterChakraLink>
        </Flex>
      <HStack>
        <Button colorScheme="teal" onClick={() => setMethod('euclide')}>
          Méthode Euclide étendu
        </Button>
        <Button colorScheme="purple" onClick={() => setMethod('remontee')}>
          Méthode Remontée à la main
        </Button>
         <Button colorScheme="orange" onClick={() => setMethod('matricielle')}>
          Méthode Matricielle
        </Button>
      </HStack>

      {method === 'euclide' && <EuclideEtendu />}
      {method === 'remontee' && <RemonteeManuelle />}
     

      {method === 'matricielle' && <Matricielle />}

    </VStack>
  );
};
