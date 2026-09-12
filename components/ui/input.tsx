import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-13 w-full rounded-2xl border border-blush-200 bg-white px-4 py-3 text-base text-charcoal shadow-sm transition-all placeholder:text-charcoal-muted focus-visible:outline-none focus-visible:border-fuchsia-brand focus-visible:ring-2 focus-visible:ring-fuchsia-brand/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
