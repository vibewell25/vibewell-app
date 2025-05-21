import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { PasswordForm } from "@/components/profile/password-form";

export const metadata: Metadata = {
  title: "Account Settings | VibeWell",
  description: "Manage your VibeWell account settings",
};

export default async function AccountSettingsPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    notFound();
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account security and preferences.
        </p>
      </div>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">Change Password</h3>
            <PasswordForm />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Email Preferences</h2>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <p className="text-muted-foreground mb-4">
              Coming soon! You'll be able to manage your email notification preferences here.
            </p>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <p className="text-muted-foreground mb-4">
              Coming soon! You'll be able to manage your privacy settings here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 