"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { InvoiceStatus } from "@/lib/types"

// ── Auth helpers ──

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserOrRedirect() {
  const user = await getUser()
  if (!user) redirect("/login")
  return user
}

export async function getOrganization() {
  const user = await getUserOrRedirect()
  const supabase = await createClient()
  const { data: member } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .single()
  if (!member) return null
  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", member.organization_id)
    .single()
  return org
}

export async function getOrganizationOrSetup() {
  const org = await getOrganization()
  if (!org) redirect("/settings?setup=true")
  return org
}

// ── Organization ──

export async function createOrganization(formData: FormData) {
  const user = await getUserOrRedirect()
  const supabase = await createClient()
  const name = formData.get("name") as string || "My Business"
  const { data: org, error } = await supabase
    .from("organizations")
    .insert({ name })
    .select()
    .single()
  if (error || !org) throw new Error(error?.message || "Failed to create org")
  await supabase.from("organization_members").insert({
    organization_id: org.id,
    user_id: user.id,
    role: "owner",
  })
  return org
}

export async function updateOrganization(formData: FormData) {
  const org = await getOrganizationOrSetup()
  const supabase = await createClient()
  const updates: Record<string, string | null> = {}
  for (const key of ["name", "phone", "email", "address", "invoice_prefix", "bank_name", "bank_account", "bank_holder"]) {
    const val = formData.get(key) as string | null
    if (val !== null) updates[key] = val || null
  }
  const startNum = formData.get("invoice_start_number")
  if (startNum) updates.invoice_start_number = startNum as string
  await supabase.from("organizations").update(updates).eq("id", org.id)
}

// ── Dashboard ──

export async function getDashboardData() {
  const org = await getOrganizationOrSetup()
  const supabase = await createClient()

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, status, total, due_date, created_at")
    .eq("organization_id", org.id)

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const allInvoices = invoices || []
  const outstanding = allInvoices
    .filter(i => ["sent", "pending"].includes(i.status))
    .reduce((s, i) => s + i.total, 0)
  const overdue = allInvoices
    .filter(i => i.status === "overdue" || (["sent", "pending"].includes(i.status) && new Date(i.due_date) < now))
    .reduce((s, i) => s + i.total, 0)

  const { data: payments } = await supabase
    .from("payments")
    .select("amount")
    .eq("organization_id", org.id)
    .gte("created_at", monthStart)
  const paidThisMonth = (payments || []).reduce((s, p) => s + p.amount, 0)

  const { data: recent } = await supabase
    .from("invoices")
    .select("*, customer:customers(name)")
    .eq("organization_id", org.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return {
    summary: {
      outstanding,
      paid_this_month: paidThisMonth,
      overdue,
      total_invoices: allInvoices.length,
    },
    recentInvoices: (recent || []) as Array<{
      id: string
      invoice_number: string
      status: InvoiceStatus
      total: number
      due_date: string
      customer: { name: string }
    }>,
  }
}

// ── Invoices ──

export async function getInvoices(status?: InvoiceStatus) {
  const org = await getOrganizationOrSetup()
  const supabase = await createClient()
  let query = supabase
    .from("invoices")
    .select("*, customer:customers(name)")
    .eq("organization_id", org.id)
    .order("created_at", { ascending: false })
  if (status) query = query.eq("status", status)
  const { data } = await query
  return (data || []) as Array<{
    id: string
    invoice_number: string
    status: InvoiceStatus
    total: number
    due_date: string
    customer: { name: string }
  }>
}

export async function getInvoiceById(id: string) {
  const org = await getOrganizationOrSetup()
  const supabase = await createClient()
  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, customer:customers(name, whatsapp, email, address)")
    .eq("id", id)
    .eq("organization_id", org.id)
    .single()
  if (!invoice) return null
  const { data: items } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", id)
    .order("sort_order", { ascending: true })
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("invoice_id", id)
    .order("payment_date", { ascending: false })
  return {
    invoice: invoice as {
      id: string
      organization_id: string
      customer_id: string
      invoice_number: string
      status: InvoiceStatus
      issue_date: string
      due_date: string
      subtotal: number
      discount: number
      tax_rate: number
      tax_amount: number
      total: number
      notes: string | null
      customer: { name: string; whatsapp: string | null; email: string | null; address: string | null }
    },
    items: (items || []) as Array<{
      id: string
      invoice_id: string
      description: string
      quantity: number
      unit_price: number
      discount: number
      amount: number
      sort_order: number
    }>,
    payments: (payments || []) as Array<{
      id: string
      amount: number
      payment_date: string
      payment_method: string
      notes: string | null
    }>,
    org,
  }
}

export async function createInvoice(formData: FormData) {
  const org = await getOrganizationOrSetup()
  const supabase = await createClient()

  const customerName = formData.get("customer_name") as string
  const customerWhatsapp = formData.get("customer_whatsapp") as string || null

  let customerId = formData.get("customer_id") as string | null
  if (!customerId) {
    const { data: newCust } = await supabase
      .from("customers")
      .insert({ organization_id: org.id, name: customerName, whatsapp: customerWhatsapp })
      .select("id")
      .single()
    if (!newCust) throw new Error("Failed to create customer")
    customerId = newCust.id
  }

  // Generate invoice number
  const { data: lastInv } = await supabase
    .from("invoices")
    .select("invoice_number")
    .eq("organization_id", org.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  let nextNum = org.invoice_start_number || 1
  if (lastInv?.invoice_number) {
    const match = lastInv.invoice_number.match(/(\d+)$/)
    if (match) nextNum = parseInt(match[1]) + 1
  }
  const invoiceNumber = `${org.invoice_prefix || "INV-"}${new Date().getFullYear()}-${String(nextNum).padStart(4, "0")}`

  const itemsJson = JSON.parse(formData.get("items") as string) as Array<{
    description: string; quantity: number; unit_price: number; discount: number
  }>

  const subtotal = itemsJson.reduce((s, i) => s + i.quantity * i.unit_price - i.discount, 0)
  const taxRate = parseFloat(formData.get("tax_rate") as string) || 0
  const taxAmount = Math.round(subtotal * (taxRate / 100))
  const total = subtotal + taxAmount

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      organization_id: org.id,
      customer_id: customerId,
      invoice_number: invoiceNumber,
      status: "draft" as InvoiceStatus,
      issue_date: formData.get("issue_date") as string,
      due_date: formData.get("due_date") as string,
      subtotal,
      discount: 0,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total,
      notes: (formData.get("notes") as string) || null,
    })
    .select("id")
    .single()

  if (error || !invoice) throw new Error(error?.message || "Failed to create invoice")

  const itemsToInsert = itemsJson.map((item, idx) => ({
    invoice_id: invoice.id,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    discount: item.discount,
    amount: item.quantity * item.unit_price - item.discount,
    sort_order: idx,
  }))
  await supabase.from("invoice_items").insert(itemsToInsert)

  redirect(`/invoices/${invoice.id}`)
}

