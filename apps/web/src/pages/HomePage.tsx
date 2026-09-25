import { ApiStatus } from '../components/ApiStatus';
import { PlaceholderPage } from '../components/PlaceholderPage';

export function HomePage() {
  return (
    <PlaceholderPage title="Home">
      <ApiStatus />
    </PlaceholderPage>
  );
}
