import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";

import Logo from "../../assets/Logo.svg";
import { useRefreshToken } from "../../hooks";
import { StoreState } from "../../store/store";
import style from "./PersistLogin.module.css";

/**
 * The `PersistLogin` component is responsible for managing the user's session persistence.
 * It checks if the user has a valid session and ensures their access token is refreshed if needed.
 * The component renders either the main content or a loading state based on the user's authentication status.
 *
 * @returns {JSX.Element} - The rendered component, either a loading screen or the main content (`<Outlet />`).
 */
const PersistLogin = (): JSX.Element => {
  // State for checking if persistence is enabled (stored in localStorage)
  const persist = useState<boolean>(localStorage.getItem("persist") === "true" ? true : false);

  // Access token from Redux state to verify user authentication
  const accessToken = useSelector((state: StoreState) => state.accessToken);

  // State to track if the refresh token request is still loading
  const [refreshLoad, setRefreshLoad] = useState<boolean>(true);

  // Custom hook to refresh the access token using the refresh token API
  const refresh = useRefreshToken();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        // If persistence is enabled and there is no access token, refresh the token
        if (persist && !accessToken) await refresh();
      } catch (err) {
        console.error("Error refreshing token: ", err);
      } finally {
        setRefreshLoad(false);
      }
    };

    verifyRefreshToken();
  }, []);

  return (
    <>
      {
        // If persistence is not enabled, render the main content (`<Outlet />`)
        !persist ? (
          <Outlet />
        ) : // If refresh is still loading (fetching user data and access token)
        refreshLoad ? (
          <div className={style.loading_container}>
            <img src={Logo} alt="FactEcho Logo" />
            <div className={style.creator}>
              <span>Created by</span>
              <Link to="https://shiref-mohammed.onrender.com/">Shiref Mohammed</Link>
            </div>
          </div>
        ) : (
          // If the refresh process is complete, render the main content (`<Outlet />`)
          <Outlet />
        )
      }
    </>
  );
};

export default PersistLogin;
