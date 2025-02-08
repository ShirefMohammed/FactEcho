"use client";

import axios from "axios";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { MoonLoader } from "react-spinners";

import { ForgetPasswordRequest } from "@shared/types/apiTypes";

import { useAuthAPIs } from "../../../../../../api/client/useAuthAPIs";
import style from "./ForgetPassword.module.css";

const ForgetPassword = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLInputElement | null>(null);
  const successRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [forgetPasswordLoad, setForgetPasswordLoad] = useState(false);

  const authAPIs = useAuthAPIs();

  // Focus on email input field when component mounts
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // Reset error and success messages when email changes
  useEffect(() => {
    setErrMsg("");
    setSuccessMsg("");
  }, [email]);

  // Handle forget password request
  const forgetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setForgetPasswordLoad(true);

      // Prepare the request body for the API call
      const reqBody: ForgetPasswordRequest = { email };

      // Call the API to handle forget password process
      await authAPIs.forgetPassword(reqBody);

      setSuccessMsg("تحقق من بريدك الإلكتروني للحصول على رابط إعادة تعيين كلمة المرور.");
      successRef.current?.focus();
    } catch (error) {
      if (!axios.isAxiosError(error) || !error.response) {
        setErrMsg("لا يوجد استجابة من الخادم");
      } else {
        const statusCode = error.response.status;
        const message = error.response.data?.message;

        switch (statusCode) {
          case 400:
            setErrMsg("البيانات المدخلة غير صحيحة. يرجى التحقق من البريد الإلكتروني.");
            break;
          case 403:
            setErrMsg("غير مسموح لذلك الحساب إضافة كلمة مرور.");
            break;
          case 404:
            setErrMsg("المستخدم غير موجود. يرجى إنشاء حساب جديد.");
            break;
          case 500:
            setErrMsg("حدث خطأ ما فى الخادم.");
            break;
          default:
            setErrMsg(message || "حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.");
        }
      }

      errRef.current?.focus();
    } finally {
      setForgetPasswordLoad(false);
    }
  };

  return (
    <section className={style.forget_password}>
      <form onSubmit={forgetPassword}>
        {/* Error Message */}
        <div ref={errRef} aria-live="assertive">
          {errMsg && <p className={style.error_message}>{errMsg}</p>}
        </div>

        {/* Success Message */}
        <div ref={successRef} aria-live="assertive">
          {successMsg && <p className={style.success_message}>{successMsg}</p>}
        </div>

        {/* Email */}
        <input
          type="email"
          ref={emailRef}
          autoComplete="off"
          placeholder="البريد الإلكتروني"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        {/* Submit Btn */}
        <button
          type="submit"
          disabled={forgetPasswordLoad ? true : false}
          style={forgetPasswordLoad ? { opacity: 0.5, cursor: "revert" } : {}}
        >
          <span>إرسال</span>
          {forgetPasswordLoad && <MoonLoader color="#fff" size={15} />}
        </button>

        {/* Controllers */}
        <nav className={style.controllers}>
          <Link href="/auth/login">تسجيل الدخول</Link>
          <Link href="/auth/register">إنشاء حساب جديد</Link>
        </nav>
      </form>
    </section>
  );
};

export default ForgetPassword;
