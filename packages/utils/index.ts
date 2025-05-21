import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to display in human readable format
 * @param date The date to format
 * @returns A formatted date string (e.g. "Monday, January 1, 2023")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format a time to display in human readable format
 * @param date The date object containing the time to format
 * @returns A formatted time string (e.g. "2:30 PM")
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format a currency amount
 * @param amount The amount to format
 * @param currency The currency code (default: 'USD')
 * @returns A formatted currency string (e.g. "$100.00")
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}

/**
 * Calculate time between two dates (e.g., "10 minutes ago")
 */
export function timeAgo(date: Date | string | number): string {
  const formatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );
  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return formatter.format(-interval, "year");
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return formatter.format(-interval, "month");
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return formatter.format(-interval, "day");
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return formatter.format(-interval, "hour");
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return formatter.format(-interval, "minute");
  }
  return formatter.format(-Math.floor(seconds), "second");
}

/**
 * Generate a random integer in a range (min inclusive, max inclusive)
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Truncate a string to a maximum length and add ellipsis if needed
 * @param str The string to truncate
 * @param maxLength The maximum length
 * @returns The truncated string
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

/**
 * Capitalize the first letter of a string
 * @param str The string to capitalize
 * @returns The capitalized string
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Get browser locale
 */
export function getBrowserLocale(defaultLocale = "en-US"): string {
  if (typeof window === "undefined") return defaultLocale;
  return navigator.language || defaultLocale;
}

/**
 * Sleep for a specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
} 