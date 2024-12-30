import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import Header from "../Header/index";
import Sidebar from "../Sidebar/index";

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const { pathname } = useLocation();

  // Scroll to the top of the content area when the route changes
  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <section
      className="dark:bg-boxdark-2 dark:text-bodydark font-normal text-base text-body bg-whiten relative z-1 overflow-x-hidden"
      style={{ direction: "ltr", textAlign: "left" }}
    >
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Component */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <div
          ref={contentRef}
          className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden"
        >
          {/* Header Component */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Main Content */}
          <main>
            <div className="mx-auto p-4 md:p-6 2xl:p-10">{children}</div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default DefaultLayout;
