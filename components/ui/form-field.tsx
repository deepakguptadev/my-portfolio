"use client";

import { CircleAlert } from "lucide-react";
import { createContext, useContext, useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type FieldContextValue = {
  id: string;
  hintId?: string;
  errorId?: string;
  invalid: boolean;
  required: boolean;
};

const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * ARIA wiring for the control inside a FormField. Spread onto the
 * control: sets id, aria-describedby, aria-invalid and aria-required.
 */
export function useFieldControl() {
  const field = useContext(FieldContext);
  if (!field) return {};
  const describedBy = [field.hintId, field.errorId].filter(Boolean).join(" ") || undefined;
  return {
    id: field.id,
    "aria-describedby": describedBy,
    "aria-invalid": field.invalid || undefined,
    "aria-required": field.required || undefined,
  };
}

type FormFieldProps = {
  label: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  /** Right-aligned meta, e.g. a character counter. */
  meta?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function FormField({
  label,
  hint,
  error,
  required = false,
  meta,
  className,
  children,
}: FormFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <FieldContext.Provider value={{ id, hintId, errorId, invalid: Boolean(error), required }}>
      <div className={cn("flex flex-col gap-2", className)}>
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor={id} className="text-small font-medium text-fg">
            {label}
            {required ? <span className="ml-1 text-fg-muted">(required)</span> : null}
          </label>
          {meta && <span className="font-mono text-caption text-fg-muted">{meta}</span>}
        </div>
        {children}
        {hint && !error && (
          <p id={hintId} className="text-small text-fg-muted">
            {hint}
          </p>
        )}
        {error && <ValidationMessage id={errorId}>{error}</ValidationMessage>}
      </div>
    </FieldContext.Provider>
  );
}

export function ValidationMessage({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-1.5 text-small text-error">
      <CircleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
