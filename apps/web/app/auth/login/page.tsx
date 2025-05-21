import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | VibeWell",
  description: "Login to your VibeWell account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md space-y-6 px-4 py-12">
        <LoginForm />
      </div>
    </div>
  );
} 