import {
  IconDefinition,
  faBookmark,
  faEnvelope,
  faGear,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useParams } from "react-router-dom";

import { StoreState } from "../../store/store";
import Newsletters from "./components/Newsletters";
import PersonalInfo from "./components/PersonalInfo";
import ReadingList from "./components/ReadingList";
import Sidebar from "./components/Sidebar";
import Settings from "./components/UserSettings/Settings";

export interface UserRouteType {
  label: string;
  path: string;
  icon: IconDefinition;
}

const UserProfileWrapper = () => {
  // Extract the `userId` from URL parameters
  const { userId } = useParams();

  // Access Redux state for authentication and user data
  const accessToken = useSelector((state: StoreState) => state.accessToken);
  const currentUser = useSelector((state: StoreState) => state.currentUser);

  // Get the current route location
  const location = useLocation();

  // Define user-specific routes for navigation
  const userRoutes: UserRouteType[] = [
    { label: "حسابي", path: `/users/${userId}`, icon: faUser },
    { label: "قائمة القراءة", path: `/users/${userId}/reading-list`, icon: faBookmark },
    { label: "النشرات البريدية", path: `/users/${userId}/news-letters`, icon: faEnvelope },
    { label: "إعدادات الحساب", path: `/users/${userId}/settings`, icon: faGear },
  ];

  // Identify the current active route based on the URL pathname
  const currentRoute = userRoutes.find((route) => route.path === location.pathname);

  // Redirect to the unauthorized page if the user is not authenticated or doesn't match the current user
  if (!accessToken || currentUser.user_id !== userId) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return (
    <section>
      {/* Display the header with the current route's label */}
      <h1 className="text-3xl font-bold mb-8 text-right">
        {currentRoute ? (
          currentRoute.label
        ) : (
          <Navigate to={`/users/${userId}`} state={{ from: location }} replace />
        )}
      </h1>

      {/* Layout for the sidebar and main content */}
      <section className="flex flex-col md:flex-row gap-4">
        {/* Sidebar navigation */}
        <section className="w-full md:w-55">
          <Sidebar userRoutes={userRoutes} />
        </section>

        {/* Main content based on the current route */}
        <section className="flex-1">
          {currentRoute?.path === `/users/${userId}` && <PersonalInfo />}
          {currentRoute?.path === `/users/${userId}/reading-list` && <ReadingList />}
          {currentRoute?.path === `/users/${userId}/news-letters` && <Newsletters />}
          {currentRoute?.path === `/users/${userId}/settings` && <Settings />}
        </section>
      </section>
    </section>
  );
};

export default UserProfileWrapper;
