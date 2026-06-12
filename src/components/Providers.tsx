"use client";

import { AdminProvider } from "@/context/AdminContext";
import { StoreProvider } from "@/context/StoreContext";
import { LocaleProvider } from "@/context/LocaleContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <LocaleProvider>
        <StoreProvider>{children}</StoreProvider>
      </LocaleProvider>
    </AdminProvider>
  );
}
