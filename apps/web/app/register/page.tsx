import { redirect } from "next/navigation";

export default function RegisterPage() {
  // Redirect to the signup page
  redirect("/auth/signup");
} 