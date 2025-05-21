"use client";

import React from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";
import { NotificationProvider } from "@/components/notifications";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  // Cast children to avoid Next.js 15 ReactNode compatibility issues
  const safeChildren = children as React.ReactElement;

  return (
    <ThemeProvider defaultTheme="system" storageKey="vibewell-theme">
      {safeChildren}
      <Toaster position="bottom-right" />
      <NotificationProvider />
    </ThemeProvider>
  );
} 