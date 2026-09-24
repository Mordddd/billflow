import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InvoiceStatusBadge } from "@/components/invoice-status-badge"
import { formatRupiah, formatDate, buildWhatsAppLink } from "@/lib/utils"
import { getInvoiceById, recordPayment, updateInvoiceStatus } from "@/lib/actions"
import type { InvoiceStatus } from "@/lib/types"
import {
  ArrowLeft,
  Send,
  Download,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"
import { CopyLinkButton } from "./copy-link-button"

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getInvoiceById(id)
  if (!data) notFound()

  const { invoice, items, payments, org } = data

  const publicUrl = `/invoice/${invoice.invoice_number}`

  const whatsappMessage = `Halo ${invoice.customer.name},

Berikut invoice dari ${org.name || "kami"}.

Invoice: ${invoice.invoice_number}
Total: ${formatRupiah(invoice.total)}
Jatuh tempo: ${formatDate(invoice.due_date)}

Terima kasih.`

  const whatsappLink = invoice.customer.whatsapp
    ? buildWhatsAppLink(invoice.customer.whatsapp, whatsappMessage)
    : null

  const totalPaid = payments.reduce((s, p) => s + p.amount, 0)
  const remaining = invoice.total - totalPaid

  async function markAsPaid() {
    "use server"
    await updateInvoiceStatus(id, "paid" as InvoiceStatus)
    const { redirect } = await import("next/navigation")
    redirect(`/invoices/${id}`)
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
          <CopyLinkButton path={publicUrl} />
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5" />
            PDF
          </Button>
          {whatsappLink && (
            <Button size="sm" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Send className="h-3.5 w-3.5" />
                Send via WhatsApp
              </a>
            </Button>
          )}
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
                    <p className="text-lg font-semibold">{org.name || "Your Business"}</p>
                    {org.email && (
                      <p className="text-sm text-muted-foreground">{org.email}</p>
                    )}
                    {org.address && (
                      <p className="text-sm text-muted-foreground">{org.address}</p>
                    )}
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
                    {invoice.customer.address && (
                      <p className="text-sm text-muted-foreground">{invoice.customer.address}</p>
                    )}
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
                        <th className="text-left pb-3 font-medium">Description</th>
                        <th className="text-right pb-3 font-medium w-16">Qty</th>
                        <th className="text-right pb-3 font-medium w-28">Price</th>
                        <th className="text-right pb-3 font-medium w-28">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {items.map((item) => (
                        <tr key={item.id}>
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
                  {invoice.tax_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax ({invoice.tax_rate}%)</span>
                      <span className="tabular-nums">{formatRupiah(invoice.tax_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span className="tabular-nums">{formatRupiah(invoice.total)}</span>
                  </div>
                  {totalPaid > 0 && (
                    <>
                      <div className="flex justify-between text-sm text-emerald-600">
                        <span>Paid</span>
                        <span className="tabular-nums">-{formatRupiah(totalPaid)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Remaining</span>
                        <span className="tabular-nums">{formatRupiah(remaining)}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Notes */}
                {invoice.notes && (
                  <div className="border-t pt-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground">{invoice.notes}</p>
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
              {invoice.status !== "paid" && (
                <form action={markAsPaid}>
                  <Button className="w-full" variant="success" type="submit">
                    <CheckCircle2 className="h-4 w-4" />
                    Mark as paid
                  </Button>
                </form>
              )}
              {whatsappLink && (
                <Button className="w-full" variant="outline" asChild>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <Send className="h-4 w-4" />
                    Send reminder
                  </a>
                </Button>
              )}
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/invoice/${invoice.invoice_number}`} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  View public page
                </Link>
              </Button>
            </CardContent>
          </Card>

          {(org.bank_name || org.bank_account || org.bank_holder) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Payment info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {org.bank_name && (
                  <div>
                    <p className="text-muted-foreground">Bank</p>
                    <p className="font-medium">{org.bank_name}</p>
                  </div>
                )}
                {org.bank_account && (
                  <div>
                    <p className="text-muted-foreground">Account</p>
                    <p className="font-medium font-mono">{org.bank_account}</p>
                  </div>
                )}
                {org.bank_holder && (
                  <div>
                    <p className="text-muted-foreground">Account holder</p>
                    <p className="font-medium">{org.bank_holder}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payment history */}
          {payments.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {payments.map((p) => (
                  <div key={p.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{formatRupiah(p.amount)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(p.payment_date)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">
                      {p.payment_method.replace("_", " ")}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
