import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/contact/actions", () => ({ submitContact: vi.fn() }));

import { ContactForm } from "./contact-form";

describe("ContactForm", () => {
  it("prefills the project type from ?type=", async () => {
    window.history.replaceState(null, "", "/contact?type=product-development");
    render(<ContactForm />);
    await waitFor(() =>
      expect(screen.getByRole("combobox", { name: /Project type/ })).toHaveValue(
        "product-development",
      ),
    );
  });

  it("asks for a budget only for paid project work", async () => {
    window.history.replaceState(null, "", "/contact");
    const user = userEvent.setup();
    render(<ContactForm />);
    const projectType = screen.getByRole("combobox", { name: /Project type/ });

    expect(screen.queryByRole("combobox", { name: /Budget/ })).not.toBeInTheDocument();
    await user.selectOptions(projectType, "freelance");
    expect(screen.getByRole("combobox", { name: /Budget/ })).toBeInTheDocument();
    await user.selectOptions(projectType, "full-time");
    expect(screen.queryByRole("combobox", { name: /Budget/ })).not.toBeInTheDocument();
  });

  it("offers phone and timeline as optional fields", () => {
    render(<ContactForm />);
    expect(screen.getByRole("textbox", { name: /Phone/ })).toHaveAttribute("type", "tel");
    expect(screen.getByRole("combobox", { name: /Timeline/ })).not.toBeRequired();
  });
});
