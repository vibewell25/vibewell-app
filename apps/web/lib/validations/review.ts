import { z } from "zod";

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, { message: "Rating must be at least 1 star" })
    .max(5, { message: "Rating must not exceed 5 stars" }),
  comment: z
    .string()
    .min(10, { message: "Comment must be at least 10 characters" })
    .max(1000, { message: "Comment must not exceed 1000 characters" }),
  isPublic: z.boolean().default(true),
}); 