import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "purple" | "teal" | "pink" | "muted" | "success" | "warning" | "error";
  className?: string;
}

export default function Badge({ children, variant = "gold", className }: BadgeProps) {
  const variants = {
    gold:    "bg-brand-gold/15 text-brand-gold border border-brand-gold/30",
    purple:  "bg-brand-purple/15 text-brand-purple-light border border-brand-purple/30",
    teal:    "bg-brand-teal/15 text-brand-teal border border-brand-teal/30",
    pink:    "bg-brand-pink/15 text-brand-pink border border-brand-pink/30",
    muted:   "bg-white/5 text-brand-muted border border-white/10",
    success: "bg-brand-success/15 text-brand-success border border-brand-success/30",
    warning: "bg-brand-warning/15 text-brand-warning border border-brand-warning/30",
    error:   "bg-brand-error/15 text-brand-error border border-brand-error/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
