import React, { useState } from 'react';
import { VStack, HStack, Button,Link, Flex } from '@chakra-ui/react';
import { EuclideEtendu } from './EuclideEtendu';
import { RemonteeManuelle } from './RemonteeManuelle';
import { Matricielle } from './Matricielle';

export const BezoutModule: React.FC = () => {
  const [method, setMethod] = useState<'euclide' | 'remontee' | 'matricielle' | null>(null);

  return (
    <VStack align="start" gap={6}>
          <Flex justify="space-between" w="full">
              <Link
              href="/dash/courses/pgcd"
              color="teal.500"
              fontWeight="medium"
              mb={4}
              display="inline-block"
            >
              ← Retour à la page précédente
            </Link>
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
