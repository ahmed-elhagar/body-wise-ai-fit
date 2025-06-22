
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-1brand-neutral-600 w-full rounded-lg border border-health-border bg-white px-3 py-2 text-sm ring-offset-background file:border-brand-neutral-600 file:bg-transparent file:text-sm file:font-medium placeholder:text-health-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-health-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-5brand-neutral-600",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
