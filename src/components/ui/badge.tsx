
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transform hover:scale-105",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600",
        secondary:
          "border-transparent bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 shadow-md hover:shadow-lg hover:from-gray-200 hover:to-gray-300",
        destructive:
          "border-transparent bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:from-red-600 hover:to-pink-600",
        outline: 
          "border-2 border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow-md",
        success:
          "border-transparent bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-green-600",
        warning:
          "border-transparent bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:from-yellow-600 hover:to-orange-600",
        info:
          "border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-blue-600",
        purple:
          "border-transparent bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-violet-600",
        pink:
          "border-transparent bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-rose-600"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
