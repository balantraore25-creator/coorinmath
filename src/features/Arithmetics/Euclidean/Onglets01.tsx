"use client"

import { Tabs } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import DivisionPanel from "./DivisionPanel"
import MethodesDivisibilitePanel from "./MethodesDivisibilitePanel"
import EcritureModulairePanel from "./EcritureModulairePanel"
import ExerciceEuclideanAuto from "./ExerciceEuclideanAuto"

const Onglets01 = () => {
  <TickValue />
  return (
    <Tabs.Root lazyMount unmountOnExit defaultValue="tab-1">
      <Tabs.List>
        <Tabs.Trigger value="tab-1">Notions et Définition</Tabs.Trigger>
        <Tabs.Trigger value="tab-2">Divisibilité</Tabs.Trigger>
        <Tabs.Trigger value="tab-3">Écriture modulaire</Tabs.Trigger>
        <Tabs.Trigger value="tab-4">Application</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab-1">
        <DivisionPanel />
      </Tabs.Content>
      <Tabs.Content value="tab-2">
        <MethodesDivisibilitePanel />
      </Tabs.Content>
      <Tabs.Content value="tab-3">
        <EcritureModulairePanel />
      </Tabs.Content>
      <Tabs.Content value="tab-4">
        <ExerciceEuclideanAuto />
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

export default Onglets01
