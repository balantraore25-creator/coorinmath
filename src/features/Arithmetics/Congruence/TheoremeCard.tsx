import { Box, HStack, Icon, Text} from "@chakra-ui/react"
import { LuCircleCheck } from "react-icons/lu"

type Props = {
  title: string
  statement: React.ReactNode
  example?: string
}

export const TheoremeCard = ({ title, statement, example }: Props) => (
  <Box>
    <HStack>
      <Icon as={LuCircleCheck} color="green.500" />
      <Text>
        <strong>{title}</strong> : {statement}
      </Text>
    </HStack>
    {example && (
      <Text fontStyle="italic" ps={6} mt={1}>
        Exemple : {example}
      </Text>
    )}
  </Box>
)
