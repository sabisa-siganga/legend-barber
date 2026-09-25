import { formatServicePrice } from "../../lib/services";
import type { AdminBooking } from "../../types/admin";

type AdminBookingsListProps = {
  readonly bookings: readonly AdminBooking[];
  readonly isReady: boolean;
};

const formatBookingRange = (booking: AdminBooking): string =>
  `${booking.startTime}–${booking.endTime}`;

const cellClassName = "py-4 pr-4 align-top max-md:block max-md:px-0 max-md:py-2";

const headerClassName = "py-3 pr-4 font-medium";

const headers = ["Time", "Service", "Price", "Customer", "Email", "Phone", "Reference"] as const;

const FieldLabel = ({ children }: { readonly children: string }) => (
  <span className="mb-1 block text-xs tracking-[0.08em] text-ash uppercase md:hidden">
    {children}
  </span>
);

const bookingCells = (booking: AdminBooking) => [
  { label: "Time", value: formatBookingRange(booking), className: "font-medium whitespace-nowrap" },
  { label: "Service", value: booking.service.name, className: "" },
  {
    label: "Price",
    value: formatServicePrice(booking.service.price),
    className: "whitespace-nowrap",
  },
  { label: "Customer", value: booking.customer.name, className: "" },
  { label: "Email", value: booking.customer.email, className: "" },
  { label: "Phone", value: booking.customer.phone, className: "whitespace-nowrap" },
  { label: "Reference", value: booking.reference, className: "text-ash" },
] as const;

export function AdminBookingsList({ bookings, isReady }: AdminBookingsListProps) {
  if (bookings.length === 0) {
    if (!isReady) {
      return null;
    }

    return (
      <div className="border border-bone/15 px-5 py-8">
        <p className="text-bone">No bookings for this date.</p>
        <p className="mt-2 text-sm text-ash">
          Crown & Blade has no confirmed appointments scheduled.
        </p>
      </div>
    );
  }

  return (
    <table className="w-full border-collapse text-left text-sm">
      <caption className="sr-only">Confirmed bookings</caption>
      <thead className="max-md:hidden">
        <tr className="border-b border-bone/15 text-xs tracking-[0.08em] text-ash uppercase">
          {headers.map((header) => (
            <th key={header} scope="col" className={headerClassName}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="max-md:block">
        {bookings.map((booking) => (
          <tr
            key={booking.id ?? booking.reference}
            className="border-b border-bone/15 max-md:mb-3 max-md:block max-md:border max-md:p-4"
          >
            {bookingCells(booking).map((cell) => (
              <td key={cell.label} className={`${cellClassName} ${cell.className}`}>
                <FieldLabel>{cell.label}</FieldLabel>
                {cell.value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
