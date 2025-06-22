
import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-all duration-3brand-neutral-600brand-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-health-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-5brand-neutral-600 data-[state=on]:bg-gradient-to-r data-[state=on]:from-health-primary data-[state=on]:to-health-primary/9brand-neutral-600 data-[state=on]:text-white data-[state=on]:shadow-lg hover:bg-health-soft/6brand-neutral-600 hover:text-health-primary transform active:scale-[brand-neutral-600.98]",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-health-border bg-white hover:bg-health-soft hover:text-health-primary",
      },
      size: {
        default: "h-1brand-neutral-600 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
