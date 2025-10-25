import { Flex, IconButton } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FaUserFriends,
  FaBookOpen,
  FaUserPlus,
} from "react-icons/fa";
import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";
import type { MotionProps } from "framer-motion";
import { Tooltip } from "@/components/ui/tooltip"; // ✅ Chakra UI v3 Tooltip wrapper
import useAuth from "../hooks/useAuth"; // ✅ Adapt path as needed
import type { NavItem } from "@/types/nav";
import { FaFileCirclePlus } from "react-icons/fa6";


// ✅ Typage combiné Chakra + Motion avec motion.create
type MotionIconButtonProps = ComponentPropsWithoutRef<typeof IconButton> & MotionProps;
const MotionIconButton = motion.create<MotionIconButtonProps>(IconButton);

// ✅ Centralized role check for onboarding clarity
const useNavItems = (): NavItem[] => {
  const { isEncadreur, isAdministrateur } = useAuth();

  const canManageUsers = isEncadreur || isAdministrateur;

  return [
    canManageUsers && {
      to: "/dash/users",
      label: "Liste des utilisateurs",
      icon: <FaUserFriends />,
    },
    canManageUsers && {
      to: "/dash/users/new",
      label: "Ajouterer un utilisateur",
      icon: <FaUserPlus />,
    },
    {
      to: "/dash/courses",
      label: "Liste des cours",
      icon: <FaBookOpen />,
    },
    {
      to: "/dash/courses/new",
      label: "Ajouter un cours",
      icon: <FaFileCirclePlus />,
    },
  ].filter(Boolean) as NavItem[]; // ✅ Remove falsy entries and enforce type
};

const BandeauIcon = () => {
  const navItems = useNavItems();

  return (
    <Flex
      justify="center"
      gap={6}
      p={4}
      bg="transparent"
      backdropFilter="blur(6px)"
    >
      {navItems.map(({ to, label, icon }) => (
        <Tooltip
          key={to}
          content={label}
          showArrow
          contentProps={{
            bg: "gray.800",
            color: "white",
            px: 3,
            py: 2,
            borderRadius: "md",
            fontSize: "sm",
          }}
          positioning={{ placement: "top", offset: { mainAxis: 8 } }}
          openDelay={300}
          closeDelay={100}
        >
           <Link to={to}>
                     <MotionIconButton
                      whileHover={{ scale: 1.2, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                     {icon}
                      </MotionIconButton> 
                  </Link>
        </Tooltip>
      ))}
    </Flex>
  );
};

export default BandeauIcon;
