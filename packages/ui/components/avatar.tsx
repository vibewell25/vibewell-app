"use client";

import React from "react";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ src, alt, initials, size = "md", className = "" }: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const baseClasses = "flex items-center justify-center rounded-full overflow-hidden bg-primary/10 text-primary font-medium";
  const allClasses = `${baseClasses} ${sizeClasses[size]} ${className}`;

  if (src) {
    return (
      <div className={allClasses}>
        <img 
          src={src} 
          alt={alt || "Avatar"} 
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "";
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }

  return (
    <div className={allClasses}>
      {initials ? initials.substring(0, 2).toUpperCase() : "👤"}
    </div>
  );
} 