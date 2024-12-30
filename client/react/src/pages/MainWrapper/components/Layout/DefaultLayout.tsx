import React, { ReactNode, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import Footer from "../Footer/Footer";
import Header from "../Header/index";

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

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
