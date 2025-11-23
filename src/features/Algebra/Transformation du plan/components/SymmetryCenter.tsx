"use client"

import { useState, useMemo } from "react"
import { Field, Input, Text, Separator } from "@chakra-ui/react"
import ComplexPlanePanZoom from "./ComplexPlane";
import type { Complex } from "./ComplexPlane";
import TransformationLayout from "./TransformationLayout"

export default function SymmetryCenter() {
  const [z, setZ] = useState<Complex>({ re: 3, im: 2 })
  const [a, setA] = useState<Complex>({ re: 1, im: 1 })

  // ✅ f(z) = 2a - z
  const fz = useMemo<Complex>(
    () => ({ re: 2 * a.re - z.re, im: 2 * a.im - z.im }),
    [z, a]
  )

  const formatComplex = (c: Complex) =>
    `${c.re}${c.im >= 0 ? " + " : " - "}${Math.abs(c.im)}i`

  return (
    <TransformationLayout
      title="Symétrie par rapport à un centre"
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

          <Separator />

          <Field.Root>
            <Field.Label>a.re</Field.Label>
            <Input
              type="number"
              value={a.re}
              onChange={(e) => setA({ ...a, re: parseFloat(e.target.value) || 0 })}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>a.im</Field.Label>
            <Input
              type="number"
              value={a.im}
              onChange={(e) => setA({ ...a, im: parseFloat(e.target.value) || 0 })}
            />
          </Field.Root>
        </>
      }
      results={
        <>
          <Text fontSize="lg" fontWeight="semibold">f(z) = 2a - z</Text>
          <Text mt={2}>z = {formatComplex(z)}</Text>
          <Text>a = {formatComplex(a)}</Text>
          <Text fontWeight="bold" mt={2}>
            f(z) = {formatComplex(fz)}
          </Text>
          <Text mt={2} fontStyle="italic" color="gray.600">
            La symétrie par rapport au centre a renvoie z de l’autre côté de a.
          </Text>
        </>
      }
      plane={
        <ComplexPlanePanZoom
          z={z}
          fz={fz}
          a={a}
          label="Symétrie f(z) = 2a - z"
          showGrid
          showProjections
        />
      }
    />
  )
}
