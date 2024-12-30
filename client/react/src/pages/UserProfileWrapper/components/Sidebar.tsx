import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";

import { useLogout } from "../../../hooks";
import { UserRouteType } from "../UserProfileWrapper";

/**
 * Sidebar component for rendering user-specific navigation routes and a logout button.
 * @param {Object} props - Component props.
 * @param {UserRouteType[]} props.userRoutes - List of user routes to display in the sidebar.
 */
const Sidebar = ({ userRoutes }: { userRoutes: UserRouteType[] }) => {
  const logout = useLogout(); // Custom hook for handling user logout
  const location = useLocation(); // Access current location to highlight active route

  return (
    <ul className="w-full flex flex-wrap flex-row items-center gap-4 md:flex-col md:items-stretch">
      {/* Map through userRoutes to generate navigation links */}
      {userRoutes.map((route) => (
        <li key={route.path} title={route.label}>
          <Link
            to={route.path}
            className={`flex items-center gap-3 p-3 rounded-md w-full ${
              location.pathname === route.path
                ? "bg-veryLightGreyColor font-bold" // Highlight active route
                : "hover:bg-veryLightGreyColor text-mainGreyColor" // Style inactive routes
            }`}
          >
            <FontAwesomeIcon icon={route.icon} className="w-5 h-5" />
            <span className="hidden md:inline">{route.label}</span>
          </Link>
        </li>
      ))}

      {/* Logout button */}
      <li title={"تسجيل خروج"}>
        <button
          className="flex items-center gap-3 p-3 rounded-md w-full hover:bg-veryLightGreyColor text-red-500"
          onClick={logout} // Trigger logout functionality
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
          <span className="hidden md:inline">تسجيل الخروج</span>
        </button>
      </li>
    </ul>
  );
};

export default Sidebar;
