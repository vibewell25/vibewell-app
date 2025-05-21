import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }).max(100, { message: "Title must be less than 100 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(1000, { message: "Description must be less than 1000 characters" }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  duration: z.coerce.number().min(5, { message: "Duration must be at least 5 minutes" }).max(480, { message: "Duration must be less than 8 hours" }),
  categoryId: z.string().min(1, { message: "Please select a category" }),
  isActive: z.boolean().default(true),
}); 