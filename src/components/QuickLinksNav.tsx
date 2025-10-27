// components/QuickLinksNav.tsx
import { Flex, IconButton , Box} from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipPositioner,
} from "@ark-ui/react/tooltip"

import type { IconType } from "react-icons"

export interface LinkItem {
  to: string
  label: string
  icon: IconType
}

interface QuickLinksNavProps {
  links: LinkItem[]
}

const MotionIconButton = motion(IconButton)

export const QuickLinksNav: React.FC<QuickLinksNavProps> = ({ links }) => (
  <Flex gap={4} mt={4} justify="center">
    {links.map(({ to, label, icon: IconComponent }) => (
      <TooltipRoot key={to} openDelay={300} closeDelay={100}>
  <TooltipTrigger asChild>
    <Link to={to}>
      <MotionIconButton
        aria-label={label}
        variant="ghost"
        whileHover={{ scale: 1.2, y: -2 }}
        transition={{ type: "spring", stiffness: 300 }}
        size="sm"
      >
        <IconComponent />
      </MotionIconButton>
    </Link>
  </TooltipTrigger>
  <TooltipPositioner>
    <TooltipContent>
  <Box
    bg="gray.800"
    color="white"
    px={3}
    py={2}
    borderRadius="md"
    fontSize="sm"
  >
    {label}
    <TooltipArrow />
  </Box>
</TooltipContent>
  </TooltipPositioner>
</TooltipRoot>

    ))}
  </Flex>
)
