import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiStatus } from "./ApiStatus";

const stubHealthFetch = (response: { ok: boolean; body?: unknown } | Error) => {
  if (response instanceof Error) {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(response));
    return;
  }

  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: response.ok,
      json: async () => response.body,
    }),
  );
};

describe("API status", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows a connected API status when the health check succeeds", async () => {
    stubHealthFetch({
      ok: true,
      body: { status: "ok", service: "legend-barber-api" },
    });

    render(<ApiStatus />);

    expect(await screen.findByTestId("api-status")).toHaveTextContent(
      "API connected",
    );
  });

  it("shows an unavailable API status when the health check fails", async () => {
    stubHealthFetch(new Error("network down"));

    render(<ApiStatus />);

    expect(await screen.findByTestId("api-status")).toHaveTextContent(
      "API unavailable",
    );
  });
});
