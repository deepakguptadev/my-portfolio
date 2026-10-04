"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { submitContact } from "@/app/contact/actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { contactSchema, MESSAGE_MAX, projectTypes, type ContactInput } from "@/lib/contact-schema";
import { profileLinks } from "@/lib/profile-links";

type Status = "idle" | "success" | "error";

const emptyValues: Partial<ContactInput> = {
  name: "",
  email: "",
  company: "",
  message: "",
  website: "",
  startedAt: 0,
};

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const successRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: emptyValues,
  });

  const messageLength = useWatch({ control, name: "message" })?.length ?? 0;

  // Fill-time check and ?type= prefill happen on the client only.
  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type");
    const projectType = projectTypes.find((t) => t.value === type)?.value;
    reset({ ...emptyValues, startedAt: Date.now(), projectType }, { keepDefaultValues: true });
  }, [reset]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
    if (status === "error") errorRef.current?.focus();
  }, [status]);

  async function onSubmit(data: ContactInput) {
    setStatus("idle");
    const result = await submitContact(data).catch(() => null);
    if (!result) {
      setErrorMessage("The network request failed.");
      setStatus("error");
      return;
    }
    if (result.status === "success") {
      setStatus("success");
      return;
    }
    if (result.status === "invalid") {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        setError(field as keyof ContactInput, { message }, { shouldFocus: true });
      }
      return;
    }
    setErrorMessage(result.message);
    setStatus("error");
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-lg border border-line bg-surface p-8">
        <CircleCheck aria-hidden className="size-8 text-success" />
        <h2 ref={successRef} tabIndex={-1} className="text-h3 text-fg outline-none">
          Message sent
        </h2>
        <p className="text-body text-fg-secondary">
          Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            reset({
              name: "",
              email: "",
              company: "",
              message: "",
              website: "",
              startedAt: Date.now(),
            });
            setStatus("idle");
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
      {status === "error" && (
        <div ref={errorRef} tabIndex={-1} className="outline-none md:col-span-2">
          <Alert
            tone="error"
            title={errorMessage}
            action={
              <Button size="sm" variant="secondary" type="submit" loading={isSubmitting}>
                Try again
              </Button>
            }
          >
            Your message is still here. You can also{" "}
            <a href={profileLinks.emailHref} className="text-accent underline underline-offset-4">
              email me directly
            </a>
            .
          </Alert>
        </div>
      )}

      <FormField label="Name" required error={errors.name?.message}>
        <Input autoComplete="name" disabled={isSubmitting} {...register("name")} />
      </FormField>
      <FormField label="Email" required error={errors.email?.message}>
        <Input type="email" autoComplete="email" disabled={isSubmitting} {...register("email")} />
      </FormField>
      <FormField label="Company" hint="Optional." error={errors.company?.message}>
        <Input autoComplete="organization" disabled={isSubmitting} {...register("company")} />
      </FormField>
      <FormField label="Project type" required error={errors.projectType?.message}>
        <Select
          options={projectTypes}
          placeholder="Choose a project type"
          disabled={isSubmitting}
          {...register("projectType")}
        />
      </FormField>
      <FormField
        label="Message"
        required
        className="md:col-span-2"
        error={errors.message?.message}
        meta={`${messageLength} / ${MESSAGE_MAX}`}
      >
        <Textarea
          rows={7}
          maxLength={MESSAGE_MAX}
          disabled={isSubmitting}
          {...register("message")}
        />
      </FormField>

      {/* Honeypot: visually and programmatically hidden from people. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p className="text-small text-fg-muted">Your details are only used to reply to you.</p>
        <Button type="submit" size="lg" loading={isSubmitting}>
          {!isSubmitting && <Send aria-hidden />}
          {isSubmitting ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
