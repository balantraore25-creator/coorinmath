"use client"

import React, { useState } from "react"
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
} from "@chakra-ui/react"

export default function StepperModulaire(): React.ReactNode {
  const [step, setStep] = useState<number>(0)
  const [a, setA] = useState<string>("")
  const [b, setB] = useState<string>("")
  const [n, setN] = useState<string>("")

  const [gcd, setGcd] = useState<number | null>(null)
  const [aPrime, setAPrime] = useState<number | null>(null)
  const [bPrime, setBPrime] = useState<number | null>(null)
  const [nPrime, setNPrime] = useState<number | null>(null)
  const [inverse, setInverse] = useState<number | null>(null)
  const [solution, setSolution] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0))

  const computeGCD = (a: number, b: number): number => {
    while (b !== 0) {
      const temp = a % b
      a = b
      b = temp
    }
    return a
  }

  const extendedEuclidean = (
    a: number,
    b: number
  ): { gcd: number; x: number; y: number } => {
    let s = 0, old_s = 1
    let t = 1, old_t = 0
    let r = b, old_r = a
    while (r !== 0) {
      const q = Math.floor(old_r / r)
      const temp_r = old_r - q * r
      const temp_s = old_s - q * s
      const temp_t = old_t - q * t
      old_r = r
      r = temp_r
      old_s = s
      s = temp_s
      old_t = t
      t = temp_t
    }
    return { gcd: old_r, x: old_s, y: old_t }
  }

  const handleGCD = () => {
    const aInt = parseInt(a)
    const nInt = parseInt(n)
    const result = computeGCD(aInt, nInt)
    setGcd(result)
    setError(null)
    nextStep()
  }

  const handleDivisibility = () => {
    const bInt = parseInt(b)
    if (gcd !== null && bInt % gcd === 0) {
      setError(null)
      nextStep()
    } else {
      setError("❌ b n'est pas divisible par gcd(a, n). Pas de solution.")
    }
  }

  const handleSimplification = () => {
    const aInt = parseInt(a)
    const bInt = parseInt(b)
    const nInt = parseInt(n)
    if (gcd !== null) {
      setAPrime(aInt / gcd)
      setBPrime(bInt / gcd)
      setNPrime(nInt / gcd)
      setError(null)
      nextStep()
    }
  }

  const handleInverse = () => {
    if (aPrime !== null && nPrime !== null) {
      const result = extendedEuclidean(aPrime, nPrime)
      if (result.gcd !== 1) {
        setError("❌ a' et n' ne sont pas premiers entre eux. Pas d'inverse.")
      } else {
        const inv = ((result.x % nPrime) + nPrime) % nPrime
        setInverse(inv)
        setError(null)
        nextStep()
      }
    }
  }

  const handleSolution = () => {
    if (inverse !== null && bPrime !== null && nPrime !== null) {
      const x = (inverse * bPrime) % nPrime
      setSolution(x)
      setError(null)
      nextStep()
    }
  }

  return (
    <Box p={6}>
      {error && <Text color="red.500" mb={4}>{error}</Text>}

      {step === 0 && (
        <VStack>
          <Input placeholder="a" value={a} onChange={(e) => setA(e.target.value)} type="number" />
          <Input placeholder="b" value={b} onChange={(e) => setB(e.target.value)} type="number" />
          <Input placeholder="n" value={n} onChange={(e) => setN(e.target.value)} type="number" />
          <Button onClick={handleGCD} colorScheme="blue">Calculer PGCD</Button>
        </VStack>
      )}

      {step === 1 && (
        <VStack>
          <Text>PGCD de {a} et {n} est {gcd}</Text>
          <Button onClick={handleDivisibility} colorScheme="blue">Vérifier divisibilité</Button>
          <Button onClick={prevStep}>Précédent</Button>
        </VStack>
      )}

      {step === 2 && (
        <VStack>
          <Text>{b} est divisible par {gcd} ✅</Text>
          <Button onClick={handleSimplification} colorScheme="blue">Simplifier l'équation</Button>
          <Button onClick={prevStep}>Précédent</Button>
        </VStack>
      )}

      {step === 3 && (
        <VStack>
          <Text>Équation simplifiée : {aPrime}x ≡ {bPrime} [mod {nPrime}]</Text>
          <Button onClick={handleInverse} colorScheme="blue">Trouver l'inverse de {aPrime}</Button>
          <Button onClick={prevStep}>Précédent</Button>
        </VStack>
      )}

      {step === 4 && (
        <VStack>
          <Text>L'inverse de {aPrime} modulo {nPrime} est {inverse}</Text>
          <Button onClick={handleSolution} colorScheme="blue">Calculer la solution</Button>
          <Button onClick={prevStep}>Précédent</Button>
        </VStack>
      )}

      {step === 5 && (
        <VStack>
          <Text>✅ Solution : x ≡ {solution} [mod {nPrime}]</Text>
          <Button onClick={() => window.location.reload()} colorScheme="red">Recommencer</Button>
          <Button onClick={prevStep}>Précédent</Button>
        </VStack>
      )}
    </Box>
  )
}
