"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@vibewell/ui";
import { createClient } from "@/lib/supabase/client";
import { BookingStatus } from "@vibewell/types";
import { showBookingNotification } from "@/components/notifications";

const cancellationSchema = z.object({
  reason: z.string().min(1, "Please select a reason for cancellation"),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  confirmed: z.boolean().refine((val) => val === true, {
    message: "You must confirm the cancellation",
  }),
});

type CancellationFormValues = z.infer<typeof cancellationSchema>;

interface BookingCancellationFormProps {
  bookingId: string;
  cancellationFee: number;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
}

export function BookingCancellationForm({ 
  bookingId, 
  cancellationFee, 
  serviceName,
  bookingDate,
  bookingTime
}: BookingCancellationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<CancellationFormValues>({
    resolver: zodResolver(cancellationSchema),
    defaultValues: {
      reason: "",
      notes: "",
      confirmed: false,
    },
  });

  const cancellationReasons = [
    "Schedule conflict",
    "No longer needed",
    "Found alternative service",
    "Service too expensive",
    "Health reasons",
    "Weather concerns",
    "Transportation issues",
    "Other",
  ];

  const onSubmit = async (data: CancellationFormValues) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      // Update booking status to cancelled
      const { error } = await supabase
        .from("bookings")
        .update({
          status: BookingStatus.CANCELLED,
          cancellationReason: data.reason,
          cancellationNotes: data.notes || null,
          cancellationFee: cancellationFee > 0 ? cancellationFee : null,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", bookingId);

      if (error) {
        throw error;
      }

      setMessage({
        type: "success",
        text: "Your booking has been cancelled successfully. You will be redirected to your bookings page.",
      });

      // Show booking cancelled notification
      showBookingNotification({
        type: "cancelled",
        bookingId,
        serviceName,
        date: bookingDate,
        time: bookingTime,
      });

      // Redirect to bookings page after successful cancellation
      setTimeout(() => {
        router.push("/bookings");
        router.refresh();
      }, 2000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to cancel booking",
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

      <div className="space-y-2">
        <label htmlFor="reason" className="text-sm font-medium">
          Reason for Cancellation
        </label>
        <select
          id="reason"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...register("reason")}
        >
          <option value="">Select a reason</option>
          {cancellationReasons.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
        {errors.reason && (
          <p className="text-sm text-red-500">{errors.reason.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Additional Notes (Optional)
        </label>
        <textarea
          id="notes"
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Any additional information about your cancellation..."
          {...register("notes")}
        ></textarea>
        {errors.notes && (
          <p className="text-sm text-red-500">{errors.notes.message}</p>
        )}
      </div>

      <div className="flex items-start gap-3">
        <input
          id="confirmed"
          type="checkbox"
          className="h-4 w-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary"
          {...register("confirmed")}
        />
        <div>
          <label htmlFor="confirmed" className="font-medium">
            Confirm Cancellation
          </label>
          <p className="text-sm text-muted-foreground">
            I understand that by cancelling this booking, 
            {cancellationFee > 0 
              ? ` I will be charged a cancellation fee of $${cancellationFee.toFixed(2)}.` 
              : " I will not be charged any fees."
            }
          </p>
          {errors.confirmed && (
            <p className="text-sm text-red-500">{errors.confirmed.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          onClick={() => router.back()}
          className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          Go Back
        </Button>
        <Button 
          type="submit"
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Cancel Booking"}
        </Button>
      </div>
    </form>
  );
} 