export async function updateInvoiceStatus(invoiceId: string, status: InvoiceStatus) {
  const supabase = await createClient()
  await supabase.from("invoices").update({ status }).eq("id", invoiceId)
}

// ── Customers ──

export async function getCustomers() {
  const org = await getOrganizationOrSetup()
  const supabase = await createClient()
  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .eq("organization_id", org.id)
    .order("name")

  if (!customers) return []

  const { data: invoices } = await supabase
    .from("invoices")
    .select("customer_id, status, total")
    .eq("organization_id", org.id)

  return customers.map(c => {
    const custInvoices = (invoices || []).filter(i => i.customer_id === c.id)
    return {
      ...c,
      total_invoices: custInvoices.length,
      outstanding: custInvoices
        .filter(i => ["sent", "pending", "overdue"].includes(i.status))
        .reduce((s, i) => s + i.total, 0),
    }
  })
}

export async function createCustomer(formData: FormData) {
  const org = await getOrganizationOrSetup()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("customers")
    .insert({
      organization_id: org.id,
      name: formData.get("name") as string,
      whatsapp: (formData.get("whatsapp") as string) || null,
      email: (formData.get("email") as string) || null,
      address: (formData.get("address") as string) || null,
    })
    .select("id")
    .single()
  if (error) throw new Error(error.message)
  return data
}

// ── Payments ──

export async function getPayments() {
  const org = await getOrganizationOrSetup()
  const supabase = await createClient()
  const { data } = await supabase
    .from("payments")
    .select("*, invoice:invoices(invoice_number, customer:customers(name))")
    .eq("organization_id", org.id)
    .order("payment_date", { ascending: false })
  return data || []
}

export async function recordPayment(formData: FormData) {
  const org = await getOrganizationOrSetup()
  const supabase = await createClient()
  const invoiceId = formData.get("invoice_id") as string
  const amount = parseInt(formData.get("amount") as string)
  const method = formData.get("payment_method") as string || "bank_transfer"

  await supabase.from("payments").insert({
    organization_id: org.id,
    invoice_id: invoiceId,
    amount,
    payment_date: (formData.get("payment_date") as string) || new Date().toISOString().split("T")[0],
    payment_method: method,
    notes: (formData.get("notes") as string) || null,
  })

  // Check if fully paid
  const { data: invoice } = await supabase
    .from("invoices")
    .select("total")
    .eq("id", invoiceId)
    .single()
  const { data: allPayments } = await supabase
    .from("payments")
    .select("amount")
    .eq("invoice_id", invoiceId)
  const totalPaid = (allPayments || []).reduce((s, p) => s + p.amount, 0)
  if (invoice && totalPaid >= invoice.total) {
    await supabase.from("invoices").update({ status: "paid" as InvoiceStatus }).eq("id", invoiceId)
  }
}

// ── Public invoice (no auth) ──
// NOTE: Current RLS requires auth.uid() for all tables, so this will fail
// for unauthenticated visitors. A separate RLS policy allowing SELECT on
// invoices by invoice_number for the anon role would be needed for public viewing.

export async function getPublicInvoice(invoiceNumber: string) {
  const supabase = await createClient()
  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, customer:customers(name), organization:organizations(name, email, address, bank_name, bank_account, bank_holder)")
    .eq("invoice_number", invoiceNumber)
    .single()
  if (!invoice) return null
  const { data: items } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", invoice.id)
    .order("sort_order")
  return { invoice, items: items || [] }
}

// ── Logout ──

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
