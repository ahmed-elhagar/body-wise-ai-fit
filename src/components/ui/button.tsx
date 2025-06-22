import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 text-white hover:from-brand-primary-600 hover:to-brand-primary-700 hover:shadow-lg hover:shadow-brand-primary-500/25 active:scale-[0.98] transform",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.98] transform",
        outline: "border border-brand-primary-200 bg-white hover:bg-brand-primary-50 hover:border-brand-primary-300 text-brand-primary-700 hover:text-brand-primary-800 active:scale-[0.98] transform",
        secondary: "bg-brand-neutral-100 text-brand-neutral-800 hover:bg-brand-neutral-200 border border-brand-neutral-200 hover:border-brand-neutral-300 active:scale-[0.98] transform",
        ghost: "hover:bg-brand-primary-50 text-brand-neutral-600 hover:text-brand-primary-700 active:scale-[0.98] transform bg-transparent",
        link: "text-brand-primary-600 underline-offset-4 hover:underline hover:text-brand-primary-700 bg-transparent",
        success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.98] transform",
        warning: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 hover:shadow-lg hover:shadow-yellow-500/25 active:scale-[0.98] transform",
        info: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transform",
        orange: "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/25 active:scale-[0.98] transform",
        accent: "bg-gradient-to-r from-brand-secondary-500 to-brand-secondary-600 text-white hover:from-brand-secondary-600 hover:to-brand-secondary-700 hover:shadow-lg hover:shadow-brand-secondary-500/25 active:scale-[0.98] transform"
      },
      size: {
        sm: "h-7 rounded-md px-2.5 text-xs font-medium",
        default: "h-8 px-3 py-1.5 text-sm",
        lg: "h-9 rounded-lg px-4 text-sm font-semibold",
        xl: "h-10 rounded-xl px-5 text-base font-bold",
        icon: "h-8 w-8 rounded-md",
        "icon-sm": "h-7 w-7 rounded-md",
        "icon-lg": "h-9 w-9 rounded-lg",
        xs: "h-6 rounded-sm px-2 text-xs"
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
            className="animate-spin -ml-1 mr-2 h-3 w-3"
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
