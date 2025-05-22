import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/server";
import { NotificationsList } from "@/components/notifications/notifications-list";

export const metadata: Metadata = {
  title: "Notifications | VibeWell",
  description: "View all your notifications",
};

export default async function NotificationsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login?redirect=/notifications");
  }
  
  const profile = await getCurrentProfile();
  
  if (!profile) {
    redirect("/auth/login?redirect=/notifications");
  }
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Notifications</h1>
      <p className="text-muted-foreground mb-8">
        View and manage your notifications
      </p>
      
      <div className="max-w-3xl mx-auto">
        <NotificationsList userId={profile.id} />
      </div>
    </div>
  );
} 