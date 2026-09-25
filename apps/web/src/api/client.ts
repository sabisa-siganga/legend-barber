const DEFAULT_API_BASE_URL = "http://localhost:8000";

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
