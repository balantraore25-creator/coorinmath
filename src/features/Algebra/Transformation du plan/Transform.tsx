"use client"

import { useState } from "react"
import Controls from "./components/Controls"
import type { Transformation } from "./components/Controls"

// ⚡ importe tous tes composants interactifs
import TranslationInteractive from "./components/Translation"
//import RotationInteractive from "./components/RotationInteractive"
import HomothetyInteractive from "./components/homothety"
import RotationCenter from "./components/RotationCenter"
import RotationOrigin from "./components/RotationOrigin"
import SymmetryCenter from "./components/SymmetryCenter"
import SymmetryOrigin from "./components/SymmetryOrigin"
import SymmetryOblique from "./components/SymmetryOblique"
import Conjugate from "./components/Conjugate"

export default function Transform() {
  const [transformation, setTransformation] = useState<Transformation>("translation")

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center" }}>
      {/* Sélecteur de transformation */}
      <Controls onSelect={setTransformation} />

      {/* Affichage dynamique du bon composant */}
      {transformation === "translation" && <TranslationInteractive />}
      {transformation === "rotationOrigin" && <RotationOrigin />}
      {transformation === "rotationCenter" && <RotationCenter />}
      {transformation === "homothety" && <HomothetyInteractive />}
      {transformation === "symmetryCenter" && <SymmetryCenter />}
      {transformation === "symmetryOrigin" && <SymmetryOrigin />}
      {transformation === "symmetryOblique" && <SymmetryOblique />}
      {transformation === "conjugate" && <Conjugate />}
    </div>
  )
}
