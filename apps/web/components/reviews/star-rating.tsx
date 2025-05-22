"use client";

import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: "small" | "medium" | "large";
  interactive?: boolean;
  maxRating?: number;
}

export function StarRating({ 
  rating, 
  onChange, 
  size = "medium", 
  interactive = false,
  maxRating = 5
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleMouseEnter = (index: number) => {
    if (!interactive) return;
    setHoverRating(index);
  };
  
  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };
  
  const handleClick = (index: number) => {
    if (!interactive || !onChange) return;
    onChange(index);
  };
  
  // Size configuration
  const sizeConfig = {
    small: {
      starSize: 16,
      gap: 1,
    },
    medium: {
      starSize: 20,
      gap: 2,
    },
    large: {
      starSize: 24,
      gap: 4,
    },
  };
  
  const { starSize, gap } = sizeConfig[size];
  
  // Display rating text for interactive mode
  const getRatingText = (rating: number) => {
    if (rating === 0) return "Select a rating";
    if (rating === 1) return "Poor";
    if (rating === 2) return "Fair";
    if (rating === 3) return "Good";
    if (rating === 4) return "Very Good";
    return "Excellent";
  };
  
  // Calculate the effective rating (hover rating takes precedence)
  const effectiveRating = hoverRating > 0 ? hoverRating : rating;
  
  return (
    <div className="flex items-center">
      <div className={`flex gap-${gap}`}>
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            className={`flex items-center justify-center ${
              interactive ? "cursor-pointer" : "cursor-default"
            }`}
            aria-label={`Rate ${index} stars`}
            tabIndex={interactive ? 0 : -1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={starSize}
              height={starSize}
              viewBox="0 0 24 24"
              fill={effectiveRating >= index ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${
                effectiveRating >= index ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        ))}
      </div>
      
      {interactive && (
        <span className="ml-2 text-sm text-muted-foreground">
          {getRatingText(effectiveRating)}
        </span>
      )}
    </div>
  );
} 