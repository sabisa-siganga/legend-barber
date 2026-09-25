import { shopDetails } from "../../lib/shopDetails";

const shopAddress = `${shopDetails.addressLine1}, ${shopDetails.addressLine2}`;

const hours = [
  { label: "Monday–Saturday", value: "08:00–17:00" },
  { label: "Sunday", value: "Closed" },
  { label: "Public holidays", value: "Open Monday–Saturday hours when applicable" },
] as const;

export function ShopHoursPanel() {
  return (
    <section aria-labelledby="shop-hours-heading" className="border border-bone/15 p-5">
      <h2 id="shop-hours-heading" className="font-display text-2xl font-semibold text-bone">
        Shop hours
      </h2>
      <dl className="mt-5 space-y-4 text-sm">
        {hours.map((row) => (
          <div key={row.label}>
            <dt className="text-ash">{row.label}</dt>
            <dd className="mt-1 text-bone">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 border-t border-bone/15 pt-4 text-sm text-bone">{shopAddress}</p>
    </section>
  );
}
