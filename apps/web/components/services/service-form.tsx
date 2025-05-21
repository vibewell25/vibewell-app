"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@vibewell/ui";
import { FormInput } from "@vibewell/ui";
import { serviceSchema } from "@/lib/validations/service";
import { createClient } from "@/lib/supabase/client";
import { Service } from "@vibewell/types";

// Define a local Category type to match what comes from the database
interface Category {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// Define a concrete type for our form values
interface ServiceFormValues {
  title: string;
  description: string;
  price: number;
  duration: number;
  categoryId: string;
  isActive: boolean;
}

interface ServiceFormProps {
  initialData?: Service;
  providerId: string;
}

export function ServiceForm({ initialData, providerId }: ServiceFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          price: initialData.price,
          duration: initialData.duration,
          categoryId: initialData.categoryId,
          isActive: initialData.isActive,
        }
      : {
          title: "",
          description: "",
          price: 0,
          duration: 60,
          categoryId: "",
          isActive: true,
        },
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("categories").select("*");
      
      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }
      
      if (data) {
        setCategories(data as Category[]);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit: SubmitHandler<ServiceFormValues> = async (data) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      
      if (isEditing && initialData) {
        // Update existing service
        const { error } = await supabase
          .from("services")
          .update({
            title: data.title,
            description: data.description,
            price: data.price,
            duration: data.duration,
            categoryId: data.categoryId,
            isActive: data.isActive,
            updatedAt: new Date().toISOString(),
          })
          .eq("id", initialData.id);

        if (error) {
          throw error;
        }

        setMessage({
          type: "success",
          text: "Service updated successfully",
        });
      } else {
        // Create new service
        const { error } = await supabase.from("services").insert({
          title: data.title,
          description: data.description,
          price: data.price,
          duration: data.duration,
          categoryId: data.categoryId,
          isActive: data.isActive,
          providerId: providerId,
        });

        if (error) {
          throw error;
        }

        setMessage({
          type: "success",
          text: "Service created successfully",
        });
        
        // Redirect to services list after creation
        router.push("/provider/services");
        router.refresh();
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to save service",
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
        id="title"
        label="Service Title"
        error={errors.title?.message}
        {...register("title")}
      />

      <div>
        <label
          htmlFor="description"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Description
        </label>
        <textarea
          id="description"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] mt-2"
          placeholder="Describe your service..."
          {...register("description")}
        ></textarea>
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          id="price"
          label="Price ($)"
          type="number"
          min="0"
          step="0.01"
          error={errors.price?.message}
          {...register("price")}
        />

        <FormInput
          id="duration"
          label="Duration (minutes)"
          type="number"
          min="5"
          step="5"
          error={errors.duration?.message}
          {...register("duration")}
        />
      </div>

      <div>
        <label
          htmlFor="categoryId"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Category
        </label>
        <select
          id="categoryId"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
          {...register("categoryId")}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-sm text-red-500">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="isActive"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          {...register("isActive")}
        />
        <label
          htmlFor="isActive"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Active (visible to customers)
        </label>
      </div>

      <Button type="submit" isLoading={isLoading} loadingText={isEditing ? "Updating..." : "Creating..."}>
        {isEditing ? "Update Service" : "Create Service"}
      </Button>
    </form>
  );
} 