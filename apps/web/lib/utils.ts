import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { UserRole } from '@vibewell/types';

/**
 * Combines multiple class names into a single className string, 
 * handling Tailwind CSS conflicts properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a human-readable string
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(
    typeof date === "string" ? new Date(date) : date
  );
}

/**
 * Format a date to a readable time string
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
}

/**
 * Format a price to a human-readable string with currency symbol
 */
export function formatPrice(price: number, currencyCode = "USD"): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(price);
}

/**
 * Safely handle profile data with fallback properties
 * This handles the case where the profile might be from a fallback source that doesn't have all properties
 */
export function safeProfileData(profileData: any) {
  return {
    id: profileData.id,
    userId: profileData.userId,
    email: profileData.email,
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    role: profileData.role as UserRole,
    createdAt: new Date(profileData.createdAt),
    updatedAt: new Date(profileData.updatedAt),
    // Safely handle optional fields
    displayName: 'displayName' in profileData ? profileData.displayName || undefined : undefined,
    bio: 'bio' in profileData ? profileData.bio || undefined : undefined,
    avatarUrl: 'avatarUrl' in profileData ? profileData.avatarUrl || undefined : undefined,
    phone: 'phone' in profileData ? profileData.phone || undefined : undefined,
    address: 'address' in profileData ? profileData.address || undefined : undefined,
    city: 'city' in profileData ? profileData.city || undefined : undefined,
    state: 'state' in profileData ? profileData.state || undefined : undefined,
    zipCode: 'zipCode' in profileData ? profileData.zipCode || undefined : undefined,
    country: 'country' in profileData ? profileData.country || undefined : undefined,
  };
}

/**
 * Generate a random string ID
 */
export function generateId(length = 10): string {
  return Math.random().toString(36).substring(2, length + 2);
}

/**
 * Truncate text to a specific length and add ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Calculate the time difference between two dates in a human-readable format
 */
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const pastDate = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return `${interval} year${interval === 1 ? "" : "s"} ago`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval} month${interval === 1 ? "" : "s"} ago`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval} day${interval === 1 ? "" : "s"} ago`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval} hour${interval === 1 ? "" : "s"} ago`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval} minute${interval === 1 ? "" : "s"} ago`;
  }
  
  return "just now";
} 