import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format a USD amount like 2450 -> "$2,450" */
export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Build an image URL for a stored reference. Seed data stores Unsplash photo
 * IDs ("1500382017468"); admin uploads store full URLs (Vercel Blob or local
 * /uploads/...). Absolute URLs and local paths pass through untouched.
 */
export function img(id: string, width = 1600, quality = 80) {
  if (!id) return "";
  if (id.startsWith("http") || id.startsWith("/")) return id;
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

/** Static URL used in metadata / Open Graph (fixed width). */
export const OG_IMAGE =
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80";
