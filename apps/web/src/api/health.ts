export const API_HEALTH_PATH = '/api/health';

const DEFAULT_API_BASE_URL = 'http://localhost:8000';

export type ApiHealthResult = {
  ok: boolean;
  message: string;
};

export const getApiBaseUrl = (): string => {
  const configured = import.meta.env.VITE_API_BASE_URL;

  if (typeof configured === 'string' && configured.trim() !== '') {
    return configured.replace(/\/$/, '');
  }

  return DEFAULT_API_BASE_URL;
};

const isOkHealthPayload = (value: unknown): boolean => {
  if (typeof value !== 'object' || value === null || !('status' in value)) {
    return false;
  }

  return value.status === 'ok';
};

export const fetchApiHealth = async (): Promise<ApiHealthResult> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}${API_HEALTH_PATH}`);

    if (!response.ok) {
      return { ok: false, message: 'API unavailable' };
    }

    const payload: unknown = await response.json();

    if (!isOkHealthPayload(payload)) {
      return { ok: false, message: 'API unavailable' };
    }

    return { ok: true, message: 'API connected' };
  } catch {
    return { ok: false, message: 'API unavailable' };
  }
};
