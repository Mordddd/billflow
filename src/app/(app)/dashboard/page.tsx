import { formatRupiah } from "@/lib/utils"
import { getDashboardData } from "@/lib/actions"
import { Card, CardContent } from "@/components/ui/card"
import { InvoiceStatusBadge } from "@/components/invoice-status-badge"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import {
  ArrowUpRight,
  AlertCircle,
  FileText,
  Bell,
  Eye,
} from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const { summary, recentInvoices } = await getDashboardData()

  const now = new Date()
  const overdueInvoices = recentInvoices.filter(
    (i) => i.status === "overdue" || (["sent", "pending"].includes(i.status) && new Date(i.due_date) < now)
  )

  const summaryCards = [
    { label: "Outstanding", value: summary.outstanding, isMoney: true },
    { label: "Paid this month", value: summary.paid_this_month, isMoney: true },
    { label: "Overdue", value: summary.overdue, isMoney: true, accent: true },
    { label: "Total invoices", value: summary.total_invoices, isMoney: false },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your invoicing activity
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="relative overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {card.label}
              </p>
              <p
                className={`text-xl sm:text-2xl font-semibold mt-1 tabular-nums ${
                  card.accent ? "text-red-600" : ""
                }`}
              >
                {card.isMoney ? formatRupiah(card.value) : card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Needs attention */}
      {overdueInvoices.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <h2 className="text-base font-semibold">Needs attention</h2>
          </div>
          <div className="space-y-3">
            {overdueInvoices.map((inv) => {
              const daysLate = Math.floor(
                (Date.now() - new Date(inv.due_date).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
              return (
                <Card
                  key={inv.id}
                  className="border-red-100 bg-red-50/30"
                >
                  <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold font-mono">
                          {inv.invoice_number}
                        </span>
                        <InvoiceStatusBadge status={inv.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {inv.customer.name}
                      </p>
                      <p className="text-lg font-semibold">
                        {formatRupiah(inv.total)}
                      </p>
                      <p className="text-xs text-red-600 font-medium">
                        Overdue by {daysLate} days
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/invoices/${inv.id}`}>
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Bell className="h-3.5 w-3.5" />
                        Remind
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* Recent invoices */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Recent invoices</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/invoices">
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {recentInvoices.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No invoices yet"
            description="Create your first invoice to start tracking payments."
            actionLabel="Create Invoice"
            actionHref="/invoices/new"
          />
        ) : (
          <div className="space-y-2">
            {recentInvoices.map((inv) => (
              <Link
                key={inv.id}
                href={`/invoices/${inv.id}`}
                className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors duration-150 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium font-mono truncate">
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
                    Due {new Date(inv.due_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
