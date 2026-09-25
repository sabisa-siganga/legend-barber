import { afterEach, describe, expect, it } from "vitest";
import { readContactPrefill, writeContactPrefill } from "./contactPrefill";

describe("contact prefill", () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it("returns saved contact details", () => {
    writeContactPrefill({
      customerName: "Jane Doe",
      email: "jane@example.com",
      phone: "+27 82 123 4567",
    });

    expect(readContactPrefill()).toEqual({
      customerName: "Jane Doe",
      email: "jane@example.com",
      phone: "+27 82 123 4567",
    });
  });

  it("clears stored data that is not a contact record", () => {
    sessionStorage.setItem(
      "legend-barber-contact-prefill",
      JSON.stringify({
        customerName: "Jane Doe",
        date: "2026-09-26",
      }),
    );

    expect(readContactPrefill()).toEqual({
      customerName: "",
      email: "",
      phone: "",
    });
    expect(sessionStorage.getItem("legend-barber-contact-prefill")).toBeNull();
  });
});
