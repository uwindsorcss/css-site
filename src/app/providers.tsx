"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { useToastFeedback } from "@/hooks/useFeedbackToast";

export function Providers({ children }: { children: React.ReactNode }) {
  useToastFeedback();
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
