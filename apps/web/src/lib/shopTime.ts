const SHOP_TIME_ZONE = "Africa/Johannesburg";

const shopDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: SHOP_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const shopWeekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SHOP_TIME_ZONE,
  weekday: "short",
});

const bookingDateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: SHOP_TIME_ZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const isCalendarDate = (date: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const [year, month, day] = date.split("-").map((part) => Number(part));
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
};

export const shopToday = (now: Date = new Date()): string =>
  shopDateFormatter.format(now);

export const addShopDays = (date: string, days: number): string => {
  const [year, month, day] = date.split("-").map((part) => Number(part));
  const parsed = new Date(Date.UTC(year, month - 1, day));
  parsed.setUTCDate(parsed.getUTCDate() + days);

  const nextYear = String(parsed.getUTCFullYear()).padStart(4, "0");
  const nextMonth = String(parsed.getUTCMonth() + 1).padStart(2, "0");
  const nextDay = String(parsed.getUTCDate()).padStart(2, "0");

  return `${nextYear}-${nextMonth}-${nextDay}`;
};

export const isShopSunday = (date: string): boolean => {
  if (!isCalendarDate(date)) {
    return false;
  }

  return (
    shopWeekdayFormatter.format(new Date(`${date}T12:00:00+02:00`)) === "Sun"
  );
};

export const formatBookingDate = (date: string): string => {
  if (!isCalendarDate(date)) {
    return date;
  }

  return bookingDateFormatter.format(new Date(`${date}T12:00:00+02:00`));
};
