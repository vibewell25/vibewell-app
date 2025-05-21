import { z } from "zod";
import { UserRole } from "@vibewell/types";

export const profileSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  displayName: z.string().optional().nullable(),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
  bio: z.string().max(500, { message: "Bio cannot exceed 500 characters" }).optional().nullable(),
  phone: z.string().regex(/^\+?[0-9\s\-\(\)]{7,}$/, { 
    message: "Please enter a valid phone number"
  }).optional().nullable(),
  address: z.string().max(100).optional().nullable(),
  city: z.string().max(50).optional().nullable(),
  state: z.string().max(50).optional().nullable(),
  zipCode: z.string().max(20).optional().nullable(),
  country: z.string().max(50).optional().nullable(),
}); 