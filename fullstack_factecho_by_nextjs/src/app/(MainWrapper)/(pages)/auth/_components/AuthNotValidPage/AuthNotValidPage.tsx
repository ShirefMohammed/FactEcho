"use client";

import { useRouter } from "next/navigation";

import { useLogout } from "../../../../../../hooks";
import style from "./AuthNotValidPage.module.css";

const AuthNotValidPage = () => {
  const router = useRouter();

  const logout = useLogout();
  const goBack = () => router.back();
  const goHome = () => router.push("/");

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
