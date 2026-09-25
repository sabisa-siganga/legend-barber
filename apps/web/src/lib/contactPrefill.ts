const CONTACT_PREFILL_KEY = "legend-barber-contact-prefill";

export type ContactPrefill = {
  readonly customerName: string;
  readonly email: string;
  readonly phone: string;
};

const emptyContact: ContactPrefill = {
  customerName: "",
  email: "",
  phone: "",
};

const isContactPrefill = (value: unknown): value is ContactPrefill => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (
    !("customerName" in value) ||
    !("email" in value) ||
    !("phone" in value)
  ) {
    return false;
  }

  return (
    typeof value.customerName === "string" &&
    typeof value.email === "string" &&
    typeof value.phone === "string"
  );
};

const clearContactPrefill = (): void => {
  try {
    sessionStorage.removeItem(CONTACT_PREFILL_KEY);
  } catch {
    // Storage can be blocked; the form still works without prefill.
  }
};

export const readContactPrefill = (): ContactPrefill => {
  try {
    const raw = sessionStorage.getItem(CONTACT_PREFILL_KEY);

    if (raw === null) {
      return emptyContact;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!isContactPrefill(parsed)) {
      clearContactPrefill();
      return emptyContact;
    }

    return {
      customerName: parsed.customerName,
      email: parsed.email,
      phone: parsed.phone,
    };
  } catch {
    clearContactPrefill();
    return emptyContact;
  }
};

export const writeContactPrefill = (contact: ContactPrefill): void => {
  try {
    sessionStorage.setItem(
      CONTACT_PREFILL_KEY,
      JSON.stringify({
        customerName: contact.customerName,
        email: contact.email,
        phone: contact.phone,
      }),
    );
  } catch {
    // A failed write must not block the confirmed booking.
  }
};
