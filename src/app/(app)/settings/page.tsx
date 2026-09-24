import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { getOrganization, createOrganization, updateOrganization, signOut } from "@/lib/actions"

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string }>
}) {
  const { setup } = await searchParams
  const isSetup = setup === "true"
  const org = await getOrganization()

  async function handleSubmit(formData: FormData) {
    "use server"
    if (!org) {
      // Create org first, then update with full details
      await createOrganization(formData)
    }
    // updateOrganization re-fetches the org, so the newly created one will be found
    await updateOrganization(formData)
    if (isSetup) {
      const { redirect } = await import("next/navigation")
      redirect("/dashboard")
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {isSetup ? "Set up your business" : "Settings"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isSetup
            ? "Enter your business details to get started"
            : "Manage your business profile and preferences"}
        </p>
      </div>

      <form action={handleSubmit}>
        {/* Business profile */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Business profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="biz-name">Business name</Label>
              <Input
                id="biz-name"
                name="name"
                placeholder="Your business name"
                defaultValue={org?.name || ""}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="biz-phone">Phone</Label>
                <Input
                  id="biz-phone"
                  name="phone"
                  placeholder="08123456789"
                  defaultValue={org?.phone || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="biz-email">Email</Label>
                <Input
                  id="biz-email"
                  name="email"
                  type="email"
                  placeholder="you@business.com"
                  defaultValue={org?.email || ""}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="biz-address">Address</Label>
              <Input
                id="biz-address"
                name="address"
                placeholder="Business address"
                defaultValue={org?.address || ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Invoice settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inv-prefix">Invoice prefix</Label>
                <Input
                  id="inv-prefix"
                  name="invoice_prefix"
                  placeholder="INV-"
                  defaultValue={org?.invoice_prefix || "INV-"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-start">Start number</Label>
                <Input
                  id="inv-start"
                  name="invoice_start_number"
                  type="number"
                  placeholder="1"
                  defaultValue={org?.invoice_start_number || 1}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Payment information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank-name">Bank name</Label>
                <Input
                  id="bank-name"
                  name="bank_name"
                  placeholder="BCA"
                  defaultValue={org?.bank_name || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-account">Account number</Label>
                <Input
                  id="bank-account"
                  name="bank_account"
                  placeholder="123456789"
                  defaultValue={org?.bank_account || ""}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank-holder">Account holder</Label>
              <Input
                id="bank-holder"
                name="bank_holder"
                placeholder="Account holder name"
                defaultValue={org?.bank_holder || ""}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit">
          {isSetup ? "Get started" : "Save changes"}
        </Button>
      </form>

      {!isSetup && (
        <form action={signOut}>
          <Button type="submit" variant="ghost" className="text-muted-foreground">
            Sign out
          </Button>
        </form>
      )}
    </div>
  )
}
