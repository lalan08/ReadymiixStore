"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-light text-brand-darker shadow-gold-sm hover:shadow-gold active:scale-[0.98]",
    secondary:
      "bg-brand-purple hover:bg-brand-purple-light text-white shadow-purple hover:shadow-purple active:scale-[0.98]",
    outline:
      "border border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10 hover:border-brand-gold/70 active:scale-[0.98]",
    ghost:
      "text-brand-muted hover:text-brand-text hover:bg-white/5 active:scale-[0.98]",
    danger:
      "bg-brand-error hover:bg-red-600 text-white active:scale-[0.98]",
  };

  const sizes = {
    sm: "text-sm px-4 py-2",
    md: "text-sm px-6 py-3",
    lg: "text-base px-8 py-4",
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
