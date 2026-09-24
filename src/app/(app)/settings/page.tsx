import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your business profile and preferences
        </p>
      </div>

      {/* Business profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Business profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="biz-name">Business name</Label>
            <Input id="biz-name" placeholder="Your business name" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="biz-phone">Phone</Label>
              <Input id="biz-phone" placeholder="08123456789" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="biz-email">Email</Label>
              <Input id="biz-email" type="email" placeholder="you@business.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="biz-address">Address</Label>
            <Input id="biz-address" placeholder="Business address" />
          </div>
        </CardContent>
      </Card>

      {/* Invoice settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inv-prefix">Invoice prefix</Label>
              <Input id="inv-prefix" placeholder="INV-" defaultValue="INV-" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-start">Start number</Label>
              <Input
                id="inv-start"
                type="number"
                placeholder="1"
                defaultValue={1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank name</Label>
              <Input id="bank-name" placeholder="BCA" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank-account">Account number</Label>
              <Input id="bank-account" placeholder="123456789" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bank-holder">Account holder</Label>
            <Input id="bank-holder" placeholder="Account holder name" />
          </div>
        </CardContent>
      </Card>

      <Button>Save changes</Button>
    </div>
  )
}
