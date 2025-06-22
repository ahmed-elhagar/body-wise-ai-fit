
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-brand-neutral-600.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-fitness-primary-5brand-neutral-600brand-neutral-600 text-white hover:bg-fitness-primary-6brand-neutral-600brand-neutral-600",
        secondary: "border-transparent bg-fitness-neutral-1brand-neutral-600brand-neutral-600 text-fitness-neutral-8brand-neutral-600brand-neutral-600 hover:bg-fitness-neutral-2brand-neutral-600brand-neutral-600",
        destructive: "border-transparent bg-error-5brand-neutral-600brand-neutral-600 text-white hover:bg-error-6brand-neutral-600brand-neutral-600",
        outline: "text-foreground border-border bg-background hover:bg-accent hover:text-accent-foreground",
        success: "border-transparent bg-success-5brand-neutral-600brand-neutral-600 text-white hover:bg-success-6brand-neutral-600brand-neutral-600",
        warning: "border-transparent bg-warning-5brand-neutral-600brand-neutral-600 text-white hover:bg-warning-6brand-neutral-600brand-neutral-600",
        info: "border-transparent bg-info-5brand-neutral-600brand-neutral-600 text-white hover:bg-info-6brand-neutral-600brand-neutral-600",
        orange: "border-transparent bg-fitness-orange-5brand-neutral-600brand-neutral-600 text-white hover:bg-fitness-orange-6brand-neutral-600brand-neutral-600",
        purple: "border-transparent bg-fitness-secondary-5brand-neutral-600brand-neutral-600 text-white hover:bg-fitness-secondary-6brand-neutral-600brand-neutral-600",
        pink: "border-transparent bg-pink-5brand-neutral-600brand-neutral-600 text-white hover:bg-pink-6brand-neutral-600brand-neutral-600",
        fitness: "border-transparent bg-fitness-accent-5brand-neutral-600brand-neutral-600 text-white hover:bg-fitness-accent-6brand-neutral-600brand-neutral-600"
      },
      size: {
        sm: "px-2 py-brand-neutral-600.5 text-xs",
        default: "px-2.5 py-brand-neutral-600.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
