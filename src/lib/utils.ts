import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format number as Indonesian Rupiah: Rp 2.500.000 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Format date as "30 Sep 2026" */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d)
}

/** Generate next invoice number: INV-2026-0001 */
export function generateInvoiceNumber(
  prefix: string,
  sequence: number
): string {
  const year = new Date().getFullYear()
  return `${prefix}${year}-${String(sequence).padStart(4, "0")}`
}

/** Build WhatsApp deep link with prefilled message */
export function buildWhatsAppLink(phone: string, message: string): string {
  // Strip non-digits, ensure country code
  const clean = phone.replace(/\D/g, "")
  const withCode = clean.startsWith("62") ? clean : `62${clean.replace(/^0/, "")}`
  return `https://wa.me/${withCode}?text=${encodeURIComponent(message)}`
}

/** Calculate days overdue (negative = days until due) */
export function daysOverdue(dueDate: Date | string): number {
  const due = new Date(typeof dueDate === "string" ? dueDate : dueDate.getTime())
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  return Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
}
