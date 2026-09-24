"use client"

import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InvoiceStatusBadge } from "@/components/invoice-status-badge"
import { formatRupiah, formatDate, buildWhatsAppLink } from "@/lib/utils"
import type { Invoice, InvoiceItem } from "@/lib/types"
import {
  ArrowLeft,
  Send,
  Download,
  CheckCircle2,
  Copy,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"

// ponytail: demo data — replace with Supabase fetch by ID
const invoice: Omit<Invoice, 'customer'> & { customer: { name: string; whatsapp: string } } = {
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
  notes: "Terima kasih atas kepercayaan Anda.",
  currency: "IDR",
  created_at: "2026-09-20",
  updated_at: "2026-09-20",
  customer: { name: "PT Example", whatsapp: "081234567890" },
}

const invoiceItems: InvoiceItem[] = [
  {
    id: "i1",
    invoice_id: "1",
    description: "Website Development",
    quantity: 1,
    unit_price: 2000000,
    discount: 0,
    amount: 2000000,
    sort_order: 0,
  },
  {
    id: "i2",
    invoice_id: "1",
    description: "Logo Design",
    quantity: 1,
    unit_price: 500000,
    discount: 0,
    amount: 500000,
    sort_order: 1,
  },
]

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/invoice/${invoice.invoice_number}`

  const whatsappMessage = `Halo ${invoice.customer.name},

Berikut invoice dari Studio Kreatif.

Invoice: ${invoice.invoice_number}
Total: ${formatRupiah(invoice.total)}
Jatuh tempo: ${formatDate(invoice.due_date)}

Invoice: ${publicUrl}

Terima kasih.`

  const whatsappLink = buildWhatsAppLink(
    invoice.customer.whatsapp,
    whatsappMessage
  )

  function copyLink() {
    navigator.clipboard.writeText(publicUrl)
    toast.success("Invoice link copied!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/invoices">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight font-mono">
                {invoice.invoice_number}
              </h1>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {invoice.customer.name}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={copyLink}>
            <Copy className="h-3.5 w-3.5" />
            Copy link
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5" />
            PDF
          </Button>
          <Button size="sm" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Send className="h-3.5 w-3.5" />
              Send via WhatsApp
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-semibold">Studio Kreatif</p>
                    <p className="text-sm text-muted-foreground">
                      hello@studiokreatif.com
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Jakarta, Indonesia
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold font-mono">
                      {invoice.invoice_number}
                    </p>
                    <InvoiceStatusBadge status={invoice.status} />
                  </div>
                </div>

                {/* Bill to + dates */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Bill to
                    </p>
                    <p className="text-sm font-medium">
                      {invoice.customer.name}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Issue date
                      </p>
                      <p className="text-sm">
                        {formatDate(invoice.issue_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Due date
                      </p>
                      <p className="text-sm">{formatDate(invoice.due_date)}</p>
                    </div>
                  </div>
                </div>

                {/* Items table */}
                <div className="border-t pt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                        <th className="text-left pb-3 font-medium">
                          Description
                        </th>
                        <th className="text-right pb-3 font-medium w-16">
                          Qty
                        </th>
                        <th className="text-right pb-3 font-medium w-28">
                          Price
                        </th>
                        <th className="text-right pb-3 font-medium w-28">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {invoiceItems.map((item) => (
                        <tr key={item.id}>
                          <td className="py-3">{item.description}</td>
                          <td className="py-3 text-right tabular-nums">
                            {item.quantity}
                          </td>
                          <td className="py-3 text-right tabular-nums">
                            {formatRupiah(item.unit_price)}
                          </td>
                          <td className="py-3 text-right tabular-nums font-medium">
                            {formatRupiah(item.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="tabular-nums">
                      {formatRupiah(invoice.subtotal)}
                    </span>
                  </div>
                  {invoice.tax_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Tax ({invoice.tax_rate}%)
                      </span>
                      <span className="tabular-nums">
                        {formatRupiah(invoice.tax_amount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span className="tabular-nums">
                      {formatRupiah(invoice.total)}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {invoice.notes && (
                  <div className="border-t pt-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Notes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="success">
                <CheckCircle2 className="h-4 w-4" />
                Mark as paid
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Send className="h-4 w-4" />
                  Send reminder
                </a>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/invoice/${invoice.invoice_number}`} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  View public page
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payment info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Bank</p>
                <p className="font-medium">BCA</p>
              </div>
              <div>
                <p className="text-muted-foreground">Account</p>
                <p className="font-medium font-mono">123456789</p>
              </div>
              <div>
                <p className="text-muted-foreground">Account holder</p>
                <p className="font-medium">Studio Kreatif</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
