import { BrowserRouter, Route, Routes } from "react-router";
import { AdminRouteGuard } from "./components/admin/AdminRouteGuard";
import { AppLayout } from "./components/layout/AppLayout";
import { routerBasenameFromBaseUrl } from "./lib/siteBase";
import { AboutPage } from "./pages/AboutPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { TermsPage } from "./pages/TermsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<AdminRouteGuard />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>
    </Routes>
  );
}

const routerBasename = routerBasenameFromBaseUrl(import.meta.env.BASE_URL);

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <AppRoutes />
    </BrowserRouter>
  );
}
