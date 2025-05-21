"use client";

import { type ReactNode } from "react";
import { SupabaseProvider as BaseSupabaseProvider } from "./supabase-provider";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <BaseSupabaseProvider>
      {children}
    </BaseSupabaseProvider>
  );
} 