"use client";

import React from "react";
import { ThemeProvider } from "@vibewell/ui";
import { Toaster } from "sonner";
import { NotificationProvider } from "@/components/notifications";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vibewell-theme">
      {children}
      <Toaster position="bottom-right" />
      <NotificationProvider />
    </ThemeProvider>
  );
} 