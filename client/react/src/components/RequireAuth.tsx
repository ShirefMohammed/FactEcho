import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { StoreState } from "../store/store";

/**
 * A component that protects routes by checking if the user has a valid access token and the required role.
 * It redirects unauthorized users to either the login page or an unauthorized page based on the scenario.
 * @param {Object} props - The props object for the component.
 * @returns {JSX.Element} - The rendered component, either the protected content (`<Outlet />`), or a redirect (`<Navigate />`).
 */
const RequireAuth = ({ allowedRoles }: { allowedRoles: number[] }): JSX.Element => {
  const currentUser = useSelector((state: StoreState) => state.currentUser);
  const accessToken = useSelector((state: StoreState) => state.accessToken);

  const location = useLocation();

  return currentUser?.role && allowedRoles.indexOf(currentUser.role) !== -1 ? (
    <Outlet />
  ) : accessToken ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/auth" state={{ from: location }} replace />
  );
};

export default RequireAuth;
