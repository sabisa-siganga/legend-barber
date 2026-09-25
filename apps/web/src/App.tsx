import { BrowserRouter, Route, Routes } from 'react-router';
import { AppLayout } from './components/layout/AppLayout';
import { AboutPage } from './pages/AboutPage';
import { AdminBookingsPage } from './pages/AdminBookingsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { TermsPage } from './pages/TermsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
