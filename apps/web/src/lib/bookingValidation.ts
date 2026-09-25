import { isCalendarDate, isShopSunday, shopToday } from "./shopTime";
import type { BookingFieldErrors, BookingRequest } from "../types/booking";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const dateError = (date: string): string | undefined => {
  const trimmed = date.trim();

  if (trimmed === "") {
    return "Choose a date.";
  }

  if (!isCalendarDate(trimmed)) {
    return "Enter a valid date.";
  }

  if (trimmed < shopToday()) {
    return "Choose today or a future date.";
  }

  if (isShopSunday(trimmed)) {
    return "Legend Barber is closed on Sundays.";
  }

  return undefined;
};

export const validateBookingInput = (
  input: BookingRequest,
  availableSlots: readonly string[] | null,
): BookingFieldErrors => {
  const errors: BookingFieldErrors = {};
  const selectedDateError = dateError(input.date);
  const customerName = input.customerName.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();

  if (input.serviceId.trim() === "") {
    errors.serviceId = "Choose an active service.";
  }

  if (selectedDateError !== undefined) {
    errors.date = selectedDateError;
  } else if (input.startTime === "") {
    errors.startTime = "Choose a start time.";
  } else if (
    availableSlots === null ||
    !availableSlots.includes(input.startTime)
  ) {
    errors.startTime = "Choose an available time.";
  }

  if (customerName === "") {
    errors.customerName = "Enter your name.";
  } else if (customerName.length < 2 || customerName.length > 100) {
    errors.customerName = "Enter a name between 2 and 100 characters.";
  }

  if (email === "") {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (phone === "") {
    errors.phone = "Enter your phone number.";
  } else if (phone.length < 7 || phone.length > 30) {
    errors.phone = "Enter a phone number between 7 and 30 characters.";
  }

  return errors;
};

export const hasBookingErrors = (errors: BookingFieldErrors): boolean =>
  Object.values(errors).some(
    (message) => message !== undefined && message !== "",
  );

export const toBookingRequest = (input: BookingRequest): BookingRequest => ({
  serviceId: input.serviceId.trim(),
  date: input.date.trim(),
  startTime: input.startTime,
  customerName: input.customerName.trim(),
  email: input.email.trim(),
  phone: input.phone.trim(),
});
