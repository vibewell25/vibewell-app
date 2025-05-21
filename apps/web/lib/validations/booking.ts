import { z } from "zod";

export const bookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Please select a valid date" }),
  time: z.string().regex(/^\d{2}:\d{2}$/, { message: "Please select a valid time" }),
  notes: z.string().max(500, { message: "Notes cannot exceed 500 characters" }).optional(),
}); 