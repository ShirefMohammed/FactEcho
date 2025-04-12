import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/config/nextAuthOptions";
import { getServerSession } from "next-auth";

import AuthMessage from "./_components/AuthMessage";
import AuthNotValidPage from "./_components/AuthNotValidPage/AuthNotValidPage";
import OAuth from "./_components/OAuth/OAuth";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(nextAuthOptions);

  if (session) {
    return <AuthNotValidPage />;
  }

  return (
    <section className="flex flex-col lg:flex-row gap-4">
      {/* Right Section: Authentication Forms */}
      <section className="flex-1">
        <div className="p-6 lg:p-12">
          {/* Heading */}
          <h2 className="text-2xl mb-6 font-bold">أثرِ تجربتك مع صدى الحقيقة بإنشاء حساب</h2>

          {/* OAuth Login */}
          <OAuth />

          {/* Divider */}
          <div className="relative my-8">
            <hr className="text-[#e5e5e5] mx-auto max-w-80" />
            <span className="bg-white w-6 h-6 text-center z-1 absolute top-[-12px] left-[50%] translate-x-[-50%]">
              أو
            </span>
          </div>

          {/* Render login, register or forget-password pages */}
          {children}
        </div>
      </section>

      {/* Left Section: Additional Authentication Content */}
      <section className="flex-1">
        <AuthMessage />
      </section>
    </section>
  );
}
