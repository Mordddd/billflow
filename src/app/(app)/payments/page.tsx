import { EmptyState } from "@/components/empty-state"
import { getPayments } from "@/lib/actions"
import { formatRupiah, formatDate } from "@/lib/utils"
import { CreditCard } from "lucide-react"

const methodLabels: Record<string, string> = {
  bank_transfer: "Bank Transfer",
  cash: "Cash",
  qris: "QRIS",
  e_wallet: "E-Wallet",
  other: "Other",
}

export default async function PaymentsPage() {
  const payments = await getPayments()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track all received payments
        </p>
      </div>

      {payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payments recorded"
          description="Payments will appear here when you mark invoices as paid."
        />
      ) : (
        <div className="space-y-2">
          {payments.map((payment: {
            id: string
            amount: number
            payment_date: string
            payment_method: string
            notes: string | null
            invoice: { invoice_number: string; customer: { name: string } } | null
          }) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 rounded-xl border bg-card"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {payment.invoice?.customer?.name ?? "Unknown"}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span>{formatDate(payment.payment_date)}</span>
                  {payment.invoice && (
                    <span className="font-mono">{payment.invoice.invoice_number}</span>
                  )}
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {methodLabels[payment.payment_method] ?? payment.payment_method}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-sm font-semibold tabular-nums text-emerald-600">
                  {formatRupiah(payment.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
