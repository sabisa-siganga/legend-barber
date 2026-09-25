export type AdminBooking = {
  readonly id?: number | string;
  readonly reference: string;
  readonly bookingDate: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly service: {
    readonly id?: string;
    readonly name: string;
    readonly price: number;
  };
  readonly customer: {
    readonly name: string;
    readonly email: string;
    readonly phone: string;
  };
};

export type AdminLoginResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly message: string };

export type AdminBookingsResult =
  | { readonly ok: true; readonly bookings: readonly AdminBooking[] }
  | { readonly ok: false; readonly reason: "unauthorized" | "failed" };
