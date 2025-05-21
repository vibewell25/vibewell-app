"use client";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";
import { NotificationProvider } from "@/components/notifications";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster position="bottom-right" />
      <NotificationProvider />
    </ThemeProvider>
  );
} 