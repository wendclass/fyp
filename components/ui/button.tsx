"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "white";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-display font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-brand/40 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

    const variants = {
      primary:
        "bg-fuchsia-brand hover:bg-fuchsia-hover text-white shadow-pink-md hover:shadow-pink-lg active:bg-fuchsia-dark",
      secondary:
        "bg-blush-200 hover:bg-blush-300 text-charcoal shadow-pink-sm",
      white:
        "bg-white hover:bg-blush-50 text-charcoal border border-blush-200 shadow-sm hover:shadow-pink-sm",
      outline:
        "border-2 border-fuchsia-brand text-fuchsia-brand hover:bg-fuchsia-brand/10",
      ghost:
        "text-charcoal hover:bg-blush-200/50 hover:text-fuchsia-brand",
    };

    const sizes = {
      sm: "text-sm px-4 py-2 rounded-2xl gap-1.5",
      md: "text-base px-6 py-3 rounded-2xl gap-2",
      lg: "text-lg px-8 py-4 rounded-3xl gap-2.5",
      xl: "text-xl px-9 py-5 rounded-3xl gap-3 font-bold",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
            Chargement...
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
