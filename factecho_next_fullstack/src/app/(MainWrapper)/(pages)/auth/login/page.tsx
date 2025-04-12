"use client";

import { useNotify } from "@/hooks";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { MoonLoader } from "react-spinners";

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
  const [loginLoad, setLoginLoad] = useState<boolean>(false); // Loading indicator state

  const notify = useNotify();
  const router = useRouter();

  /** Focus the email input on component mount */
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  /** Clear error message when email or password changes */
  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  /** Handles login form submission */
  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoginLoad(true);
    setErrMsg("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.ok) {
        notify("success", "تم تسجيل الدخول بنجاح");
        router.replace("/");
      } else {
        setErrMsg(res?.error as string);
      }
    } catch (error) {
      setErrMsg("فشل تسجيل الدخول, حاول مجددا");
    } finally {
      setLoginLoad(false);
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
