
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-fitness-primary-500 text-white hover:bg-fitness-primary-600",
        secondary: "border-transparent bg-fitness-neutral-100 text-fitness-neutral-800 hover:bg-fitness-neutral-200",
        destructive: "border-transparent bg-error-500 text-white hover:bg-error-600",
        outline: "text-foreground border-border bg-background hover:bg-accent hover:text-accent-foreground",
        success: "border-transparent bg-success-500 text-white hover:bg-success-600",
        warning: "border-transparent bg-warning-500 text-white hover:bg-warning-600",
        info: "border-transparent bg-info-500 text-white hover:bg-info-600",
        orange: "border-transparent bg-fitness-orange-500 text-white hover:bg-fitness-orange-600",
        purple: "border-transparent bg-fitness-secondary-500 text-white hover:bg-fitness-secondary-600",
        pink: "border-transparent bg-pink-500 text-white hover:bg-pink-600",
        fitness: "border-transparent bg-fitness-accent-500 text-white hover:bg-fitness-accent-600"
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
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
