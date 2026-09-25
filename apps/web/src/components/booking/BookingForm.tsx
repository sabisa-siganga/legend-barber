import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
} from "react";
import {
  AVAILABILITY_FAILED_MESSAGE,
  createBooking,
  fetchAvailability,
  SLOT_UNAVAILABLE_MESSAGE,
} from "../../api/booking";
import {
  readContactPrefill,
  writeContactPrefill,
} from "../../lib/contactPrefill";
import {
  hasBookingErrors,
  toBookingRequest,
  validateBookingInput,
} from "../../lib/bookingValidation";
import { shopDetails } from "../../lib/shopDetails";
import { isCalendarDate, isShopSunday, shopToday } from "../../lib/shopTime";
import type {
  BookingConfirmation,
  BookingFieldErrors,
  BookingFieldName,
} from "../../types/booking";
import type { Service } from "../../types/service";

type BookingFormProps = {
  service: Service;
  onConfirmed: (confirmation: BookingConfirmation) => void;
  onSubmittingChange: (isSubmitting: boolean) => void;
};

type SlotState =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly slots: readonly string[] }
  | { readonly status: "error"; readonly message: string };

type LoadedSlots =
  | {
      readonly date: string;
      readonly status: "ready";
      readonly slots: readonly string[];
    }
  | {
      readonly date: string;
      readonly status: "error";
      readonly message: string;
    };

const slotView = (date: string, loadedSlots: LoadedSlots | null): SlotState => {
  if (!isCalendarDate(date)) {
    return { status: "idle" };
  }

  if (loadedSlots === null || loadedSlots.date !== date) {
    return { status: "loading" };
  }

  if (loadedSlots.status === "error") {
    return { status: "error", message: loadedSlots.message };
  }

  return { status: "ready", slots: loadedSlots.slots };
};

const fieldClassName =
  "w-full scroll-mt-24 border-b border-bone/30 bg-transparent py-3 text-base text-bone outline-none transition-colors duration-200 focus:border-rust motion-reduce:transition-none disabled:opacity-60 aria-invalid:border-rust";

const labelClassName = "text-sm text-ash";

const errorClassName = "mt-2 text-sm leading-6 text-rust";

const submitClassName =
  "inline-flex min-h-11 w-full items-center justify-center border border-rust bg-rust px-5 py-3 text-sm tracking-[0.04em] text-bone transition-colors duration-200 hover:bg-transparent motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto";

const slotMessage = (date: string, slotState: SlotState): string | null => {
  if (date === "" || !isCalendarDate(date)) {
    return "Time availability will load once a date is selected.";
  }

  if (slotState.status === "loading" || slotState.status === "idle") {
    return "Loading available times…";
  }

  if (slotState.status === "error") {
    return slotState.message;
  }

  if (slotState.slots.length === 0) {
    if (isShopSunday(date)) {
      return "Crown & Blade is closed on Sundays.";
    }

    return "No times are available on this date.";
  }

  return null;
};

const revealField = (event: FocusEvent<HTMLElement>) => {
  if (typeof event.currentTarget.scrollIntoView !== "function") {
    return;
  }

  event.currentTarget.scrollIntoView({ block: "nearest" });
};

const clearError = (
  errors: BookingFieldErrors,
  field: BookingFieldName,
): BookingFieldErrors => {
  if (errors[field] === undefined) {
    return errors;
  }

  const next = { ...errors };
  delete next[field];
  return next;
};

