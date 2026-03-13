import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, parseISO } from 'date-fns';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dateFormat(timestamp: string): string {
  // Parse the ISO 8601 string into a Date object
  const date = parseISO(timestamp);

  // Get the relative time string
  const relativeTime = formatDistanceToNow(date, { addSuffix: true });

  return relativeTime;
}

// Example usage
const timestamp = '2024-05-14T08:22:23.625+00:00';
console.log(dateFormat(timestamp)); // e.g., "2 days ago" or "2 minutes ago"

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};