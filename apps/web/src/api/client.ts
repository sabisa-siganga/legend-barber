const DEFAULT_API_BASE_URL = "http://localhost:8000";

export const CSRF_COOKIE_PATH = "/sanctum/csrf-cookie";

let csrfReady: Promise<void> | null = null;

export const getApiBaseUrl = (): string => {
  const configured = import.meta.env.VITE_API_BASE_URL;

  if (typeof configured === "string" && configured.trim() !== "") {
    return configured.replace(/\/$/, "");
  }

  return DEFAULT_API_BASE_URL;
};

export const absoluteApiUrl = (path: string): string => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${suffix}`;
};

const readXsrfToken = (): string | null => {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  const token = match?.[1];

  if (token === undefined || token === "") {
    return null;
  }

  try {
    return decodeURIComponent(token);
  } catch {
    return token;
  }
};

// Stateful SPA posts must echo Sanctum's XSRF-TOKEN cookie.
export const ensureCsrfCookie = async (): Promise<void> => {
  if (csrfReady === null) {
    csrfReady = fetch(`${getApiBaseUrl()}${CSRF_COOKIE_PATH}`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("CSRF cookie request failed");
        }
      })
      .catch((error: unknown) => {
        csrfReady = null;
        throw error;
      });
  }

  await csrfReady;
};

export const resetCsrfCookie = (): void => {
  csrfReady = null;
};

export const mutationHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const token = readXsrfToken();

  if (token !== null) {
    headers["X-XSRF-TOKEN"] = token;
  }

  return headers;
};
