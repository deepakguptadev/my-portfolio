import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FormField } from "./form-field";
import { Select } from "./select";

const options = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

describe("Select", () => {
  it("starts on a disabled placeholder and is labelled by its FormField", () => {
    render(
      <FormField label="Letter" required>
        <Select options={options} placeholder="Pick one" />
      </FormField>,
    );
    const select = screen.getByRole("combobox", { name: /Letter/ });
    expect(select).toHaveValue("");
    expect(screen.getByRole("option", { name: "Pick one" })).toBeDisabled();
    expect(select).toHaveAttribute("aria-required", "true");
  });

  it("selects an option", async () => {
    render(<Select options={options} aria-label="Letter" />);
    await userEvent.selectOptions(screen.getByRole("combobox"), "b");
    expect(screen.getByRole("combobox")).toHaveValue("b");
  });
});
