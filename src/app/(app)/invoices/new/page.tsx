"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRupiah, formatDate } from "@/lib/utils"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface LineItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  discount: number
}

function newItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    description: "",
    quantity: 1,
    unit_price: 0,
    discount: 0,
  }
}

export default function CreateInvoicePage() {
  const [customerName, setCustomerName] = useState("")
  const [customerWhatsapp, setCustomerWhatsapp] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-0099")
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<LineItem[]>([newItem()])
  const [taxEnabled, setTaxEnabled] = useState(false)
  const [taxRate, setTaxRate] = useState(11) // PPN 11%

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + item.quantity * item.unit_price - item.discount,
        0
      ),
    [items]
  )

  const taxAmount = taxEnabled ? Math.round(subtotal * (taxRate / 100)) : 0
  const total = subtotal + taxAmount

  function updateItem(id: string, field: keyof LineItem, value: string | number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  function removeItem(id: string) {
    if (items.length === 1) return
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function handleSave() {
    // ponytail: validate + save to Supabase when connected
    if (!customerName.trim()) {
      toast.error("Please enter a customer name.")
      return
    }
    if (!dueDate) {
      toast.error("Please select a due date.")
      return
    }
    if (items.some((i) => !i.description.trim() || i.unit_price <= 0)) {
      toast.error("Please fill in all item descriptions and prices.")
      return
    }
    toast.success("Invoice saved successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/invoices">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create Invoice
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Fill in the details below
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form — 3 cols */}
        <div className="lg:col-span-3 space-y-6">
          {/* Customer */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Name</Label>
                  <Input
                    id="customer-name"
                    placeholder="Customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-wa">WhatsApp</Label>
                  <Input
                    id="customer-wa"
                    placeholder="08123456789"
                    value={customerWhatsapp}
                    onChange={(e) => setCustomerWhatsapp(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice details */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Invoice details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inv-number">Invoice number</Label>
                  <Input
                    id="inv-number"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue-date">Issue date</Label>
                  <Input
                    id="issue-date"
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due date</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-3 items-end"
                >
                  <div className="col-span-12 sm:col-span-5 space-y-2">
                    {idx === 0 && (
                      <Label className="text-xs text-muted-foreground">
                        Description
                      </Label>
                    )}
                    <Input
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2 space-y-2">
                    {idx === 0 && (
                      <Label className="text-xs text-muted-foreground">
                        Qty
                      </Label>
                    )}
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "quantity",
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3 space-y-2">
                    {idx === 0 && (
                      <Label className="text-xs text-muted-foreground">
                        Unit price
                      </Label>
                    )}
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={item.unit_price || ""}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "unit_price",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-2 flex items-end justify-end">
                    <p className="text-sm font-medium tabular-nums h-10 flex items-center">
                      {formatRupiah(
                        item.quantity * item.unit_price - item.discount
                      )}
                    </p>
                  </div>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="col-span-12 sm:col-span-12 flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors mb-2 lg:mb-0"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setItems((prev) => [...prev, newItem()])}
              >
                <Plus className="h-3.5 w-3.5" />
                Add item
              </Button>

              {/* Tax toggle */}
              <div className="flex items-center gap-3 pt-2 border-t">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={taxEnabled}
                    onChange={(e) => setTaxEnabled(e.target.checked)}
                    className="rounded"
                  />
                  Include tax (PPN)
                </label>
                {taxEnabled && (
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      className="w-20"
                      value={taxRate}
                      onChange={(e) =>
                        setTaxRate(parseFloat(e.target.value) || 0)
                      }
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px] resize-y transition-colors"
                placeholder="Additional notes for the customer..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Preview — 2 cols, sticky on desktop */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-8 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Invoice Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mini preview */}
                <div className="rounded-lg border bg-white p-5 space-y-4 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">Your Business</p>
                      <p className="text-muted-foreground">your@email.com</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold text-sm">
                        {invoiceNumber}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-3 space-y-1">
                    <p className="text-muted-foreground">Bill to</p>
                    <p className="font-medium">
                      {customerName || "Customer name"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                    <div>
                      <p>Issue date</p>
                      <p className="text-foreground">
                        {issueDate ? formatDate(issueDate) : "—"}
                      </p>
                    </div>
                    <div>
                      <p>Due date</p>
                      <p className="text-foreground">
                        {dueDate ? formatDate(dueDate) : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between"
                      >
                        <span className="truncate max-w-[60%]">
                          {item.description || "Item"}
                        </span>
                        <span className="tabular-nums font-medium">
                          {formatRupiah(
                            item.quantity * item.unit_price - item.discount
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 space-y-1">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="tabular-nums">
                        {formatRupiah(subtotal)}
                      </span>
                    </div>
                    {taxEnabled && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Tax ({taxRate}%)</span>
                        <span className="tabular-nums">
                          {formatRupiah(taxAmount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-sm pt-1 border-t">
                      <span>Total</span>
                      <span className="tabular-nums">
                        {formatRupiah(total)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button onClick={handleSave} size="lg" className="w-full">
                Save Invoice
              </Button>
              <Button variant="outline" size="lg" className="w-full" asChild>
                <Link href="/invoices">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
