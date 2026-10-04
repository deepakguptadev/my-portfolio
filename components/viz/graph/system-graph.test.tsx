import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { graphs } from "@/content/graphs";
import { SystemGraph } from "./system-graph";

function canvas() {
  return screen.getByRole("group", { name: graphs.hero.title });
}

function node(name: string) {
  return within(canvas()).getByRole("button", { name: new RegExp(`^${name},`) });
}

describe("SystemGraph", () => {
  it("is a single tab stop with spatial arrow-key navigation", async () => {
    const user = userEvent.setup();
    render(<SystemGraph graph={graphs.hero} />);

    const focusable = within(canvas())
      .getAllByRole("button")
      .filter((button) => button.tabIndex === 0);
    expect(focusable).toHaveLength(1);

    await user.tab();
    expect(node("Product")).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(node("Next.js")).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(node("React")).toHaveFocus();
    await user.keyboard("{End}");
    expect(node("Database")).toHaveFocus();
    expect(node("Database").tabIndex).toBe(0);
  });

  it("selects with Enter, highlights neighbors and clears with Escape", async () => {
    const user = userEvent.setup();
    render(<SystemGraph graph={graphs.hero} />);

    node("APIs").focus();
    await user.keyboard("{Enter}");
    expect(node("APIs")).toHaveAttribute("aria-pressed", "true");
    expect(node("APIs")).toHaveAttribute("data-state", "active");
    expect(node("Database")).toHaveAttribute("data-state", "related");
    expect(node("Product")).toHaveAttribute("data-state", "muted");
    expect(screen.getByText(/APIs selected/)).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(node("APIs")).toHaveAttribute("aria-pressed", "false");
  });

  it("describes each node's connections for screen readers", () => {
    render(<SystemGraph graph={graphs.hero} />);
    expect(node("Node.js")).toHaveAccessibleName(
      "Node.js, Application. Connects from Product (dependency), to APIs (serves).",
    );
  });

  it("applies lenses as toggle buttons", async () => {
    const user = userEvent.setup();
    const graph = graphs["micro-frontends"];
    render(<SystemGraph graph={graph} />);
    const lens = screen.getByRole("button", { name: "Communication" });

    await user.click(lens);
    expect(lens).toHaveAttribute("aria-pressed", "true");
    const group = screen.getByRole("group", { name: graph.title });
    expect(within(group).getByRole("button", { name: /^Event Bus,/ })).toHaveAttribute(
      "data-state",
      "active",
    );
    expect(within(group).getByRole("button", { name: /^Host,/ })).toHaveAttribute(
      "data-state",
      "muted",
    );
  });

  it("steps through a request trace", async () => {
    const user = userEvent.setup();
    render(<SystemGraph graph={graphs["api-architecture"]} showTrace />);

    await user.click(screen.getByRole("button", { name: "Start" }));
    expect(screen.getByText("Step 1 of 5")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Step 2 of 5")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous" })).toBeEnabled();
  });

  it("offers a list alternative", async () => {
    const user = userEvent.setup();
    render(<SystemGraph graph={graphs.hero} />);
    await user.click(screen.getByRole("button", { name: "View as list" }));
    expect(screen.getByRole("button", { name: "View as diagram" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("list", { name: /layers/ })).toBeVisible();
  });
});
