import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export default function Input({ label, error, helper, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-brand-text">
          {label}
          {props.required && <span className="text-brand-gold ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "input-base",
          error && "border-brand-error/50 focus:border-brand-error focus:ring-brand-error/30",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-brand-error mt-1">{error}</p>}
      {helper && !error && <p className="text-xs text-brand-muted mt-1">{helper}</p>}
    </div>
  );
}
