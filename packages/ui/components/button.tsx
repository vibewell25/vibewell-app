"use client";

import React, { forwardRef } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
  loadingText?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      className = "", 
      variant = "default", 
      size = "default", 
      isLoading = false, 
      loadingText, 
      children, 
      disabled, 
      ...props 
    }, 
    ref
  ) => {
    // Base classes
    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    // Variant classes
    const variantClasses = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    };
    
    // Size classes
    const sizeClasses = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md text-sm",
      lg: "h-11 px-8 rounded-md",
      icon: "h-10 w-10",
    };
    
    const allClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
    
    return (
      <button 
        ref={ref}
        className={allClasses}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <svg 
              className="mr-2 h-4 w-4 animate-spin" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button"; 