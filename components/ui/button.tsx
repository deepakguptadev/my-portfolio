import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-sm font-medium whitespace-nowrap select-none",
    "transition-[color,background-color,border-color,transform] duration-micro ease-standard",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-accent text-on-accent hover:bg-accent-hover",
        secondary:
          "border border-line-strong bg-surface text-fg hover:border-fg-muted hover:bg-surface-2",
        ghost: "text-fg-secondary hover:bg-surface-2 hover:text-fg",
        text: "text-accent underline-offset-4 hover:text-accent-hover hover:underline active:scale-100",
        destructive: "bg-error text-on-accent hover:opacity-90",
      },
      size: {
        sm: "h-8 px-3 text-small [&_svg]:size-3.5",
        md: "h-10 px-4 text-small [&_svg]:size-4",
        lg: "h-12 px-5 text-body [&_svg]:size-5",
        icon: "size-10 [&_svg]:size-5",
        "icon-sm": "size-8 [&_svg]:size-4",
      },
    },
    compoundVariants: [
      // Keep touch targets at 44px+ on coarse pointers.
      { size: ["sm", "md", "icon", "icon-sm"], className: "pointer-coarse:min-h-11" },
      { size: ["icon", "icon-sm"], className: "pointer-coarse:min-w-11" },
      // Inline text links size to their content.
      { variant: "text", className: "h-auto px-0 pointer-coarse:min-h-0" },
    ],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child element (e.g. a Link) with button styles. */
    asChild?: boolean;
    /** Shows a spinner, keeps the label, and blocks interaction. */
    loading?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild) {
    return (
      <Slot.Root className={classes} {...props}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
