import { motion } from "framer-motion";
import {
  Box,
  Flex,
  IconButton,
  Button,
  Stack,
  Text,
  Heading,
  Image,
} from "@chakra-ui/react";
import type { ComponentPropsWithoutRef, FC } from "react";

// ✅ Typage utilitaire pour motion(ChakraComponent)
function withMotion<T extends React.ComponentType<any>>(
  component: T
): FC<ComponentPropsWithoutRef<T>> {
  return motion(component) as FC<ComponentPropsWithoutRef<T>>;
}

// ✅ Composants animés Chakra UI v3
export const MotionBox = withMotion(Box);
export const MotionFlex = withMotion(Flex);
export const MotionIconButton = withMotion(IconButton);
export const MotionButton = withMotion(Button);
export const MotionStack = withMotion(Stack);
export const MotionText = withMotion(Text);
export const MotionHeading = withMotion(Heading);
export const MotionImage = withMotion(Image);
