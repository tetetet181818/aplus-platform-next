"use client";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-xs font-medium transition-all duration-200 ease-in-out whitespace-nowrap shrink-0 gap-1.5 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white hover:bg-destructive/90",
        outline:
          "border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        success:
          "border-transparent bg-emerald-500 text-white hover:bg-emerald-600",
        completed:
          "border-transparent bg-purple-800 text-white hover:bg-purple-600",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-1",
        lg: "text-base px-3 py-1.5",
      },
      rounded: {
        full: "rounded-full",
        md: "rounded-md",
        lg: "rounded-lg",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow",
        lg: "shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      rounded: "md",
      shadow: "none",
    },
  }
);

const Badge = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      rounded,
      shadow,
      asChild = false,
      animate = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : motion.span;

    return (
      <Comp
        ref={ref}
        className={cn(
          badgeVariants({ variant, size, rounded, shadow }),
          className,
          animate && "hover:scale-[1.03] active:scale-[0.98]"
        )}
        whileHover={animate ? { scale: 1.05 } : undefined}
        whileTap={animate ? { scale: 0.98 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
