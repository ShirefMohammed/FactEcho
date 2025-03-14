"use client";

import { faCheck, faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { MoonLoader } from "react-spinners";

import { RegisterRequest } from "@shared/types/apiTypes";

import { useAuthAPIs } from "../../../../../../api/client/useAuthAPIs";
import { RgxList } from "../../../../../../utils/constants";
import style from "./Register.module.css";

const Register = () => {
  // Refs for focus management
  const nameRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLInputElement | null>(null);
  const successRef = useRef<HTMLInputElement | null>(null);

  // State variables for form fields
  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [registerLoad, setRegisterLoad] = useState(false);

  const authAPIs = useAuthAPIs();

  // Focus on the name input field on component mount
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // Clear error messages when input fields change
  useEffect(() => {
    setErrMsg("");
  }, [name, email, password, confirmPassword]);

  // Validate input fields
  useEffect(() => {
    setValidName(RgxList.NAME_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    setValidEmail(RgxList.EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(RgxList.PASS_REGEX.test(password));
    setValidConfirmPassword(confirmPassword === password);
  }, [password, confirmPassword]);

  // Register
  const register = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // If buttons enabled with JS hack
      if (
        !RgxList.NAME_REGEX.test(name) ||
        !RgxList.EMAIL_REGEX.test(email) ||
        !RgxList.PASS_REGEX.test(password)
      ) {
        setErrMsg("البيانات المدخلة غير صالحة");
        errRef.current?.focus();
        return;
      }

      if (password !== confirmPassword) {
        setErrMsg("يجب أن تتطابق كلمة المرور مع تأكيد كلمة المرور");
        errRef.current?.focus();
        return;
      }

      setRegisterLoad(true);

      // Prepare request body
      const reqBody: RegisterRequest = { name, email, password };

      // Send API request
      await authAPIs.register(reqBody);

      // Reset form fields
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Show success message
      setSuccessMsg("تم إنشاء الحساب بنجاح يمكنك الآن مراجعة بريدك الإلكترونى لتوثيق حسابك");
      successRef.current?.focus();
    } catch (error) {
      // Handle error response from server
      if (!axios.isAxiosError(error) || !error?.response) {
        // No response from the server
        setErrMsg("لا يوجد استجابة من الخادم");
      } else {
        // Extract status code and error message
        const statusCode = error.response.status;
        const message = error.response.data?.message;

        // Set error messages based on status code
        switch (statusCode) {
          case 400:
            setErrMsg("البيانات المدخلة غير صحيحة.");
            break;
          case 409:
            setErrMsg("يوجد مستخدم له نفس البريد الإلكترونى.");
            break;
          case 500:
            setErrMsg("حدث خطأ ما فى الخادم.");
            break;
          default:
            setErrMsg(message || "حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.");
        }
      }

      // Focus on the error message container
      errRef.current?.focus();
    } finally {
      setRegisterLoad(false);
    }
  };

  return (
    <section className={style.register}>
      <form onSubmit={register}>
        {/* Error Message */}
        <div ref={errRef} aria-live="assertive">
          {errMsg && <p className={style.error_message}>{errMsg}</p>}
        </div>

        {/* Success Message */}
        <div ref={successRef} aria-live="assertive">
          {successMsg && <p className={style.success_message}>{successMsg}</p>}
        </div>

        {/* Name */}
        <div>
          <span className={style.check_mark}>
            {name === "" ? (
              ""
            ) : validName ? (
              <FontAwesomeIcon icon={faCheck} className={style.valid} />
            ) : (
              <FontAwesomeIcon icon={faTimes} className={style.invalid} />
            )}
          </span>
          <input
            type="text"
            autoComplete="off"
            placeholder="اسم المستخدم"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
            aria-invalid={!validName ? "true" : "false"}
            aria-describedby="nameNote"
            onFocus={() => setNameFocus(true)}
            onBlur={() => setNameFocus(false)}
            ref={nameRef}
          />
          {nameFocus && name && !validName ? (
            <p id="nameNote" className={style.instructions}>
              <FontAwesomeIcon icon={faInfoCircle} />
              Must be in english.
              <br />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
              <br />
              No spaces.
            </p>
          ) : (
            ""
          )}
        </div>

        {/* Email */}
        <div>
          <span className={style.check_mark}>
            {email === "" ? (
              ""
            ) : validEmail ? (
              <FontAwesomeIcon icon={faCheck} className={style.valid} />
            ) : (
              <FontAwesomeIcon icon={faTimes} className={style.invalid} />
            )}
          </span>
          <input
            type="email"
            autoComplete="off"
            placeholder="البريد الإلكتروني"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            aria-invalid={!validEmail ? "true" : "false"}
            aria-describedby="emailNote"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
          />
          {emailFocus && email && !validEmail ? (
            <p id="emailNote" className={style.instructions}>
              <FontAwesomeIcon icon={faInfoCircle} />
              Enter valid email, we will send verification token to your email.
            </p>
          ) : (
            ""
          )}
        </div>

        {/* Password */}
        <div>
          <span className={style.check_mark}>
            {password === "" ? (
              ""
            ) : validPassword ? (
              <FontAwesomeIcon icon={faCheck} className={style.valid} />
            ) : (
              <FontAwesomeIcon icon={faTimes} className={style.invalid} />
            )}
          </span>
          <input
            type="password"
            placeholder="كلمة المرور"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            aria-invalid={validPassword ? "false" : "true"}
            aria-describedby="passwordNote"
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
          />
          {passwordFocus && !validPassword ? (
            <p id="passwordNote" className={style.instructions}>
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters , a number and a special character.
              <br />
              Allowed special characters:
              <span aria-label="exclamation mark"> ! </span>
              <span aria-label="at symbol">@ </span>
              <span aria-label="hashtag"># </span>
              <span aria-label="dollar sign">$ </span>
              <span aria-label="percent">% </span>
            </p>
          ) : (
            ""
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <span className={style.check_mark}>
            {confirmPassword === "" ? (
              ""
            ) : validConfirmPassword ? (
              <FontAwesomeIcon icon={faCheck} className={style.valid} />
            ) : (
              <FontAwesomeIcon icon={faTimes} className={style.invalid} />
            )}
          </span>
          <input
            type="password"
            placeholder="تأكيد كلمة المرور"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
            aria-invalid={validConfirmPassword ? "false" : "true"}
            aria-describedby="confirmPasswordNote"
            onFocus={() => setConfirmPasswordFocus(true)}
            onBlur={() => setConfirmPasswordFocus(false)}
          />
          {confirmPasswordFocus && !validConfirmPassword ? (
            <p id="confirmPasswordNote" className={style.instructions}>
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match password field.
            </p>
          ) : (
            ""
          )}
        </div>

        {/* Submit Btn */}
        <button
          type="submit"
          disabled={registerLoad ? true : false}
          style={registerLoad ? { opacity: 0.5, cursor: "revert" } : {}}
        >
          <span>تسجيل</span>
          {registerLoad && <MoonLoader color="#fff" size={15} />}
        </button>

        {/* Controllers */}
        <nav className={style.controllers}>
          <Link href="/auth/login">تسجيل الدخول</Link>
          <Link href="/auth/forget-password">هل نسيت كلمة المرور؟</Link>
        </nav>
      </form>
    </section>
  );
};

export default Register;
