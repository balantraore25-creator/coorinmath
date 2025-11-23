"use client"

import { useState, useMemo } from "react"
import { Field, Input, Text, Separator } from "@chakra-ui/react"
import ComplexPlanePanZoom from "./ComplexPlane";
import type { Complex } from "./ComplexPlane";
import TransformationLayout from "./TransformationLayout"

export default function RotationOrigin() {
  const [z, setZ] = useState<Complex>({ re: 1, im: 1 })
  const [theta, setTheta] = useState<number>(Math.PI / 2) // 90°
  const [k, setK] = useState<number>(1)

  // ✅ f(z) = k·e^(iθ)·z
  const fz = useMemo<Complex>(() => {
    const eitheta = { re: Math.cos(theta), im: Math.sin(theta) }
    return {
      re: k * (eitheta.re * z.re - eitheta.im * z.im),
      im: k * (eitheta.re * z.im + eitheta.im * z.re),
    }
  }, [z, theta, k])

  const formatComplex = (c: Complex) =>
    `${c.re.toFixed(2)}${c.im >= 0 ? " + " : " - "}${Math.abs(c.im).toFixed(2)}i`

  return (
    <TransformationLayout
      title="Rotation autour de l’origine"
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
            <Field.Label>θ (radians)</Field.Label>
            <Input
              type="number"
              value={theta}
              onChange={(e) => setTheta(parseFloat(e.target.value) || 0)}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>k (facteur)</Field.Label>
            <Input
              type="number"
              value={k}
              onChange={(e) => setK(parseFloat(e.target.value) || 0)}
            />
          </Field.Root>
        </>
      }
      results={
        <>
          <Text fontSize="lg" fontWeight="semibold">f(z) = k·e^(iθ)·z</Text>
          <Text mt={2}>θ = {theta.toFixed(2)} rad</Text>
          <Text>k = {k}</Text>
          <Text>z = {formatComplex(z)}</Text>
          <Text fontWeight="bold" mt={2}>
            f(z) = {formatComplex(fz)}
          </Text>
          <Text mt={2} fontStyle="italic" color="gray.600">
            La rotation multiplie z par e^(iθ), puis applique le facteur k.
          </Text>
        </>
      }
      plane={
        <ComplexPlanePanZoom
          z={z}
          fz={fz}
          label="Rotation f(z) = k·e^(iθ)·z"
          showGrid
          showProjections
        />
      }
    />
  )
}
