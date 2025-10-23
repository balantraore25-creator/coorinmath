import React, { useState } from 'react';
import { VStack, Button, ButtonGroup } from '@chakra-ui/react';


import { FacteursModule } from './FacteursModule';
import { FormuleModule } from './FormuleModule';
import { EuclideMethode } from './EuclideModule';

type MethodType = 'euclide' | 'facteurs' | 'formule';

export const PPCDMethodSwitcher: React.FC = () => {
  const [method, setMethod] = useState<MethodType>('euclide');

  return (
    <VStack >
      <ButtonGroup attached variant="outline" colorScheme="teal">
        <Button onClick={() => setMethod('euclide')}>Algorithme d’Euclide</Button>
        <Button onClick={() => setMethod('facteurs')}>Décomposition</Button>
        <Button onClick={() => setMethod('formule')}>Formule PGCD × PPCM</Button>
      </ButtonGroup>

      {method === 'euclide' && <EuclideMethode />}
      {method === 'facteurs' && <FacteursModule />}
      {method === 'formule' && <FormuleModule />}
    </VStack>
  );
};
