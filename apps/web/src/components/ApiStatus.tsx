import { useEffect, useState } from 'react';
import { fetchApiHealth, type ApiHealthResult } from '../api/health';

export function ApiStatus() {
  const [result, setResult] = useState<ApiHealthResult | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadHealth = async () => {
      const health = await fetchApiHealth();

      if (isActive) {
        setResult(health);
      }
    };

    loadHealth();

    return () => {
      isActive = false;
    };
  }, []);

  if (!import.meta.env.DEV) {
    return null;
  }

  const message = result === null ? 'Checking API…' : result.message;

  return (
    <p className="mt-6 text-sm text-concrete" data-testid="api-status">
      {message}
    </p>
  );
}
