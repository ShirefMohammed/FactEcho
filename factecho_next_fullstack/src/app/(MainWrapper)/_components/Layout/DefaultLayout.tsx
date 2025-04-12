"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <section className="font-normal text-base text-text relative z-1">
      <div className="flex h-screen overflow-hidden">
        <div
          ref={contentRef}
          className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden"
        >
          <Header />

          <main>
            <div className="mx-auto max-w-screen-xl p-4 md:p-6 2xl:p-10">{children}</div>
          </main>

          <Footer />
        </div>
      </div>
    </section>
  );
};

export default DefaultLayout;
