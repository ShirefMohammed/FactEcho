import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useNotify, useRefreshToken } from "../../../hooks";

const OAuthSuccess = () => {
  const refresh = useRefreshToken();
  const navigate = useNavigate();
  const notify = useNotify();

  useEffect(() => {
    // Function to verify the refresh token and handle navigation based on success or failure
    const verifyRefreshToken = async () => {
      try {
        await refresh();
        notify("success", "تم تسجيل الدخول بنجاح");
        navigate("/");
      } catch (err) {
        notify("error", "فشل تسجيل الدخول. يرجى المحاولة لاحقًا.");
        navigate("/auth");
      }
    };

    verifyRefreshToken();
  }, [refresh]);

  return <section>جاري معالجة تسجيل الدخول...</section>;
};

export default OAuthSuccess;
