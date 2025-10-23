"use client"

import { Tabs } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import PgcdPpmcPanel from "./PgcdPpmcPanel"
import PgcdPpmcPropertiesList from "./PgcdPpmcPropertiesList"
import TheoremPanelList from "./TheoremPanelList"
import ExercicePgcdPpmcAuto from "./ExercicePgcdPpmcAuto"

const Onglets03 = () => {
   <TickValue />
  return (
    <Tabs.Root lazyMount unmountOnExit defaultValue="tab-1">
      <Tabs.List>
        <Tabs.Trigger value="tab-1">PGCD & PPCM</Tabs.Trigger>
        <Tabs.Trigger value="tab-2">Propriétés</Tabs.Trigger>
        <Tabs.Trigger value="tab-3">Théorèmes</Tabs.Trigger>
        <Tabs.Trigger value="tab-4">Applications</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab-1">
        <PgcdPpmcPanel />
      </Tabs.Content>
      <Tabs.Content value="tab-2">
         <PgcdPpmcPropertiesList />
      </Tabs.Content>
      <Tabs.Content value="tab-3">
         <TheoremPanelList />
      </Tabs.Content>
      <Tabs.Content value="tab-4">
         <ExercicePgcdPpmcAuto />
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

export default Onglets03
