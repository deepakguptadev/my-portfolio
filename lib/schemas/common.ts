import { z } from "zod";

/**
 * Facts not yet supplied by Deepak. Rendered as "Content required"
 * markers instead of being invented. Empty means the item is complete.
 */
export const pending = z.array(z.string().min(1)).default([]);

/** A year ("2019") or month ("2024-11"). Never a guessed day. */
export const partialDate = z.string().regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, "Use YYYY or YYYY-MM");

export const period = z.object({
  start: partialDate,
  /** null = present / ongoing. */
  end: partialDate.nullable(),
});

export const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use kebab-case");

export const moduleRef = z.object({
  label: z.string(),
  href: z.string().startsWith("/"),
});

export type Period = z.infer<typeof period>;
export type ModuleRef = z.infer<typeof moduleRef>;

/** Parse content and fail the build with a readable message. */
export function defineContent<T extends z.ZodType>(name: string, schema: T, data: z.input<T>) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid content "${name}":\n${z.prettifyError(result.error)}`);
  }
  return result.data as z.output<T>;
}
