"use client"

import { Tabs } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import BaseSystème from "./BaseSystème"
import IntroNumerationPanel from "./IntroNumerationPanel"
import CodageDesNombresPanel from "./CodageDesNombresPanel"
import ArithmetiqueDesBasesPanel from "./ArithmetiqueDesBasesPanel"
import ExerciceNumerationAuto from "./ExerciceNumerationAuto"

const Onglets02 = () => {
  <TickValue />
  return (
    
    <Tabs.Root lazyMount unmountOnExit defaultValue="tab-1">
      <Tabs.List>
        <Tabs.Trigger value="tab-1">Introduction</Tabs.Trigger>
        <Tabs.Trigger value="tab-2">Systèmes de base</Tabs.Trigger>
        <Tabs.Trigger value="tab-3">Codage des nombres</Tabs.Trigger>
        <Tabs.Trigger value="tab-4">Arithmétique des bases</Tabs.Trigger>
        <Tabs.Trigger value="tab-5">Applications</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab-1">
        Tab 1: Content <IntroNumerationPanel />
      </Tabs.Content>
      <Tabs.Content value="tab-2">
        Tab 2: Content <BaseSystème />
      </Tabs.Content>
      <Tabs.Content value="tab-3">
        Tab 3: Content <CodageDesNombresPanel />
      </Tabs.Content>
       <Tabs.Content value="tab-4">
        Tab 4: Content <ArithmetiqueDesBasesPanel />
      </Tabs.Content>
      <Tabs.Content value="tab-5">
        Tab 5: Content <ExerciceNumerationAuto />
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

export default Onglets02
