import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const normalizeRole = (role) => {
  return String(role || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
};

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}) => {
  const { isAuthenticated, role, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  const currentRole = normalizeRole(
    user?.role || role
  );

  const normalizedAllowedRoles = allowedRoles.map(
    (allowedRole) => normalizeRole(allowedRole)
  );

  if (!normalizedAllowedRoles.includes(currentRole)) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
