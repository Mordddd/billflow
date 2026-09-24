import { EmptyState } from "@/components/empty-state"
import { CreditCard } from "lucide-react"

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track all received payments
        </p>
      </div>

      {/* ponytail: wire to Supabase payments table */}
      <EmptyState
        icon={CreditCard}
        title="No payments recorded"
        description="Payments will appear here when you mark invoices as paid."
      />
    </div>
  )
}
