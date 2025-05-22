"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@vibewell/types";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  displayName: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      displayName: profile.displayName || "",
      bio: profile.bio || "",
      phone: profile.phone || "",
      address: profile.address || "",
      city: profile.city || "",
      state: profile.state || "",
      zipCode: profile.zipCode || "",
      country: profile.country || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName || null,
          bio: data.bio || null,
          phone: data.phone || null,
          address: data.address || null,
          city: data.city || null,
          state: data.state || null,
          zipCode: data.zipCode || null,
          country: data.country || null,
          updatedAt: new Date().toISOString(),
        })
        .eq("userId", profile.userId);

      if (updateError) {
        throw updateError;
      }

      setSuccess("Profile updated successfully");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred while updating your profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
          {error}
        </div>
      )}
      
      {success && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-500">
          {success}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </label>
          <input
            id="firstName"
            {...register("firstName")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </label>
          <input
            id="lastName"
            {...register("lastName")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="displayName" className="text-sm font-medium">
          Display Name (optional)
        </label>
        <input
          id="displayName"
          {...register("displayName")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio (optional)
        </label>
        <textarea
          id="bio"
          {...register("bio")}
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone Number (optional)
        </label>
        <input
          id="phone"
          {...register("phone")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium">
          Address (optional)
        </label>
        <input
          id="address"
          {...register("address")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium">
            City (optional)
          </label>
          <input
            id="city"
            {...register("city")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="state" className="text-sm font-medium">
            State (optional)
          </label>
          <input
            id="state"
            {...register("state")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="zipCode" className="text-sm font-medium">
            Zip Code (optional)
          </label>
          <input
            id="zipCode"
            {...register("zipCode")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium">
            Country (optional)
          </label>
          <input
            id="country"
            {...register("country")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
} 