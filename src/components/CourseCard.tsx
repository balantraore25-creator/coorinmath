import { Box, Heading, Text, Button, VStack} from '@chakra-ui/react'


interface CourseCardProps {
  title: string
  description: string
  onClick?: () => void
}

const CourseCard = ({ title, description, onClick }: CourseCardProps) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      shadow="md"
      _hover={{ shadow: 'lg' }}
      transition="all 0.2s"
    >
      <VStack align="start">
        <Heading size="md">{title}</Heading>
        <Text fontSize="sm" color="gray.600">
          {description}
        </Text>
        <Button size="sm" colorScheme="teal" onClick={onClick}>
          Voir le Cours
        </Button>
      </VStack>
    </Box>
  )
}

export default CourseCard
