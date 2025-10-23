import { VStack, Text, Code, Box, Heading } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

type ModClassEntry = {
  a: number
  p: number
  n: number
  cycle: number[]
  result: number
  timestamp: string
}

export const ModClassHistory = () => {
  const [history, setHistory] = useState<ModClassEntry[]>([])

  useEffect(() => {
    const raw = localStorage.getItem('modClassHistory')
    if (raw) setHistory(JSON.parse(raw))
  }, [])

  return (
    <VStack align="start" p="6">
      <Heading size="md">Historique des calculs</Heading>
      {history.length === 0 && <Text>Aucun calcul enregistré.</Text>}
      {history.map((entry, idx) => (
        <Box key={idx} p="4" borderWidth="1px" borderRadius="md" w="full">
          <Text><strong>a:</strong> <Code>{entry.a}</Code> | <strong>p:</strong> <Code>{entry.p}</Code> | <strong>n:</strong> <Code>{entry.n}</Code></Text>
          <Text><strong>Cycle:</strong> <Code>{entry.cycle.join(', ')}</Code></Text>
          <Text><strong>Résultat:</strong> <Code>{entry.result}</Code></Text>
          <Text fontSize="sm" color="gray.500">Calculé le {new Date(entry.timestamp).toLocaleString()}</Text>
        </Box>
      ))}
    </VStack>
  )
}
