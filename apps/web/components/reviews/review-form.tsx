"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@vibewell/ui";
import { reviewSchema } from "@/lib/validations/review";
import { createClient } from "@/lib/supabase/client";
import { Service, Booking, Profile } from "@vibewell/types";

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  booking: Booking;
  service: Service;
  profile: Profile;
}

export function ReviewForm({ booking, service, profile }: ReviewFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const [rating, setRating] = React.useState<number>(0);

  const { 
    register, 
    handleSubmit, 
    setValue,
    formState: { errors } 
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      isPublic: true,
    },
  });

  // Update form value when rating changes
  React.useEffect(() => {
    setValue("rating", rating);
  }, [rating, setValue]);

  const onSubmit = async (data: ReviewFormValues) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      // Create the review
      const { error } = await supabase.from("reviews").insert({
        bookingId: booking.id,
        customerId: profile.id,
        providerId: service.providerId,
        serviceId: service.id,
        rating: data.rating,
        comment: data.comment,
        isPublic: data.isPublic,
      });

      if (error) {
        throw error;
      }

      // Update booking to indicate review was submitted
      await supabase
        .from("bookings")
        .update({ hasReview: true })
        .eq("id", booking.id);

      setMessage({
        type: "success",
        text: "Thank you for your review! Your feedback helps others make informed decisions.",
      });

      // Redirect to booking details page after successful review submission
      setTimeout(() => {
        router.push(`/bookings/${booking.id}`);
        router.refresh();
      }, 3000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to submit review",
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

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Rating</label>
          <div className="mt-2 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="h-8 w-8 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={rating >= value ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-6 w-6 ${
                    rating >= value ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {rating === 0 
                ? "Select a rating" 
                : rating === 1 
                  ? "Poor" 
                  : rating === 2 
                    ? "Fair" 
                    : rating === 3 
                      ? "Good" 
                      : rating === 4 
                        ? "Very Good" 
                        : "Excellent"}
            </span>
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-500">{errors.rating.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="comment" className="text-sm font-medium">
            Review
          </label>
          <textarea
            id="comment"
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Share your experience with this service..."
            {...register("comment")}
          ></textarea>
          {errors.comment && (
            <p className="text-sm text-red-500">{errors.comment.message}</p>
          )}
        </div>

        <div className="flex items-start gap-3">
          <input
            id="isPublic"
            type="checkbox"
            className="h-4 w-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary"
            {...register("isPublic")}
          />
          <div>
            <label htmlFor="isPublic" className="font-medium">
              Make review public
            </label>
            <p className="text-sm text-muted-foreground">
              Your review will be visible to other users on the service page.
            </p>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        isLoading={isLoading}
        loadingText="Submitting..."
        disabled={rating === 0}
      >
        Submit Review
      </Button>
    </form>
  );
} 