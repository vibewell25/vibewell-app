"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BookingListener } from "./booking-listener";
import { BookingReminder } from "./booking-reminder";

export function NotificationProvider() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Check for current user
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get user's profile ID (not auth ID)
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("userId", user.id)
          .single();

        if (profile) {
          setUserId(profile.id);
        }
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("userId", session.user.id)
            .single();

          if (profile) {
            setUserId(profile.id);
          }
        } else if (event === "SIGNED_OUT") {
          setUserId(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Only render notification components if user is logged in
  if (!userId) return null;
  
  return (
    <>
      <BookingListener userId={userId} />
      <BookingReminder userId={userId} />
    </>
  );
} 