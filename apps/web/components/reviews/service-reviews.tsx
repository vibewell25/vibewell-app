"use client";

import * as React from "react";
import Link from "next/link";
import { Review, ReviewSummary } from "@vibewell/types";

interface ServiceReviewsProps {
  reviews: Review[];
  summary: ReviewSummary;
  serviceId: string;
  showReviewForm?: boolean;
}

export function ServiceReviews({ reviews, summary, serviceId, showReviewForm = true }: ServiceReviewsProps) {
  const [activeTab, setActiveTab] = React.useState<"recent" | "highest" | "lowest">("recent");

  // Sort the reviews based on the active tab
  const sortedReviews = React.useMemo(() => {
    const reviewsCopy = [...reviews];
    
    switch (activeTab) {
      case "highest":
        return reviewsCopy.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return reviewsCopy.sort((a, b) => a.rating - b.rating);
      default:
        return reviewsCopy.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [reviews, activeTab]);

  // Format date for display
  const formatReviewDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        {showReviewForm && (
          <Link
            href={`/services/${serviceId}/review`}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Write a Review
          </Link>
        )}
      </div>
      
      {summary.totalReviews > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <div className="rounded-lg border bg-card p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold">{summary.averageRating.toFixed(1)}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={star <= Math.round(summary.averageRating) ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`h-5 w-5 ${
                            star <= Math.round(summary.averageRating) ? "text-yellow-400" : "text-gray-300"
                          }`}
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {summary.totalReviews} {summary.totalReviews === 1 ? "review" : "reviews"}
                  </p>
                </div>

                <div className="mt-6 space-y-2">
                  {[5, 4, 3, 2, 1].map((ratingValue) => {
                    const count = summary.ratings[ratingValue as keyof typeof summary.ratings] || 0;
                    const percentage = summary.totalReviews 
                      ? Math.round((count / summary.totalReviews) * 100) 
                      : 0;
                    
                    return (
                      <div key={ratingValue} className="flex items-center gap-2">
                        <div className="flex items-center">
                          <span className="w-3 text-sm">{ratingValue}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 text-yellow-400"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-2 bg-primary rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground w-8">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="border-b mb-4">
                <div className="flex space-x-4">
                  <button
                    className={`pb-2 text-sm font-medium transition-colors ${
                      activeTab === "recent"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setActiveTab("recent")}
                  >
                    Most Recent
                  </button>
                  <button
                    className={`pb-2 text-sm font-medium transition-colors ${
                      activeTab === "highest"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setActiveTab("highest")}
                  >
                    Highest Rated
                  </button>
                  <button
                    className={`pb-2 text-sm font-medium transition-colors ${
                      activeTab === "lowest"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setActiveTab("lowest")}
                  >
                    Lowest Rated
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {sortedReviews.length > 0 ? (
                  sortedReviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            {review.customer?.avatarUrl ? (
                              <img
                                src={review.customer.avatarUrl}
                                alt={review.customer.displayName || `${review.customer.firstName} ${review.customer.lastName}`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xs font-medium text-primary">
                                {review.customer?.firstName?.charAt(0)}
                                {review.customer?.lastName?.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {review.customer?.displayName || 
                                `${review.customer?.firstName} ${review.customer?.lastName?.charAt(0)}.`}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatReviewDate(review.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill={star <= review.rating ? "currentColor" : "none"}
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`h-4 w-4 ${
                                star <= review.rating ? "text-yellow-400" : "text-gray-300"
                              }`}
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No reviews found with this filter.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-lg border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h3 className="mb-1 text-xl font-semibold">No Reviews Yet</h3>
          <p className="text-muted-foreground mb-4">
            Be the first to share your experience with this service.
          </p>
          {showReviewForm && (
            <Link
              href={`/services/${serviceId}/review`}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Write a Review
            </Link>
          )}
        </div>
      )}
    </div>
  );
} 