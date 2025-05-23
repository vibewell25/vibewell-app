"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { StarRating } from "./star-rating";

interface ReviewFormProps {
  serviceId: string;
  providerId: string;
  bookingId: string;
  userId: string;
  onSuccess?: () => void;
}

export function ReviewForm({
  serviceId,
  providerId,
  bookingId,
  userId,
  onSuccess,
}: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!userId) {
      toast.error("Please log in to submit a review");
      return;
    }

    if (!bookingId) {
      throw new Error("Booking ID is required for review submission");
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      
      // Get user profile ID
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id")
        .eq("userId", userId)
        .single();
      
      if (!profileData) {
        throw new Error("User profile not found");
      }
      
      // Submit review
      const { error } = await supabase.from("reviews").insert({
        serviceId,
        providerId,
        customerId: profileData.id,
        bookingId,
        rating,
        comment: comment.trim() || "",
        isPublic: true,
      });

      if (error) {
        throw error;
      }

      // If this is a booking review, mark the booking as having a review
      await supabase
        .from("bookings")
        .update({ hasReview: true })
        .eq("id", bookingId);

      toast.success("Review submitted successfully!");
      
      // Reset form
      setRating(0);
      setComment("");
      
      // Callback if provided
      if (onSuccess) {
        onSuccess();
      } else if (serviceId) {
        // Redirect to service page if no callback provided
        router.push(`/services/${serviceId}?success=review_submitted`);
      }
      
      // Refresh page to show new review
      router.refresh();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label 
          htmlFor="rating" 
          className="block text-sm font-medium mb-2"
        >
          Your Rating
        </label>
        <div id="rating">
          <StarRating 
            rating={rating} 
            onChange={handleRatingChange} 
            size="large" 
            interactive
          />
        </div>
      </div>

      <div>
        <label 
          htmlFor="comment" 
          className="block text-sm font-medium mb-2"
        >
          Your Review (Optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full min-h-[120px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Share your experience with this service..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
} 