export function BookingForm({
  service,
  onConfirmed,
  onSubmittingChange,
}: BookingFormProps) {
  const dateHintId = useId();
  const dateErrorId = useId();
  const timeErrorId = useId();
  const nameErrorId = useId();
  const emailErrorId = useId();
  const phoneErrorId = useId();
  const formErrorId = useId();
  const dateId = useId();
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const dateRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const timeGroupRef = useRef<HTMLFieldSetElement>(null);
  const formErrorRef = useRef<HTMLParagraphElement>(null);
  const submitLock = useRef(false);
  const [prefill] = useState(readContactPrefill);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [customerName, setCustomerName] = useState(prefill.customerName);
  const [email, setEmail] = useState(prefill.email);
  const [phone, setPhone] = useState(prefill.phone);
  const [fieldErrors, setFieldErrors] = useState<BookingFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loadedSlots, setLoadedSlots] = useState<LoadedSlots | null>(null);
  const [availabilityAttempt, setAvailabilityAttempt] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const slotState = slotView(date, loadedSlots);

  useEffect(() => {
    if (!isCalendarDate(date)) {
      return undefined;
    }

    const controller = new AbortController();
    const requestedDate = date;

    const loadSlots = async () => {
      const result = await fetchAvailability(requestedDate, controller.signal);

      if (
        controller.signal.aborted ||
        (!result.ok && result.kind === "aborted")
      ) {
        return;
      }

      if (!result.ok) {
        setLoadedSlots({
          date: requestedDate,
          status: "error",
          message:
            result.message === ""
              ? AVAILABILITY_FAILED_MESSAGE
              : result.message,
        });
        return;
      }

      setLoadedSlots({
        date: requestedDate,
        status: "ready",
        slots: result.slots,
      });
      setStartTime((current) =>
        current !== "" && !result.slots.includes(current) ? "" : current,
      );
    };

    loadSlots();

    return () => {
      controller.abort();
    };
  }, [availabilityAttempt, date]);

  useEffect(() => {
    if (formError === null) {
      return;
    }

    const hasInlineFieldError =
      fieldErrors.date !== undefined ||
      fieldErrors.startTime !== undefined ||
      fieldErrors.customerName !== undefined ||
      fieldErrors.email !== undefined ||
      fieldErrors.phone !== undefined;

    if (!hasInlineFieldError) {
      formErrorRef.current?.focus();
    }
  }, [fieldErrors, formError]);

  const availableSlots = slotState.status === "ready" ? slotState.slots : null;
  const timesMessage = slotMessage(date, slotState);
  const dateDescribedBy = [
    dateHintId,
    fieldErrors.date !== undefined ? dateErrorId : undefined,
  ]
    .filter((id) => id !== undefined)
    .join(" ");

  const focusFirstInvalid = (errors: BookingFieldErrors) => {
    if (errors.date !== undefined) {
      dateRef.current?.focus();
      return;
    }

    if (errors.startTime !== undefined) {
      timeGroupRef.current?.focus();
      return;
    }

    if (errors.customerName !== undefined) {
      nameRef.current?.focus();
      return;
    }

    if (errors.email !== undefined) {
      emailRef.current?.focus();
      return;
    }

    if (errors.phone !== undefined) {
      phoneRef.current?.focus();
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitLock.current) {
      return;
    }

    const draft = {
      serviceId: service.id,
      date,
      startTime,
      customerName,
      email,
      phone,
    };
    const errors = validateBookingInput(draft, availableSlots);

    if (hasBookingErrors(errors)) {
      setFieldErrors(errors);
      setFormError(errors.serviceId ?? null);
      focusFirstInvalid(errors);
      return;
    }

    const request = toBookingRequest(draft);
    submitLock.current = true;
    setIsSubmitting(true);
    onSubmittingChange(true);
    setFieldErrors({});
    setFormError(null);

    try {
      const result = await createBooking(request);

      if (result.ok) {
        writeContactPrefill({
          customerName: request.customerName,
          email: request.email,
          phone: request.phone,
        });
        onConfirmed(result.confirmation);
        return;
      }

      if (result.kind === "validation") {
        setFieldErrors(result.fieldErrors);
        setFormError(
          result.fieldErrors.serviceId ??
            (Object.keys(result.fieldErrors).length === 0
              ? result.message
              : null),
        );
        focusFirstInvalid(result.fieldErrors);
        return;
      }

      setFormError(
        result.kind === "slot_unavailable" && result.message === ""
          ? SLOT_UNAVAILABLE_MESSAGE
          : result.message,
      );

      if (result.kind === "slot_unavailable") {
        setStartTime("");
        setLoadedSlots(null);
        setAvailabilityAttempt((attempt) => attempt + 1);
      }
    } finally {
      submitLock.current = false;
      setIsSubmitting(false);
      onSubmittingChange(false);
    }
  };

  return (
    <form className="mt-8" noValidate onSubmit={onSubmit}>
      <h3 className="flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.22em] text-ash">
        <span className="h-px w-8 shrink-0 bg-rust" aria-hidden="true" />
        APPOINTMENT
      </h3>
      <p className="mt-4 text-sm leading-6 text-ash">
        All fields are required.
      </p>
      <div className="mt-6">
        <label className={labelClassName} htmlFor={dateId}>
          Date
        </label>
        <input
          ref={dateRef}
          id={dateId}
          name="date"
          type="date"
          required
          autoComplete="off"
          min={shopToday()}
          value={date}
          disabled={isSubmitting}
          aria-invalid={fieldErrors.date !== undefined}
          aria-describedby={dateDescribedBy}
          onFocus={revealField}
          onChange={(event) => {
            setDate(event.target.value);
            setStartTime("");
            setFieldErrors((current) =>
              clearError(clearError(current, "date"), "startTime"),
            );
            setFormError(null);
          }}
          className={`${fieldClassName} mt-2`}
        />
        <p id={dateHintId} className="mt-2 text-sm leading-6 text-ash">
          {shopDetails.hoursWeekday}
        </p>
        {fieldErrors.date !== undefined ? (
          <p id={dateErrorId} className={errorClassName}>
            {fieldErrors.date}
          </p>
        ) : null}
      </div>
      <fieldset
        ref={timeGroupRef}
        tabIndex={-1}
        aria-invalid={fieldErrors.startTime !== undefined}
        aria-describedby={
          fieldErrors.startTime !== undefined ? timeErrorId : undefined
        }
        className="mt-8 min-w-0 scroll-mt-24 outline-none"
      >
        <legend className={labelClassName}>Time</legend>
        {timesMessage !== null ? (
          <p aria-live="polite" className="mt-3 text-sm leading-6 text-ash">
            {timesMessage}
          </p>
        ) : null}
        {slotState.status === "ready" && slotState.slots.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slotState.slots.map((slot) => {
              const isSelected = startTime === slot;

              return (
                <label
                  key={slot}
                  className={`relative flex min-h-11 cursor-pointer items-center justify-center border px-2 py-2 text-sm tracking-[0.04em] transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rust motion-reduce:transition-none ${isSelected ? "border-rust bg-rust text-bone" : "border-bone/25 text-bone"}`}
                >
                  <input
                    type="radio"
                    name="startTime"
                    value={slot}
                    checked={isSelected}
                    disabled={isSubmitting}
                    onFocus={revealField}
                    onChange={() => {
                      setStartTime(slot);
                      setFieldErrors((current) =>
                        clearError(current, "startTime"),
                      );
                      setFormError(null);
                    }}
                    className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                  />
                  {slot}
                </label>
              );
            })}
          </div>
        ) : null}
        {fieldErrors.startTime !== undefined ? (
          <p id={timeErrorId} className={errorClassName}>
            {fieldErrors.startTime}
          </p>
        ) : null}
      </fieldset>
      <h3 className="mt-10 flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.22em] text-ash">
        <span className="h-px w-8 shrink-0 bg-rust" aria-hidden="true" />
        YOUR DETAILS
      </h3>
      <div className="mt-6 grid gap-6">
        <div>
          <label className={labelClassName} htmlFor={nameId}>
            Full name
          </label>
          <input
            ref={nameRef}
            id={nameId}
            name="customerName"
            type="text"
            required
            autoComplete="name"
            maxLength={100}
            value={customerName}
            disabled={isSubmitting}
            aria-invalid={fieldErrors.customerName !== undefined}
            aria-describedby={
              fieldErrors.customerName !== undefined ? nameErrorId : undefined
            }
            onFocus={revealField}
            onChange={(event) => {
              setCustomerName(event.target.value);
              setFieldErrors((current) => clearError(current, "customerName"));
            }}
            className={`${fieldClassName} mt-2`}
          />
          {fieldErrors.customerName !== undefined ? (
            <p id={nameErrorId} className={errorClassName}>
              {fieldErrors.customerName}
            </p>
          ) : null}
        </div>
        <div>
          <label className={labelClassName} htmlFor={emailId}>
            Email
          </label>
          <input
            ref={emailRef}
            id={emailId}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            value={email}
            disabled={isSubmitting}
            aria-invalid={fieldErrors.email !== undefined}
            aria-describedby={
              fieldErrors.email !== undefined ? emailErrorId : undefined
            }
            onFocus={revealField}
            onChange={(event) => {
              setEmail(event.target.value);
              setFieldErrors((current) => clearError(current, "email"));
            }}
            className={`${fieldClassName} mt-2`}
          />
          {fieldErrors.email !== undefined ? (
            <p id={emailErrorId} className={errorClassName}>
              {fieldErrors.email}
            </p>
          ) : null}
        </div>
        <div>
          <label className={labelClassName} htmlFor={phoneId}>
            Phone
          </label>
          <input
            ref={phoneRef}
            id={phoneId}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            maxLength={30}
            value={phone}
            disabled={isSubmitting}
            aria-invalid={fieldErrors.phone !== undefined}
            aria-describedby={
              fieldErrors.phone !== undefined ? phoneErrorId : undefined
            }
            onFocus={revealField}
            onChange={(event) => {
              setPhone(event.target.value);
              setFieldErrors((current) => clearError(current, "phone"));
            }}
            className={`${fieldClassName} mt-2`}
          />
          {fieldErrors.phone !== undefined ? (
            <p id={phoneErrorId} className={errorClassName}>
              {fieldErrors.phone}
            </p>
          ) : null}
        </div>
      </div>
      {formError !== null ? (
        <p
          ref={formErrorRef}
          id={formErrorId}
          tabIndex={-1}
          role="alert"
          className="mt-6 text-sm leading-6 text-rust outline-none"
        >
          {formError}
        </p>
      ) : null}
      <button
        type="submit"
        data-emphasis="solid"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        aria-describedby={formError !== null ? formErrorId : undefined}
        className={`${submitClassName} mt-8`}
      >
        {isSubmitting ? "Confirming booking…" : "Confirm booking"}
      </button>
    </form>
  );
}
