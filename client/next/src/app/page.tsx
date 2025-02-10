"use client";

import dynamic from "next/dynamic";

const MainWrapper = dynamic(() => import("./(MainWrapper)/layout"), { ssr: false });
const Home = dynamic(() => import("./(MainWrapper)/(pages)/home/page"), { ssr: false });

export default function Root() {
  return (
    <MainWrapper>
      <Home />
    </MainWrapper>
  );
}
