import { formatRupiah, formatDate } from "@/lib/utils"
import { InvoiceStatusBadge } from "@/components/invoice-status-badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

// ponytail: fetch from Supabase by invoice_number, no auth required
// This is the public-facing invoice page customers see

export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ number: string }>
}) {
  const { number } = await params

  // Demo data — replace with DB fetch
  const invoice = {
    invoice_number: number,
    status: "pending" as const,
    issue_date: "2026-09-20",
    due_date: "2026-09-28",
    total: 2500000,
    subtotal: 2500000,
    tax_amount: 0,
    tax_rate: 0,
    discount: 0,
    notes: "Terima kasih atas kepercayaan Anda.",
    business: {
      name: "Studio Kreatif",
      email: "hello@studiokreatif.com",
      address: "Jakarta, Indonesia",
      bank_name: "BCA",
      bank_account: "123456789",
      bank_holder: "Studio Kreatif",
    },
    customer: { name: "PT Example" },
    items: [
      { description: "Website Development", quantity: 1, unit_price: 2000000, amount: 2000000 },
      { description: "Logo Design", quantity: 1, unit_price: 500000, amount: 500000 },
    ],
  }

  return (
    <div className="min-h-[100dvh] bg-muted/40 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-semibold tracking-tight">BillFlow</span>
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </Button>
        </div>

        {/* Invoice card */}
        <div className="rounded-xl border bg-card p-6 sm:p-8 space-y-6">
          {/* Business + invoice number */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-semibold">{invoice.business.name}</p>
              <p className="text-sm text-muted-foreground">{invoice.business.email}</p>
              <p className="text-sm text-muted-foreground">{invoice.business.address}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold font-mono">{invoice.invoice_number}</p>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
          </div>

          {/* Bill to + dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Bill to</p>
              <p className="text-sm font-medium">{invoice.customer.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Issue date</p>
                <p className="text-sm">{formatDate(invoice.issue_date)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Due date</p>
                <p className="text-sm">{formatDate(invoice.due_date)}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="border-t pt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left pb-3 font-medium">Description</th>
                  <th className="text-right pb-3 font-medium w-16">Qty</th>
                  <th className="text-right pb-3 font-medium w-28">Price</th>
                  <th className="text-right pb-3 font-medium w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoice.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-3">{item.description}</td>
                    <td className="py-3 text-right tabular-nums">{item.quantity}</td>
                    <td className="py-3 text-right tabular-nums">{formatRupiah(item.unit_price)}</td>
                    <td className="py-3 text-right tabular-nums font-medium">{formatRupiah(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums">{formatRupiah(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Total</span>
              <span className="tabular-nums">{formatRupiah(invoice.total)}</span>
            </div>
          </div>

          {/* Payment info */}
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Payment information</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Bank</p>
                <p className="font-medium">{invoice.business.bank_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Account</p>
                <p className="font-medium font-mono">{invoice.business.bank_account}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Account holder</p>
                <p className="font-medium">{invoice.business.bank_holder}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Powered by BillFlow
        </p>
      </div>
    </div>
  )
}
