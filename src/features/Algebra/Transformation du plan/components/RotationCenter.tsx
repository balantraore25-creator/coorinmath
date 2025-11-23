"use client"

import { useState, useMemo } from "react"
import { Field, Input, Text, Separator } from "@chakra-ui/react"
import ComplexPlanePanZoom from "./ComplexPlane";
import type { Complex } from "./ComplexPlane";
import TransformationLayout from "./TransformationLayout"

export default function RotationCenter() {
  const [z, setZ] = useState<Complex>({ re: 2, im: 0 })
  const [a, setA] = useState<Complex>({ re: 1, im: 1 })
  const [theta, setTheta] = useState<number>(Math.PI / 2) // 90°
  const [k, setK] = useState<number>(1)

  // ✅ f(z) = a + k·e^(iθ)(z - a)
  const fz = useMemo<Complex>(() => {
    const dz = { re: z.re - a.re, im: z.im - a.im }
    const eitheta = { re: Math.cos(theta), im: Math.sin(theta) }
    const rotated = {
      re: eitheta.re * dz.re - eitheta.im * dz.im,
      im: eitheta.re * dz.im + eitheta.im * dz.re,
    }
    return { re: a.re + k * rotated.re, im: a.im + k * rotated.im }
  }, [z, a, theta, k])

  const formatComplex = (c: Complex) =>
    `${c.re.toFixed(2)}${c.im >= 0 ? " + " : " - "}${Math.abs(c.im).toFixed(2)}i`

  return (
    <TransformationLayout
      title="Rotation autour d’un centre"
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
          <Text fontSize="lg" fontWeight="semibold">f(z) = a + k·e^(iθ)(z - a)</Text>
          <Text mt={2}>z = {formatComplex(z)}</Text>
          <Text>a = {formatComplex(a)}</Text>
          <Text>θ = {theta.toFixed(2)} rad</Text>
          <Text>k = {k}</Text>
          <Text fontWeight="bold" mt={2}>
            f(z) = {formatComplex(fz)}
          </Text>
          <Text mt={2} fontStyle="italic" color="gray.600">
            La rotation autour du centre a déplace z selon θ et applique le facteur k.
          </Text>
        </>
      }
      plane={
        <ComplexPlanePanZoom
          z={z}
          fz={fz}
          a={a}
          label="Rotation f(z) = a + k·e^(iθ)(z - a)"
          showGrid
          showProjections
        />
      }
    />
  )
}
