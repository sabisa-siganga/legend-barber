export type BookingRequest = {
  readonly serviceId: string;
  readonly date: string;
  readonly startTime: string;
  readonly customerName: string;
  readonly email: string;
  readonly phone: string;
};

export type BookingFieldName = keyof BookingRequest;

export type BookingFieldErrors = Partial<Record<BookingFieldName, string>>;

export type BookingConfirmation = {
  readonly reference: string;
  readonly service: {
    readonly id: string;
    readonly name: string;
    readonly price: number;
  };
  readonly date: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly location: string;
  readonly googleCalendarUrl: string;
  readonly appleCalendarUrl: string;
};

export type BookingFailureKind =
  | "validation"
  | "slot_unavailable"
  | "network"
  | "rejected";

export type BookingResult =
  | { readonly ok: true; readonly confirmation: BookingConfirmation }
  | {
      readonly ok: false;
      readonly kind: BookingFailureKind;
      readonly message: string;
      readonly fieldErrors: BookingFieldErrors;
    };

export type AvailabilityResult =
  | {
      readonly ok: true;
      readonly date: string;
      readonly slots: readonly string[];
    }
  | {
      readonly ok: false;
      readonly kind: "validation" | "network" | "aborted";
      readonly message: string;
    };
