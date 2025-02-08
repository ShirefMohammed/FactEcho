"use client";

import DefaultLayout from "./_components/Layout/DefaultLayout";

export default function MainWrapperLayout({ children }: { children: React.ReactNode }) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
