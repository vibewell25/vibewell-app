import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Feed | VibeWell",
  description: "Connect with beauty and wellness providers and enthusiasts in the VibeWell community",
};

export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 