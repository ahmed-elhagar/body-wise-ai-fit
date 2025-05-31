
import * as React from "react"
import { cn } from "@/lib/utils"

interface SpacingProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Section = React.forwardRef<HTMLDivElement, SpacingProps>(
  ({ className, children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn("section-spacing", className)}
      {...props}
    >
      {children}
    </section>
  )
)
Section.displayName = "Section"

export const Container = React.forwardRef<HTMLDivElement, SpacingProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("max-w-7xl mx-auto px-3 sm:px-4 lg:px-6", className)}
      {...props}
    >
      {children}
    </div>
  )
)
Container.displayName = "Container"

export const ContentArea = React.forwardRef<HTMLDivElement, SpacingProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("content-spacing", className)}
      {...props}
    >
      {children}
    </div>
  )
)
ContentArea.displayName = "ContentArea"

export const MobileContainer = React.forwardRef<HTMLDivElement, SpacingProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mobile-spacing", className)}
      {...props}
    >
      {children}
    </div>
  )
)
MobileContainer.displayName = "MobileContainer"

export const DesktopContainer = React.forwardRef<HTMLDivElement, SpacingProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("desktop-spacing", className)}
      {...props}
    >
      {children}
    </div>
  )
)
DesktopContainer.displayName = "DesktopContainer"

export const Grid = React.forwardRef<
  HTMLDivElement,
  SpacingProps & {
    cols?: 1 | 2 | 3 | 4 | 5 | 6
    gap?: 2 | 3 | 4 | 6 | 8
  }
>(({ className, children, cols = 1, gap = 4, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid",
      {
        "grid-cols-1": cols === 1,
        "grid-cols-1 md:grid-cols-2": cols === 2,
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": cols === 3,
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-4": cols === 4,
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5": cols === 5,
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6": cols === 6,
      },
      {
        "gap-2": gap === 2,
        "gap-3": gap === 3,
        "gap-4": gap === 4,
        "gap-6": gap === 6,
        "gap-8": gap === 8,
      },
      className
    )}
    {...props}
  >
    {children}
  </div>
))
Grid.displayName = "Grid"

export const Flex = React.forwardRef<
  HTMLDivElement,
  SpacingProps & {
    direction?: "row" | "col"
    align?: "start" | "center" | "end" | "stretch"
    justify?: "start" | "center" | "end" | "between" | "around"
    gap?: 2 | 3 | 4 | 6 | 8
    wrap?: boolean
  }
>(({ 
  className, 
  children, 
  direction = "row", 
  align = "center", 
  justify = "start",
  gap = 4,
  wrap = false,
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex",
      {
        "flex-row": direction === "row",
        "flex-col": direction === "col",
      },
      {
        "items-start": align === "start",
        "items-center": align === "center",
        "items-end": align === "end",
        "items-stretch": align === "stretch",
      },
      {
        "justify-start": justify === "start",
        "justify-center": justify === "center",
        "justify-end": justify === "end",
        "justify-between": justify === "between",
        "justify-around": justify === "around",
      },
      {
        "gap-2": gap === 2,
        "gap-3": gap === 3,
        "gap-4": gap === 4,
        "gap-6": gap === 6,
        "gap-8": gap === 8,
      },
      wrap && "flex-wrap",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
Flex.displayName = "Flex"
