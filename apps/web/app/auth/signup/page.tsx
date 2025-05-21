import { Metadata } from "next";
import { SignUpForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up | VibeWell",
  description: "Create a new VibeWell account",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md space-y-6 px-4 py-12">
        <SignUpForm />
      </div>
    </div>
  );
} 