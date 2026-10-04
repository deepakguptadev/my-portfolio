"use client";

import { Copy } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { profileLinks } from "@/lib/profile-links";

export function CopyEmailButton(
  props: Omit<ComponentProps<typeof Button>, "onClick" | "children">,
) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(profileLinks.email);
      toast.success("Email copied", { description: profileLinks.email });
    } catch {
      toast.error(`Couldn't copy. The address is ${profileLinks.email}`);
    }
  }

  return (
    <Button variant="ghost" {...props} onClick={copy}>
      <Copy aria-hidden /> Copy email
    </Button>
  );
}
