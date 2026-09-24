import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { formatRupiah } from "@/lib/utils"
import type { Customer } from "@/lib/types"
import { Users, Plus, Search, Phone, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"

// ponytail: demo data — replace with Supabase query
const customers: (Customer & {
  total_invoices: number
  outstanding: number
})[] = [
  {
    id: "c1",
    organization_id: "org1",
    name: "PT Example",
    whatsapp: "081234567890",
    email: "contact@example.co.id",
    address: "Jakarta",
    created_at: "2026-08-01",
    updated_at: "2026-09-20",
    total_invoices: 12,
    outstanding: 2500000,
  },
  {
    id: "c2",
    organization_id: "org1",
    name: "Budi Santoso",
    whatsapp: "081298765432",
    email: "budi@gmail.com",
    address: null,
    created_at: "2026-07-15",
    updated_at: "2026-09-25",
    total_invoices: 5,
    outstanding: 0,
  },
  {
    id: "c3",
    organization_id: "org1",
    name: "CV Maju Bersama",
    whatsapp: "081355544433",
    email: "admin@majubersama.co.id",
    address: "Bandung",
    created_at: "2026-06-10",
    updated_at: "2026-09-10",
    total_invoices: 8,
    outstanding: 3500000,
  },
]

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your customer contacts
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search customers..." className="pl-9" />
      </div>

      {/* Customer list */}
      {customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Add your first customer to start creating invoices."
          actionLabel="Add Customer"
        />
      ) : (
        <div className="space-y-2">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="flex items-center justify-between p-4 rounded-xl border bg-card"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted shrink-0">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {customer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {customer.name}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    {customer.whatsapp && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {customer.whatsapp}
                      </span>
                    )}
                    {customer.email && (
                      <span className="hidden sm:flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-xs text-muted-foreground">
                  {customer.total_invoices} invoices
                </p>
                {customer.outstanding > 0 && (
                  <p className="text-sm font-semibold tabular-nums text-amber-600">
                    {formatRupiah(customer.outstanding)} outstanding
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
