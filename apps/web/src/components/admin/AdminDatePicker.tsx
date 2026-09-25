import { formatAdminDate } from "../../lib/adminDate";

type AdminDatePickerProps = {
  readonly date: string;
  readonly onDateChange: (date: string) => void;
  readonly onToday: () => void;
};

const controlClassName =
  "border border-bone/30 bg-transparent px-3 py-2 text-sm text-bone transition-colors duration-200 hover:border-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-rust disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none";

export function AdminDatePicker({ date, onDateChange, onToday }: AdminDatePickerProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="font-display text-2xl text-bone">{formatAdminDate(date)}</p>
        <label htmlFor="admin-booking-date" className="mt-4 block text-sm text-ash">
          Date
        </label>
        <input
          id="admin-booking-date"
          name="date"
          type="date"
          value={date}
          onChange={(event) => {
            onDateChange(event.target.value);
          }}
          className={`mt-2 ${controlClassName}`}
        />
      </div>
      <button type="button" onClick={onToday} className={controlClassName}>
        Today
      </button>
    </div>
  );
}
