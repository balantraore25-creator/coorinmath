



"use client"

import { Tabs, Flex } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { DefinitionPanel }  from "./DefinitionPanel"
//import  CongruencePropertiesList  from "./CongruencePropertiesList"
//import  TheoremePanel  from  "./TheoremePanel"
//import  DivisibilityPanel  from "./DivisibilityPanel"
//import ExerciceCongruenceAuto from "./ExerciceCongruenceAuto"

const Onglets05 = () => {
  return (
    <Tabs.Root lazyMount unmountOnExit defaultValue="tab-1">
      <TickValue />
      <Flex
        wrap="wrap"
        gap={2}
        justify={{ base: "center", md: "flex-start" }}
        px={2}
      >
      <Tabs.List>
        <Tabs.Trigger value="tab-1">📘 Définition</Tabs.Trigger>
        <Tabs.Trigger value="tab-2"> 🧩 Propriétés</Tabs.Trigger>
        <Tabs.Trigger value="tab-3">➗ Divisibilité</Tabs.Trigger>
        <Tabs.Trigger value="tab-4">🧱 Théorèmes</Tabs.Trigger>
        <Tabs.Trigger value="tab-5">🛠️ Applications</Tabs.Trigger>
      </Tabs.List>
      </Flex>
      <Tabs.Content value="tab-1">
         <DefinitionPanel />
      </Tabs.Content>
      <Tabs.Content value="tab-2">
       <TickValue />
      </Tabs.Content>
      <Tabs.Content value="tab-3">
        <TickValue />
      </Tabs.Content>
      <Tabs.Content value="tab-4">
         <TickValue />
      </Tabs.Content>
       <Tabs.Content value="tab-5">
        <TickValue />
      </Tabs.Content>
    </Tabs.Root>
  )
}



const TickValue = () => {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setValue((v) => v + 1)
    }, 1000)
    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return (
    <span style={{ fontWeight: "bold", color: "tomato", padding: 4 }}>
      {value}
    </span>
  )
}

export default Onglets05
