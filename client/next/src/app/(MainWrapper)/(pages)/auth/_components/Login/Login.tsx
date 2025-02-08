"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { MoonLoader } from "react-spinners";

import { ApiBodyResponse, LoginRequest, LoginResponse } from "@shared/types/apiTypes";

import { useAuthAPIs } from "../../../../../../api/client/useAuthAPIs";
import { useNotify } from "../../../../../../hooks";
import { setAccessToken } from "../../../../../../store/slices/accessTokenSlice";
import { setUserAvatar } from "../../../../../../store/slices/userAvatarSlice";
import { setUser } from "../../../../../../store/slices/userSlice";
import style from "./Login.module.css";

const Login = () => {
  // Refs for email input and error focus
  const emailRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLInputElement | null>(null);

  // States for form inputs, errors, and loading
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>(""); // Error message state

  // State to persist login session
  const [persist, setPersist] = useState<boolean>(localStorage.getItem("persist") === "true");
  const [loginLoad, setLoginLoad] = useState<boolean>(false); // Loading indicator state

  const dispatch = useDispatch();
  const notify = useNotify();
  const router = useRouter();

  const authAPIs = useAuthAPIs();

  /** Focus the email input on component mount */
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  /** Clear error message when email or password changes */
  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  /** Save 'persist' state to localStorage whenever it changes */
  useEffect(() => {
    localStorage.setItem("persist", String(persist));
  }, [persist]);

  /** Handles login form submission */
  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoginLoad(true); // Set loading state

      const reqBody: LoginRequest = { email, password };

      // Call login API
      const resBody: ApiBodyResponse<LoginResponse> = await authAPIs.login(reqBody);
      const resData: LoginResponse = resBody.data!;

      // Dispatch user and access token to store
      dispatch(setUser(resData.user));
      dispatch(setUserAvatar(resData.user?.avatar || ""));
      dispatch(setAccessToken(resData.accessToken));

      notify("success", "تم تسجيل الدخول بنجاح");
      router.replace("/");
    } catch (error) {
      if (!axios.isAxiosError(error) || !error.response) {
        setErrMsg("لا يوجد استجابة من الخادم");
      } else {
        const { status, data } = error.response;
        const message = data?.message;

        switch (status) {
          case 400:
            setErrMsg("البيانات المدخلة غير صحيحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور.");
            break;
          case 401:
            setErrMsg("كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.");
            break;
          case 403:
            setErrMsg("الحساب غير مُفعل. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.");
            break;
          case 404:
            setErrMsg("المستخدم غير موجود. يرجى إنشاء حساب جديد.");
            break;
          case 500:
            setErrMsg("حدث خطأ ما في الخادم.");
            break;
          default:
            setErrMsg(message || "حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.");
        }
      }
      errRef.current?.focus();
    } finally {
      setLoginLoad(false); // Reset loading state
    }
  };

  return (
    <section className={style.login}>
      <form onSubmit={login}>
        {/* Display error message */}
        <div ref={errRef} aria-live="assertive">
          {errMsg && <p className={style.error_message}>{errMsg}</p>}
        </div>

        {/* Email Input */}
        <input
          type="email"
          ref={emailRef}
          autoComplete="off"
          placeholder="البريد الإلكتروني"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="كلمة المرور"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />

        {/* Persist Login Checkbox */}
        <div className={style.persistCheck}>
          <input
            type="checkbox"
            id="persist"
            onChange={() => setPersist((prev) => !prev)}
            checked={persist}
          />
          <label htmlFor="persist">تذكرني</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loginLoad}
          style={loginLoad ? { opacity: 0.5, cursor: "revert" } : {}}
        >
          <span>تسجيل الدخول</span>
          {loginLoad && <MoonLoader color="#fff" size={15} />}
        </button>

        {/* Navigation Links */}
        <nav className={style.controllers}>
          <Link href="/auth/register">إنشاء حساب جديد</Link>
          <Link href="/auth/forget-password">هل نسيت كلمة المرور؟</Link>
        </nav>
      </form>
    </section>
  );
};

export default Login;
