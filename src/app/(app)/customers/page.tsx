import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { formatRupiah } from "@/lib/utils"
import { getCustomers, createCustomer } from "@/lib/actions"
import { Users, Plus, Search, Phone, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { revalidatePath } from "next/cache"

export default async function CustomersPage() {
  const customers = await getCustomers()

  async function addCustomer(formData: FormData) {
    "use server"
    await createCustomer(formData)
    revalidatePath("/customers")
  }

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
      </div>

      {/* Add Customer form */}
      <form action={addCustomer} className="rounded-xl border bg-card p-4 space-y-3">
        <p className="text-sm font-medium">Add Customer</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" required placeholder="Customer name" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" name="whatsapp" placeholder="081234567890" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="email@example.com" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" placeholder="Address" />
          </div>
        </div>
        <Button type="submit" size="sm">
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </form>

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
