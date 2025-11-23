"use client"

import { useState, useMemo } from "react"
import { Field, Input, Text } from "@chakra-ui/react"
import ComplexPlanePanZoom from "./ComplexPlane";
import type { Complex } from "./ComplexPlane";
import TransformationLayout from "./TransformationLayout"

export default function SymmetryOrigin() {
  const [z, setZ] = useState<Complex>({ re: 2, im: -3 })

  // ✅ f(z) = -z
  const fz = useMemo<Complex>(() => ({ re: -z.re, im: -z.im }), [z])

  const formatComplex = (c: Complex) =>
    `${c.re}${c.im >= 0 ? " + " : " - "}${Math.abs(c.im)}i`

  return (
    <TransformationLayout
      title="Symétrie par rapport à l’origine"
      form={
        <>
          <Field.Root>
            <Field.Label>z.re</Field.Label>
            <Input
              type="number"
              value={z.re}
              onChange={(e) => setZ({ ...z, re: parseFloat(e.target.value) || 0 })}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>z.im</Field.Label>
            <Input
              type="number"
              value={z.im}
              onChange={(e) => setZ({ ...z, im: parseFloat(e.target.value) || 0 })}
            />
          </Field.Root>
        </>
      }
      results={
        <>
          <Text fontSize="lg" fontWeight="semibold">f(z) = -z</Text>
          <Text mt={2}>z = {formatComplex(z)}</Text>
          <Text fontWeight="bold" mt={2}>
            f(z) = {formatComplex(fz)}
          </Text>
          <Text mt={2} fontStyle="italic" color="gray.600">
            La symétrie par rapport à l’origine inverse les coordonnées de z.
          </Text>
        </>
      }
      plane={
        <ComplexPlanePanZoom
          z={z}
          fz={fz}
          label="Symétrie f(z) = -z"
          showGrid
          showProjections
        />
      }
    />
  )
}
