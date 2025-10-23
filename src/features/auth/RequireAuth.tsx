import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

// Si tu veux typer les rôles de manière stricte, définis-les ici
type Role =  "Apprenant" | "Encadreur" | "Administrateur"

interface RequireAuthProps {
  allowedRoles: Role[] // tableau de rôles autorisés
}

const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  const location = useLocation()
  const { roles } = useAuth()

  const isAllowed = roles.some((role) => allowedRoles.includes(role as Role))

  return isAllowed ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}

export default RequireAuth
