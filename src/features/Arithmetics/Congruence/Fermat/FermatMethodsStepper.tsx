//import React from "react";
import { Tabs, Heading, Stack } from "@chakra-ui/react";
import FermatStepper from "./FermatStepper";
import FermatCorollaireStepper from "./FermatCorollaireStepper";

export default function FermatMethodsStepper() {
  return (
    <Stack gap={6}>
      <Heading size="lg">Méthodes basées sur le théorème de Fermat</Heading>

      <Tabs.Root defaultValue="fermat" variant="enclosed" colorPalette="teal">
        <Tabs.List>
          <Tabs.Trigger value="fermat">Petit Théorème de Fermat</Tabs.Trigger>
          <Tabs.Trigger value="corollaire">Corollaire de Fermat</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="fermat">
          <FermatStepper />
        </Tabs.Content>

        <Tabs.Content value="corollaire">
          <FermatCorollaireStepper />
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  );
}
