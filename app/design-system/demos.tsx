"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toaster";

const projectTypes = [
  "Full-Time Opportunity",
  "Freelance",
  "Consulting",
  "Product Development",
  "Technical Discussion",
  "Collaboration",
  "Other",
].map((label) => ({ value: label.toLowerCase().replace(/\s+/g, "-"), label }));

const MESSAGE_MAX = 2000;

export function FormDemo() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormField label="Name" required>
        <Input autoComplete="name" />
      </FormField>
      <FormField label="Email" required error="Enter a valid email address, like name@company.com.">
        <Input type="email" defaultValue="deepak@" autoComplete="email" />
      </FormField>
      <FormField label="Company" hint="Optional.">
        <Input autoComplete="organization" />
      </FormField>
      <FormField label="Project type" required>
        <Select options={projectTypes} placeholder="Choose a project type" />
      </FormField>
      <FormField
        label="Message"
        required
        className="md:col-span-2"
        meta={`${message.length} / ${MESSAGE_MAX}`}
      >
        <Textarea
          value={message}
          maxLength={MESSAGE_MAX}
          onChange={(event) => setMessage(event.target.value)}
        />
      </FormField>
      <FormField label="Disabled field" hint="Shown while the form is submitting.">
        <Input disabled defaultValue="Read-only value" />
      </FormField>
      <div className="flex flex-col justify-end gap-4">
        <Checkbox label="Send me a copy of this message" />
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
          }}
        >
          {!loading && <Send aria-hidden />}
          {loading ? "Sending…" : "Send message"}
        </Button>
      </div>
    </div>
  );
}

export function ToastDemo() {
  return (
    <Button variant="secondary" onClick={() => toast.success("Email copied")}>
      Show toast
    </Button>
  );
}
