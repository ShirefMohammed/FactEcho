"use client";

import DefaultLayout from "./Layout/DefaultLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
