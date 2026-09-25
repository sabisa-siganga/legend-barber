import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { fetchAdminSession } from "../../api/admin";

export function AdminRouteGuard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let ignore = false;

    const checkSession = async () => {
      const session = await fetchAdminSession();

      if (ignore) {
        return;
      }

      if (!session.authenticated) {
        navigate("/admin/login", { replace: true });
        return;
      }

      setIsAuthenticated(true);
    };

    checkSession();

    return () => {
      ignore = true;
    };
  }, [navigate]);

  if (!isAuthenticated) {
    return (
      <p className="bg-ink px-5 py-16 text-sm text-ash" role="status">
        Checking admin access…
      </p>
    );
  }

  return <Outlet />;
}
