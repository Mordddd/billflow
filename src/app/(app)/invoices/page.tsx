import Link from "next/link"
import { Button } from "@/components/ui/button"
import { InvoiceStatusBadge } from "@/components/invoice-status-badge"
import { EmptyState } from "@/components/empty-state"
import { formatRupiah, formatDate } from "@/lib/utils"
import { getInvoices } from "@/lib/actions"
import {
  FileText,
  Plus,
  Search,
} from "lucide-react"
import { Input } from "@/components/ui/input"

export default async function InvoicesPage() {
  const invoices = await getInvoices()

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

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." className="pl-9" />
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
