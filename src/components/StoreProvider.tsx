"use client";

import { Provider } from "react-redux";
import store from "@/redux/store";
import { CookiesProvider } from "react-cookie";
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CookiesProvider>
      <Provider store={store}>{children}</Provider>
    </CookiesProvider>
  );
}
