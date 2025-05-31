
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white hover:from-fitness-primary-600 hover:to-fitness-primary-700 hover:shadow-lg hover:shadow-fitness-primary-500/25 active:scale-[0.98] transform",
        destructive: "bg-gradient-to-r from-error-500 to-error-600 text-white hover:from-error-600 hover:to-error-700 hover:shadow-lg hover:shadow-error-500/25 active:scale-[0.98] transform",
        outline: "border border-fitness-primary-200 bg-white hover:bg-fitness-primary-50 hover:border-fitness-primary-300 text-fitness-primary-700 hover:text-fitness-primary-800 active:scale-[0.98] transform",
        secondary: "bg-fitness-neutral-100 text-fitness-neutral-800 hover:bg-fitness-neutral-200 border border-fitness-neutral-200 hover:border-fitness-neutral-300 active:scale-[0.98] transform",
        ghost: "hover:bg-fitness-primary-50 text-fitness-neutral-600 hover:text-fitness-primary-700 active:scale-[0.98] transform",
        link: "text-fitness-primary-600 underline-offset-4 hover:underline hover:text-fitness-primary-700",
        success: "bg-gradient-to-r from-success-500 to-success-600 text-white hover:from-success-600 hover:to-success-700 hover:shadow-lg hover:shadow-success-500/25 active:scale-[0.98] transform",
        warning: "bg-gradient-to-r from-warning-500 to-warning-600 text-white hover:from-warning-600 hover:to-warning-700 hover:shadow-lg hover:shadow-warning-500/25 active:scale-[0.98] transform",
        info: "bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white hover:from-fitness-primary-600 hover:to-fitness-primary-700 hover:shadow-lg hover:shadow-fitness-primary-500/25 active:scale-[0.98] transform",
        orange: "bg-gradient-to-r from-fitness-orange-500 to-fitness-orange-600 text-white hover:from-fitness-orange-600 hover:to-fitness-orange-700 hover:shadow-lg hover:shadow-fitness-orange-500/25 active:scale-[0.98] transform",
        accent: "bg-gradient-to-r from-fitness-accent-500 to-fitness-accent-600 text-white hover:from-fitness-accent-600 hover:to-fitness-accent-700 hover:shadow-lg hover:shadow-fitness-accent-500/25 active:scale-[0.98] transform"
      },
      size: {
        sm: "h-6 rounded-md px-2 text-xs font-medium",
        default: "h-7 px-3 py-1 text-sm",
        lg: "h-8 rounded-lg px-3 text-sm font-semibold",
        xl: "h-9 rounded-xl px-4 text-base font-bold",
        icon: "h-7 w-7 rounded-md",
        "icon-sm": "h-6 w-6 rounded-md",
        "icon-lg": "h-8 w-8 rounded-lg",
        xs: "h-5 rounded-sm px-1.5 text-xs"
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
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
