import Link from "next/link"
import { Button } from "@/components/ui/button"
import { InvoiceStatusBadge } from "@/components/invoice-status-badge"
import { EmptyState } from "@/components/empty-state"
import { formatRupiah, formatDate } from "@/lib/utils"
import type { Invoice, InvoiceStatus } from "@/lib/types"
import {
  FileText,
  Plus,
  Search,
} from "lucide-react"
import { Input } from "@/components/ui/input"

// ponytail: demo data — replace with Supabase query
const invoices: (Omit<Invoice, 'customer'> & { customer: { name: string } })[] = [
  {
    id: "1",
    organization_id: "org1",
    customer_id: "c1",
    invoice_number: "INV-2026-0098",
    status: "pending",
    issue_date: "2026-09-20",
    due_date: "2026-09-28",
    subtotal: 2500000,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total: 2500000,
    notes: null,
    currency: "IDR",
    created_at: "2026-09-20",
    updated_at: "2026-09-20",
    customer: { name: "PT Example" },
  },
  {
    id: "2",
    organization_id: "org1",
    customer_id: "c2",
    invoice_number: "INV-2026-0097",
    status: "paid",
    issue_date: "2026-09-18",
    due_date: "2026-09-25",
    subtotal: 850000,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total: 850000,
    notes: null,
    currency: "IDR",
    created_at: "2026-09-18",
    updated_at: "2026-09-25",
    customer: { name: "Budi Santoso" },
  },
  {
    id: "3",
    organization_id: "org1",
    customer_id: "c3",
    invoice_number: "INV-2026-0091",
    status: "overdue",
    issue_date: "2026-09-10",
    due_date: "2026-09-19",
    subtotal: 3500000,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total: 3500000,
    notes: null,
    currency: "IDR",
    created_at: "2026-09-10",
    updated_at: "2026-09-10",
    customer: { name: "CV Maju Bersama" },
  },
  {
    id: "4",
    organization_id: "org1",
    customer_id: "c4",
    invoice_number: "INV-2026-0090",
    status: "draft",
    issue_date: "2026-09-08",
    due_date: "2026-09-22",
    subtotal: 1200000,
    discount: 0,
    tax_rate: 0,
    tax_amount: 0,
    total: 1200000,
    notes: null,
    currency: "IDR",
    created_at: "2026-09-08",
    updated_at: "2026-09-08",
    customer: { name: "Sari Dewi" },
  },
]

const statusFilters: { label: string; value: InvoiceStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Overdue", value: "overdue" },
]

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all your invoices
          </p>
        </div>
        <Button asChild>
          <Link href="/invoices/new">
            <Plus className="h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." className="pl-9" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              className="shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
              data-active={f.value === "all"}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice list */}
      {invoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          description="Create your first invoice to start tracking payments."
          actionLabel="Create Invoice"
          actionHref="/invoices/new"
        />
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => (
            <Link
              key={inv.id}
              href={`/invoices/${inv.id}`}
              className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors duration-150"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium font-mono">
                      {inv.invoice_number}
                    </span>
                    <InvoiceStatusBadge status={inv.status} />
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {inv.customer.name}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-sm font-semibold tabular-nums">
                  {formatRupiah(inv.total)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Due {formatDate(inv.due_date)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
