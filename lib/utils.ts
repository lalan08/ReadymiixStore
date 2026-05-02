import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function parseJsonField<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `RMX-${year}${month}-${random}`;
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING:    "En attente",
  CONFIRMED:  "Confirmée",
  PROCESSING: "En préparation",
  SHIPPED:    "Expédiée",
  DELIVERED:  "Livrée",
  CANCELLED:  "Annulée",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING:    "text-brand-warning bg-brand-warning/10 border-brand-warning/30",
  CONFIRMED:  "text-brand-teal   bg-brand-teal/10   border-brand-teal/30",
  PROCESSING: "text-brand-purple bg-brand-purple/10 border-brand-purple/30",
  SHIPPED:    "text-brand-gold   bg-brand-gold/10   border-brand-gold/30",
  DELIVERED:  "text-brand-success bg-brand-success/10 border-brand-success/30",
  CANCELLED:  "text-brand-error  bg-brand-error/10  border-brand-error/30",
};

export const DELIVERY_FEE = 3.0;
export const FREE_DELIVERY_THRESHOLD = 40.0;
