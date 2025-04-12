"use client";

import { authAPIs } from "@/axios/apis/authAPIs";
import { useNotify } from "@/hooks";
import { ResetPasswordRequest } from "@/types/apiTypes";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { MoonLoader } from "react-spinners";

const ResetPassword = () => {
  // Refs for input focus
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLDivElement | null>(null);

  // States for form inputs and loading
  const [newPassword, setNewPassword] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const notify = useNotify();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPasswordToken = searchParams.get("resetPasswordToken");

  // Focus password input on mount
  useEffect(() => {
    passwordRef.current?.focus();
  }, []);

  // Clear error when password changes
  useEffect(() => {
    setErrMsg("");
  }, [newPassword]);

  // Check for reset token on mount
  useEffect(() => {
    if (!resetPasswordToken) {
      setErrMsg("رمز إعادة التعيين غير موجود. يرجى التحقق من الرابط المرسل إليك.");
    }
  }, [resetPasswordToken]);

  /** Handles password reset submission */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!resetPasswordToken) return;

      // Validate password format
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
      if (!passwordRegex.test(newPassword)) {
        setErrMsg(
          "Password must be in english, 8 to 24 characters, Must include uppercase and lowercase letters, a number and a special character, Allowed special characters: !, @, #, $, %",
        );
        return;
      }

      setIsLoading(true);
      setErrMsg("");

      // Prepare request body
      const reqBody: ResetPasswordRequest = { resetPasswordToken, newPassword };

      // Send API request
      await authAPIs.resetPassword(reqBody);

      notify("success", "تم إعادة تعيين كلمة المرور بنجاح!");
      setIsSuccess(true);
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (error: any) {
      setErrMsg(error.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور");
      errRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  if (!resetPasswordToken) {
    return (
      <section className="flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-1">إعادة تعيين كلمة المرور</h3>
        <p className="text-red-600">{errMsg}</p>
        <Link href="/auth/forget-password" className="text-sm underline">
          طلب رابط جديد
        </Link>
      </section>
    );
  }

  return (
    <section className="flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-2">إعادة تعيين كلمة المرور</h3>

      {/* Error message display */}
      <div ref={errRef} aria-live="assertive" className="mb-1">
        {errMsg && (
          <p className="w-full py-2.5 px-3.5 mb-2.5 text-sm text-center text-[#b22222] bg-[#ffb6c1] rounded-lg">
            {errMsg}
          </p>
        )}
      </div>

      {isSuccess ? (
        <div>
          <p className="text-green-600">
            تم إعادة تعيين كلمة المرور بنجاح! يتم تحويلك إلى صفحة تسجيل الدخول...
          </p>
          <Link href="/auth/login" className="text-sm underline">
            تسجيل الدخول
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-right text-gray-700 mb-2">
              أدخل كلمة المرور الجديدة:
            </label>
            <input
              type="password"
              id="newPassword"
              ref={passwordRef}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="outline-none w-full px-4 py-2 border border-[#bebebe] rounded-md focus:border-[gray]"
              aria-describedby="password-requirements"
            />
            <p id="password-requirements" className="text-xs text-gray-500 mt-2 text-right">
              يجب أن تحتوي كلمة المرور على 8-24 حرفًا، وتشمل أحرفًا كبيرة وصغيرة، ورقمًا، ورمزًا
              خاصًا (!@#$%)
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-[45px] mx-auto mb-2.5 text-white bg-[#595959] rounded-lg tracking-widest uppercase flex items-center justify-center gap-2.5 border-none outline-none"
            style={isLoading ? { cursor: "not-allowed" } : { cursor: "pointer" }}
          >
            {isLoading ? (
              <>
                <MoonLoader color="#fff" size={20} />
                <span className="text-sm font-bold">جاري المعالجة...</span>
              </>
            ) : (
              "إعادة تعيين كلمة المرور"
            )}
          </button>
        </form>
      )}
    </section>
  );
};

export default ResetPassword;
