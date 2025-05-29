
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-health-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-health-primary to-health-primary/90 text-white hover:from-health-primary/90 hover:to-health-primary hover:shadow-lg hover:shadow-health-primary/25 active:scale-[0.98] transform",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.98] transform",
        outline:
          "border-2 border-health-border bg-white hover:bg-health-soft hover:border-health-primary/60 text-health-text-primary hover:text-health-primary active:scale-[0.98] transform",
        secondary:
          "bg-health-soft text-health-text-primary hover:bg-health-soft/80 border border-health-border/50 hover:border-health-border active:scale-[0.98] transform",
        ghost: "hover:bg-health-soft/60 text-health-text-secondary hover:text-health-primary active:scale-[0.98] transform",
        link: "text-health-primary underline-offset-4 hover:underline hover:text-health-primary/80",
        success: "bg-gradient-to-r from-health-secondary to-health-secondary/90 text-white hover:from-health-secondary/90 hover:to-health-secondary hover:shadow-lg hover:shadow-health-secondary/25 active:scale-[0.98] transform",
        accent: "bg-gradient-to-r from-health-accent to-health-accent/90 text-white hover:from-health-accent/90 hover:to-health-accent hover:shadow-lg hover:shadow-health-accent/25 active:scale-[0.98] transform"
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-13 rounded-xl px-8 text-base font-semibold",
        icon: "h-11 w-11 rounded-xl",
        xs: "h-7 rounded-lg px-3 text-xs"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
