import { Box, Stack, Text } from '@chakra-ui/react'

export const ClassVisualizer = ({
  values,
  modulo,
}: {
  values: number[]
  modulo: number
}) => {
  return (
    <Box mt="8">
      <Text fontWeight="bold" mb="2">Visualisation des classes sur la droite :</Text>
      <Stack direction="row" wrap="wrap" >
        {values.map((value, i) => {
          const r = ((value % modulo) + modulo) % modulo
          const color = `hsl(${(r * 360) / modulo}, 70%, 60%)`

          return (
            <Box
              key={i}
              p="2"
              borderRadius="full"
              bg={color}
              color="white"
              minW="40px"
              textAlign="center"
              fontWeight="bold"
              title={`Classe ${r}`}
            >
              {value}
            </Box>
          )
        })}
      </Stack>
      <Text mt="2" fontSize="sm" color="gray.600">
        Chaque couleur représente une classe modulo {modulo}. Par exemple, tous les entiers congrus à 2 mod {modulo} ont la même couleur.
      </Text>
    </Box>
  )
}
