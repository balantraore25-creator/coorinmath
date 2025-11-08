import { forwardRef } from "react"
import { Link as RouterLink } from "react-router-dom"
import { Link as ChakraLink } from "@chakra-ui/react"
import type { LinkProps as RouterLinkProps } from "react-router-dom"
import type { LinkProps as ChakraLinkProps } from "@chakra-ui/react"

type Props = RouterLinkProps & ChakraLinkProps

export const RouterChakraLink = forwardRef<HTMLAnchorElement, Props>((props, ref) => (
  <ChakraLink as={RouterLink} ref={ref} {...props} />
))
