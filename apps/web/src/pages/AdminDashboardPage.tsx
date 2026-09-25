import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchAdminBookings, logoutAdmin } from "../api/admin";
import { AdminBookingsList } from "../components/admin/AdminBookingsList";
import { AdminDatePicker } from "../components/admin/AdminDatePicker";
import { ShopHoursPanel } from "../components/admin/ShopHoursPanel";
import { BrandLogo } from "../components/layout/BrandLogo";
import { todayInJohannesburg } from "../lib/adminDate";
import type { AdminBooking } from "../types/admin";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState(() => todayInJohannesburg());
  const [bookings, setBookings] = useState<readonly AdminBooking[]>([]);
  const [requestState, setRequestState] = useState<"loading" | "ready" | "error">("loading");
  const [reloadCount, setReloadCount] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadBookings = async () => {
      setRequestState("loading");
      const result = await fetchAdminBookings(date);

      if (ignore) {
        return;
      }

      if (!result.ok) {
        if (result.reason === "unauthorized") {
          setBookings([]);
          navigate("/admin/login", { replace: true });
          return;
        }

        setRequestState("error");
        return;
      }

      setBookings(result.bookings);
      setRequestState("ready");
    };

    loadBookings();

    return () => {
      ignore = true;
    };
  }, [date, navigate, reloadCount]);

  const onDateChange = (nextDate: string) => {
    if (!ISO_DATE.test(nextDate)) {
      return;
    }

    setDate(nextDate);
  };

  const onLogout = async () => {
    setIsLoggingOut(true);
    await logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-ink text-bone">
      <a
        href="#admin-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-bone focus:px-3 focus:py-2 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>
      <header className="border-b border-bone/15">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <BrandLogo compactOnMobile />
            <p className="text-xs tracking-[0.14em] text-ash uppercase">Admin dashboard</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="border-b border-rust pb-1 text-sm text-bone transition-colors duration-200 hover:border-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-rust disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
          >
            {isLoggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      </header>
      <main id="admin-content" className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Bookings</h1>
        <p className="mt-3 max-w-xl text-sm text-ash">
          View confirmed appointments for a selected day.
        </p>
        <div className="mt-8">
          <AdminDatePicker
            date={date}
            onDateChange={onDateChange}
            onToday={() => {
              setDate(todayInJohannesburg());
            }}
          />
        </div>
        {requestState === "loading" ? (
          <p className="mt-6 text-sm text-ash" role="status" aria-live="polite">
            Loading bookings…
          </p>
        ) : null}
        {requestState === "error" ? (
          <div className="mt-6 border border-rust/60 px-4 py-4" role="alert" aria-live="assertive">
            <p>We could not load bookings for this date. Please try again.</p>
            <button
              type="button"
              onClick={() => {
                setReloadCount((count) => count + 1);
              }}
              className="mt-4 border border-rust px-4 py-2 text-sm text-bone transition-colors duration-200 hover:bg-rust focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-bone motion-reduce:transition-none"
            >
              Try again
            </button>
          </div>
        ) : null}
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <AdminBookingsList bookings={bookings} isReady={requestState === "ready"} />
          <ShopHoursPanel />
        </div>
      </main>
    </div>
  );
}
