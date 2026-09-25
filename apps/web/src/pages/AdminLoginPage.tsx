import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { loginAdmin } from "../api/admin";
import { BrandLogo } from "../components/layout/BrandLogo";

const fieldClassName =
  "mt-2 w-full border border-bone/30 bg-transparent px-3 py-3 text-bone transition-colors duration-200 hover:border-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-rust motion-reduce:transition-none";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (errorMessage === "") {
      return;
    }

    errorRef.current?.focus();
  }, [errorMessage]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const result = await loginAdmin({ username, password });

    if (!result.ok) {
      setErrorMessage(result.message);
      setIsSubmitting(false);
      return;
    }

    navigate("/admin");
  };

  return (
    <main className="flex min-h-screen items-center bg-ink px-5 py-16 text-bone">
      <div className="mx-auto w-full max-w-md">
        <BrandLogo />
        <h1 className="mt-10 font-display text-4xl font-semibold tracking-tight">
          Admin access
        </h1>
        <p className="mt-3 text-sm text-ash">Sign in to view daily bookings.</p>
        <form className="mt-8" onSubmit={onSubmit} aria-busy={isSubmitting}>
          <div>
            <label htmlFor="admin-username" className="block text-sm text-ash">
              Username
            </label>
            <input
              id="admin-username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
              className={fieldClassName}
            />
          </div>
          <div className="mt-5">
            <label htmlFor="admin-password" className="block text-sm text-ash">
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              className={fieldClassName}
            />
          </div>
          {errorMessage === "" ? null : (
            <p
              ref={errorRef}
              tabIndex={-1}
              role="alert"
              aria-live="assertive"
              className="mt-5 text-sm text-bone outline-none"
            >
              {errorMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            data-emphasis="solid"
            className="mt-8 inline-flex items-center justify-center border border-rust bg-rust px-5 py-3 text-sm tracking-[0.04em] text-bone transition-colors duration-200 enabled:hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-bone disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
