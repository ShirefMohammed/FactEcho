"use client";

import { ToastContainerWithProps } from "@/components";

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastContainerWithProps />
      {children}
    </>
  );
}
