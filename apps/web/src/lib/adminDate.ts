const SHOP_TIME_ZONE = "Africa/Johannesburg";

const datePart = (
  parts: readonly Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string => parts.find((part) => part.type === type)?.value ?? "";

export const todayInJohannesburg = (now: Date = new Date()): string => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SHOP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = datePart(parts, "year");
  const month = datePart(parts, "month");
  const day = datePart(parts, "day");

  return `${year}-${month}-${day}`;
};

export const formatAdminDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.split("-").map((part) => Number(part));
  const middayInJohannesburg = new Date(Date.UTC(year, month - 1, day, 10, 0, 0));

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: SHOP_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(middayInJohannesburg);
};
