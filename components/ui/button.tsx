import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-100 text-zinc-900 shadow hover:bg-white active:scale-[0.99]",
        secondary:
          "bg-zinc-900 text-zinc-100 border border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700 active:scale-[0.99]",
        outline:
          "border border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-700",
        ghost:
          "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
        destructive:
          "bg-red-950/50 text-red-300 border border-red-900/60 hover:bg-red-900/60 hover:text-red-100",
        accent:
          "bg-indigo-600 text-white shadow hover:bg-indigo-500 active:scale-[0.99]",
        link: "text-zinc-400 underline-offset-4 hover:underline hover:text-zinc-200",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
