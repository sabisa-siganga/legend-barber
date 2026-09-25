import { getApiBaseUrl } from "./client";

export const API_HEALTH_PATH = "/api/health";

export type ApiHealthResult = {
  ok: boolean;
  message: string;
};

const isOkHealthPayload = (value: unknown): boolean => {
  if (typeof value !== "object" || value === null || !("status" in value)) {
    return false;
  }

  return value.status === "ok";
};

export const fetchApiHealth = async (): Promise<ApiHealthResult> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}${API_HEALTH_PATH}`);

    if (!response.ok) {
      return { ok: false, message: "API unavailable" };
    }

    const payload: unknown = await response.json();

    if (!isOkHealthPayload(payload)) {
      return { ok: false, message: "API unavailable" };
    }

    return { ok: true, message: "API connected" };
  } catch {
    return { ok: false, message: "API unavailable" };
  }
};
