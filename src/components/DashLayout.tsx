import { Outlet } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'

const DashLayout = () => {
  return (
    <Flex direction="column" minH="100vh">
      <DashHeader />
      <Box flex="1" px={{ base: 4, md: 8 }} py={6}>
        <Outlet />
      </Box>
      <DashFooter />
    </Flex>
  )
}

export default DashLayout
