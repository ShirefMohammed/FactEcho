import { authAPIs } from "@/axios/apis/authAPIs";
import { VerifyAccountRequest } from "@/types/apiTypes";
import Link from "next/link";

// Constants for messages
const MESSAGES = {
  MISSING_TOKEN: "رمز التحقق غير موجود. يرجى التحقق من الرابط المرسل إليك.",
  SUCCESS: "تم التحقق من الحساب بنجاح! يمكنك الآن استخدام كافة خدماتنا.",
  NO_RESPONSE: "لا يوجد استجابة من الخادم",
};

type VerifyAccountProps = {
  searchParams: Promise<{ verificationToken: string }>;
};

export default async function VerifyAccount({ searchParams }: VerifyAccountProps) {
  const { verificationToken } = await searchParams;

  let message = "";
  let isError = false;

  if (!verificationToken) {
    message = MESSAGES.MISSING_TOKEN;
    isError = true;
  } else {
    try {
      const reqBody: VerifyAccountRequest = { verificationToken };
      await authAPIs.verifyAccount(reqBody);
      message = MESSAGES.SUCCESS;
    } catch (error: any) {
      if (!error.response) {
        message = MESSAGES.NO_RESPONSE;
      } else {
        const { data } = error.response;
        message = data?.message || "حدث خطأ أثناء التحقق من الحساب. يرجى المحاولة مرة أخرى.";
      }
      isError = true;
    }
  }

  return (
    <section className="flex flex-col p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-1">تحقق من الحساب</h3>
      <p className={`${isError ? "text-red-600" : "text-green-600"} mb-1`}>{message}</p>
      <Link href="/auth/login" className="text-sm underline">
        تسجيل الدخول
      </Link>
    </section>
  );
}
