import NextAuthSessionProvider from "@/context/NextAuthSessionProvider";
import ToastProvider from "@/context/ToastProvider";
import "@/styles/adminDashboard.css";
import "@/styles/globals.css";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { Metadata } from "next";

import rootMetadata from "./metadata";

export const metadata: Metadata = rootMetadata;

if (process.env.NEXT_PUBLIC_NODE_ENV === "production") disableReactDevTools();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <NextAuthSessionProvider>
          <ToastProvider>{children}</ToastProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
