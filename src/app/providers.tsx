"use client";

import { ThemeProvider } from "next-themes";
import AuthProvider from "@/components/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
