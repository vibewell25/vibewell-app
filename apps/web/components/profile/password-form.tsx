"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, FormInput } from "@vibewell/ui";
import { passwordChangeSchema } from "@/lib/validations/account";
import { createClient } from "@/lib/supabase/client";

type PasswordFormValues = z.infer<typeof passwordChangeSchema>;

export function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: "", // We'll get this from the session in the next step
        password: data.currentPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }

      // Get the user's email from the session
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user.email) {
        throw new Error("Unable to retrieve user information");
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setMessage({
        type: "success",
        text: "Password updated successfully",
      });
      
      // Reset the form
      reset();
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success" ? "bg-green-50 text-green-900" : "bg-red-50 text-red-900"
          }`}
        >
          {message.text}
        </div>
      )}

      <FormInput
        id="currentPassword"
        label="Current Password"
        type="password"
        error={errors.currentPassword?.message}
        {...register("currentPassword")}
      />

      <FormInput
        id="newPassword"
        label="New Password"
        type="password"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />

      <FormInput
        id="confirmPassword"
        label="Confirm New Password"
        type="password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button type="submit" isLoading={isLoading} loadingText="Updating...">
        Update Password
      </Button>
    </form>
  );
} 