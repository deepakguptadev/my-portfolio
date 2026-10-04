import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge must know the custom type scale, otherwise it treats
// `text-body` (size) and `text-fg` (color) as conflicting and drops one.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: ["display", "h1", "h2", "h3", "h4", "body-lg", "body", "small", "caption", "code"],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
