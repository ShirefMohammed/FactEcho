"use client";

import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { Provider } from "react-redux";

import { PersistLogin, ToastContainerWithProps } from "../components";
import { store } from "../store/store";
import "../styles/adminDashboard.css";
import "../styles/globals.css";

// Disable React Dev Tools in Production
if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
  disableReactDevTools();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistLogin>{children}</PersistLogin>
          <ToastContainerWithProps />
        </Provider>
      </body>
    </html>
  );
}
