"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, FormInput } from "@vibewell/ui";
import { profileSchema } from "@/lib/validations/profile";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@vibewell/types";

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      displayName: profile.displayName || null,
      email: profile.email,
      bio: profile.bio || null,
      phone: profile.phone || null,
      address: profile.address || null,
      city: profile.city || null,
      state: profile.state || null,
      zipCode: profile.zipCode || null,
      country: profile.country || null,
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName,
          bio: data.bio,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) {
        throw error;
      }

      setMessage({
        type: "success",
        text: "Profile updated successfully",
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput
          id="firstName"
          label="First Name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <FormInput
          id="lastName"
          label="Last Name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <FormInput
        id="displayName"
        label="Display Name (optional)"
        error={errors.displayName?.message}
        {...register("displayName")}
      />

      <FormInput
        id="email"
        label="Email"
        type="email"
        disabled
        error={errors.email?.message}
        {...register("email")}
      />

      <div>
        <label
          htmlFor="bio"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Bio (optional)
        </label>
        <textarea
          id="bio"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] mt-2"
          placeholder="Tell us about yourself"
          {...register("bio")}
        ></textarea>
        {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
      </div>

      <FormInput
        id="phone"
        label="Phone Number (optional)"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <FormInput
        id="address"
        label="Address (optional)"
        error={errors.address?.message}
        {...register("address")}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FormInput
          id="city"
          label="City (optional)"
          error={errors.city?.message}
          {...register("city")}
        />
        <FormInput
          id="state"
          label="State/Province (optional)"
          error={errors.state?.message}
          {...register("state")}
        />
        <FormInput
          id="zipCode"
          label="Zip/Postal Code (optional)"
          error={errors.zipCode?.message}
          {...register("zipCode")}
        />
      </div>

      <FormInput
        id="country"
        label="Country (optional)"
        error={errors.country?.message}
        {...register("country")}
      />

      <Button type="submit" isLoading={isLoading} loadingText="Saving...">
        Save Changes
      </Button>
    </form>
  );
} 