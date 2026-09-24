import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Send,
  Bell,
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  Smartphone,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl flex items-center justify-between h-16 px-4 sm:px-6">
          <span className="text-lg font-semibold tracking-tight">BillFlow</span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Start for free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero — left-aligned per taste skill anti-center bias */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter leading-[1.08]">
            Get paid without the awkward follow-up.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-[50ch]">
            Create professional invoices, send them through WhatsApp, and keep
            track of who has paid.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/signup">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 lg:py-24">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight max-w-lg">
            Still tracking unpaid invoices in WhatsApp?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg leading-relaxed">
            Spreadsheets, screenshots, and manual reminders waste hours every
            week. BillFlow replaces all of that with one simple dashboard.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 lg:py-24">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FileText,
                title: "Create",
                desc: "Build a professional invoice in under a minute.",
              },
              {
                icon: Send,
                title: "Send",
                desc: "Share it instantly through WhatsApp with one tap.",
              },
              {
                icon: Bell,
                title: "Track",
                desc: "See who has paid and who needs a reminder.",
              },
              {
                icon: CheckCircle2,
                title: "Get paid",
                desc: "Mark payments and keep your records clean.",
              },
            ].map((step, i) => (
              <div key={step.title} className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
                  {i + 1}
                </div>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 lg:py-24">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-12">
            Everything you need, nothing you don&apos;t
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Professional invoices",
                desc: "Clean, branded invoices your customers will take seriously.",
              },
              {
                icon: Send,
                title: "WhatsApp sharing",
                desc: "Send invoices directly through WhatsApp with a prefilled message.",
              },
              {
                icon: Bell,
                title: "Payment reminders",
                desc: "Schedule reminders before and after the due date.",
              },
              {
                icon: Zap,
                title: "PDF export",
                desc: "Download any invoice as a clean, printable PDF.",
              },
              {
                icon: Shield,
                title: "Payment tracking",
                desc: "Record payments and see your outstanding balance at a glance.",
              },
              {
                icon: Smartphone,
                title: "Mobile-friendly",
                desc: "Create and manage invoices from your phone, anywhere.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border bg-card space-y-2"
              >
                <feature.icon className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-base font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 lg:py-24">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
            Simple pricing
          </h2>
          <p className="text-muted-foreground mb-12 max-w-md">
            Start free. Upgrade when you need more.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            {/* Free */}
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <div>
                <h3 className="text-base font-semibold">Free</h3>
                <p className="text-3xl font-semibold mt-2">
                  Rp 0<span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>5 invoices/month</li>
                <li>Basic invoice template</li>
                <li>Customer management</li>
                <li>PDF export</li>
                <li>WhatsApp sharing</li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/signup">Get started</Link>
              </Button>
            </div>

            {/* Pro */}
            <div className="rounded-xl border-2 border-primary bg-card p-6 space-y-4 relative">
              <span className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                Popular
              </span>
              <div>
                <h3 className="text-base font-semibold">Pro</h3>
                <p className="text-3xl font-semibold mt-2">
                  Rp 49.000<span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Unlimited invoices</li>
                <li>Unlimited customers</li>
                <li>Custom branding</li>
                <li>Reminder scheduling</li>
                <li>Advanced reports</li>
                <li>Payment tracking</li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/signup">Start free trial</Link>
              </Button>
            </div>

            {/* Business */}
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <div>
                <h3 className="text-base font-semibold">Business</h3>
                <p className="text-3xl font-semibold mt-2">
                  Rp 99.000<span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Everything in Pro</li>
                <li>Multiple team members</li>
                <li>Multiple businesses</li>
                <li>Priority support</li>
                <li>Advanced reports</li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/signup">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 lg:py-24 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Ready to get paid faster?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Join thousands of Indonesian businesses using BillFlow to manage
            their invoices.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/signup">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BillFlow. All rights reserved.
          </span>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
