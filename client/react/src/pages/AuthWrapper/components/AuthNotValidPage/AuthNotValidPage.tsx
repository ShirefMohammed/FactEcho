import { useNavigate } from "react-router-dom";

import { useLogout } from "../../../../../src/hooks";
import style from "./AuthNotValidPage.module.css";

const AuthNotValidPage = () => {
  // useNavigate hook from React Router for navigating to different routes
  const navigate = useNavigate();

  // Custom logout function from the useLogout hook
  const logout = useLogout();

  // Function to navigate back to the previous page
  const goBack = () => navigate(-1);

  // Function to navigate to the home page
  const goHome = () => navigate("/");

  return (
    <section className={style.not_available_page}>
      <div>
        <h2>الصفحة غير متوفرة</h2>

        <p>لقد قمت بالفعل بتسجيل الدخول, يمكنك تسجيل الخروج لإعادة التسجيل.</p>

        <div className={style.buttons}>
          <button onClick={goBack}>رجوع</button>
          <button onClick={goHome}>الرئيسية</button>
          <button onClick={logout}>تسجيل خروج</button>
        </div>
      </div>
    </section>
  );
};

export default AuthNotValidPage;
