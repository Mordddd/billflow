// ── Core database types ──

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "pending"
  | "paid"
  | "overdue"
  | "cancelled"

export type PaymentMethod =
  | "bank_transfer"
  | "cash"
  | "qris"
  | "e_wallet"
  | "other"

export type ReminderType =
  | "before_3_days"
  | "before_1_day"
  | "on_due_date"
  | "after_1_day"
  | "after_3_days"
  | "after_7_days"

export interface Organization {
  id: string
  name: string
  logo_url: string | null
  phone: string | null
  email: string | null
  address: string | null
  invoice_prefix: string
  invoice_start_number: number
  bank_name: string | null
  bank_account: string | null
  bank_holder: string | null
  qris_url: string | null
  payment_instructions: string | null
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  organization_id: string
  name: string
  whatsapp: string | null
  email: string | null
  address: string | null
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  organization_id: string
  customer_id: string
  invoice_number: string
  status: InvoiceStatus
  issue_date: string
  due_date: string
  subtotal: number
  discount: number
  tax_rate: number
  tax_amount: number
  total: number
  notes: string | null
  currency: string
  created_at: string
  updated_at: string
  // Joined
  customer?: Customer
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  unit_price: number
  discount: number
  amount: number
  sort_order: number
}

export interface Payment {
  id: string
  organization_id: string
  invoice_id: string
  amount: number
  payment_date: string
  payment_method: PaymentMethod
  notes: string | null
  created_at: string
  // Joined
  invoice?: Invoice
}

export interface Reminder {
  id: string
  invoice_id: string
  reminder_type: ReminderType
  scheduled_at: string
  sent_at: string | null
  message: string | null
  created_at: string
}

export interface MessageTemplate {
  id: string
  organization_id: string
  type: "invoice" | "reminder" | "overdue"
  name: string
  template: string
  created_at: string
  updated_at: string
}

// ── Dashboard aggregates ──

export interface DashboardSummary {
  outstanding: number
  paid_this_month: number
  overdue: number
  total_invoices: number
}
