import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PointerSpotlight } from "./pointer-spotlight";

function mockMatchMedia(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );
}

function renderCard() {
  render(
    <>
      <PointerSpotlight />
      <div data-spotlight="card">
        <span>Card body</span>
      </div>
    </>,
  );
  return screen.getByText("Card body");
}

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

afterEach(() => vi.unstubAllGlobals());

describe("PointerSpotlight", () => {
  it("passes the pointer position to the hovered spotlight element", async () => {
    mockMatchMedia(true);
    const inner = renderCard();

    fireEvent.pointerMove(inner, { clientX: 40, clientY: 25 });
    await nextFrame();

    const card = inner.closest<HTMLElement>("[data-spotlight]")!;
    expect(card.style.getPropertyValue("--spotlight-x")).toBe("40px");
    expect(card.style.getPropertyValue("--spotlight-y")).toBe("25px");
  });

  it("does nothing for touch users or when reduced motion is requested", async () => {
    mockMatchMedia(false);
    const inner = renderCard();

    fireEvent.pointerMove(inner, { clientX: 40, clientY: 25 });
    await nextFrame();

    const card = inner.closest<HTMLElement>("[data-spotlight]")!;
    expect(card.style.getPropertyValue("--spotlight-x")).toBe("");
  });
});
