import { FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyState({
  icon: Icon = FileText,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && (
        <Button asChild={!!actionHref} onClick={onAction}>
          {actionHref ? (
            <a href={actionHref}>
              <Plus className="h-4 w-4" />
              {actionLabel}
            </a>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              {actionLabel}
            </>
          )}
        </Button>
      )}
    </div>
  )
}
