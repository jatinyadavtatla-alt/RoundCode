import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border border-zinc-800 bg-zinc-900 text-zinc-300",
        secondary:
          "border border-transparent bg-zinc-800 text-zinc-300",
        outline:
          "border border-zinc-700 text-zinc-300",
        approved:
          "border border-emerald-900/60 bg-emerald-950/40 text-emerald-400",
        pending:
          "border border-amber-900/60 bg-amber-950/40 text-amber-400",
        pending_review:
          "border border-amber-900/60 bg-amber-950/40 text-amber-400",
        under_review:
          "border border-sky-900/60 bg-sky-950/40 text-sky-400",
        needs_revision:
          "border border-rose-900/60 bg-rose-950/40 text-rose-400",
        rejected:
          "border border-rose-900/60 bg-rose-950/40 text-rose-400",
        suspended:
          "border border-zinc-800 bg-zinc-900/70 text-zinc-500",
        easy:
          "border border-emerald-900/50 bg-emerald-950/30 text-emerald-400",
        medium:
          "border border-amber-900/50 bg-amber-950/30 text-amber-400",
        hard:
          "border border-rose-900/50 bg-rose-950/30 text-rose-400",
        role:
          "border border-indigo-900/60 bg-indigo-950/40 text-indigo-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
