import { EmptyState } from "@/components/empty-state"
import { BarChart3 } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Revenue and invoice analytics
        </p>
      </div>

      {/* ponytail: add Recharts when data is available */}
      <EmptyState
        icon={BarChart3}
        title="No data yet"
        description="Reports will populate as you create invoices and record payments."
      />
    </div>
  )
}
