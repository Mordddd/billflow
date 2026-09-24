"use client"

import { Button } from "@/components/ui/button"
import { Link, Check } from "lucide-react"
import { useState } from "react"

export function CopyLinkButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        navigator.clipboard.writeText(window.location.origin + path)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Link className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy link"}
    </Button>
  )
}
