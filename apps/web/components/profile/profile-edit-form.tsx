"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface ProfileEditFormProps {
  profile: any;
  onCancel: () => void;
}

export function ProfileEditForm({ profile, onCancel }: ProfileEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    address: profile.address || "",
    city: profile.city || "",
    state: profile.state || "",
    zipCode: profile.zipCode || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      // In a real app, you would update the profile in the database
      // For now, we'll just simulate success
      // const { error } = await supabase
      //   .from("profiles")
      //   .update({
      //     firstName: formData.firstName,
      //     lastName: formData.lastName,
      //     phone: formData.phone,
      //     address: formData.address,
      //     city: formData.city,
      //     state: formData.state,
      //     zipCode: formData.zipCode,
      //   })
      //   .eq("id", profile.id);

      // if (error) throw error;

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh the page to show updated data
      router.refresh();
      onCancel();
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded-md bg-gray-100"
          disabled
        />
        <p className="text-xs text-muted-foreground">
          Email cannot be changed. Contact support for assistance.
        </p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
      </div>
      
      <div className="space-y-2 pt-4 border-t">
        <label htmlFor="address" className="text-sm font-medium">
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="state" className="text-sm font-medium">
            State
          </label>
          <input
            id="state"
            name="state"
            type="text"
            value={formData.state}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="zipCode" className="text-sm font-medium">
            ZIP Code
          </label>
          <input
            id="zipCode"
            name="zipCode"
            type="text"
            value={formData.zipCode}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-70"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
} 