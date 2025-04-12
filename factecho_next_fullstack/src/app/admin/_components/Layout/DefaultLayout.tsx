"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <section
      className="dark:bg-boxdark-2 dark:text-bodydark font-normal text-base text-body bg-whiten relative z-1 overflow-x-hidden"
      style={{ direction: "ltr", textAlign: "left" }}
    >
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div
          ref={contentRef}
          className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden"
        >
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <main>
            <div className="mx-auto p-4 md:p-6 2xl:p-10">{children}</div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default DefaultLayout;
