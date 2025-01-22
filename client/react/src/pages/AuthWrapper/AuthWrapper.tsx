import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import AuthMessage from "./components/AuthMessage";
import AuthNotValidPage from "./components/AuthNotValidPage/AuthNotValidPage";
import ForgetPassword from "./components/ForgetPassword/ForgetPassword";
import Login from "./components/Login/Login";
import OAuth from "./components/OAuth/OAuth";
import OAuthSuccess from "./components/OAuthSuccess";
import Register from "./components/Register/Register";

const AuthWrapper: React.FC = () => {
  // Retrieve the accessToken from the Redux store to check if the user is authenticated
  const accessToken = useSelector((state: any) => state.accessToken);

  // Get the current route location
  const location = useLocation();

  // If the route is specifically for OAuth success, render the OAuthSuccess component directly
  if (location.pathname === "/auth/oauth-success") {
    return <OAuthSuccess />;
  }

  return (
    <>
      {/* Check if the user is not authenticated (no accessToken) */}
      {!accessToken ? (
        // If not authenticated, display the appropriate authentication page based on the route
        <section className="flex flex-col lg:flex-row gap-4">
          {/* Right section: Form content for Login, Register, or Forget Password */}
          <section className="flex-1">
            <div className="p-6 lg:p-12">
              {/* Heading for the authentication page */}
              <h2 className="text-2xl mb-6 font-bold">
                أثرِ تجربتك مع صدى الحقيقة بإنشاء حساب
              </h2>

              {/* OAuth Login Component */}
              <OAuth />

              {/* Divider with visual separation */}
              <div className="relative my-8">
                <hr className="text-[#e5e5e5] mx-auto max-w-80" />
                <span className="bg-white w-6 h-6 text-center z-1 absolute top-[-12px] left-[50%] translate-x-[-50%]">
                  أو
                </span>
              </div>

              {/* Render the appropriate component based on the current route */}
              {location.pathname === "/auth/login" ? (
                <Login />
              ) : location.pathname === "/auth/register" ? (
                <Register />
              ) : location.pathname === "/auth/forget-password" ? (
                <ForgetPassword />
              ) : (
                // Redirect to the login route if no valid path matches
                <Navigate to="/auth/login" state={{ from: location }} replace />
              )}
            </div>
          </section>

          {/* Left section: Additional authentication-related content */}
          <section className="flex-1">
            <AuthMessage />
          </section>
        </section>
      ) : (
        // If the user is authenticated, render the AuthNotValidPage component
        <AuthNotValidPage />
      )}
    </>
  );
};

export default AuthWrapper;
