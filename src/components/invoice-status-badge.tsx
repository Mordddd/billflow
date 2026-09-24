import { cn } from "@/lib/utils"
import type { InvoiceStatus } from "@/lib/types"

const statusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-zinc-100 text-zinc-600",
  },
  sent: {
    label: "Sent",
    className: "bg-blue-50 text-blue-700",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700",
  },
  paid: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-700",
  },
  overdue: {
    label: "Overdue",
    className: "bg-red-50 text-red-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-zinc-100 text-zinc-500",
  },
}

export function InvoiceStatusBadge({
  status,
  className,
}: {
  status: InvoiceStatus
  className?: string
}) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", {
          "bg-zinc-400": status === "draft",
          "bg-blue-500": status === "sent",
          "bg-amber-500": status === "pending",
          "bg-emerald-500": status === "paid",
          "bg-red-500": status === "overdue",
          "bg-zinc-400/60": status === "cancelled",
        })}
      />
      {config.label}
    </span>
  )
}
