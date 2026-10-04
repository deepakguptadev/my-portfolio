import { render, screen, waitFor } from "@testing-library/react";
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
});
