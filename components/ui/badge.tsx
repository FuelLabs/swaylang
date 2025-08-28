import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BaseBadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string
}

interface DivBadgeProps extends BaseBadgeProps, React.HTMLAttributes<HTMLDivElement> {}

interface LinkBadgeProps extends BaseBadgeProps, React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

type BadgeProps = DivBadgeProps | LinkBadgeProps

function Badge({ className, variant, ...props }: BadgeProps) {
  if ('href' in props) {
    const { href, target, rel, ...anchorProps } = props
    return (
      <a 
        href={href}
        target={target}
        rel={rel}
        className={cn(badgeVariants({ variant }), className, "cursor-pointer hover:opacity-80 transition-all duration-200 hover:scale-105 hover:shadow-md hover:underline decoration-2 underline-offset-2")}
        {...anchorProps}
      />
    )
  }
  
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
