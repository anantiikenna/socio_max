import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Topbar from "@/components/shared/Topbar";
import { useUserContext } from "@/context/useUserContext";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "@/components/shared/Loader";

const RootLayout = () => {
  const { isAuthenticated } = useUserContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate authentication check before rendering
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return <Loader/>;

  if (!isAuthenticated) {
    return <Navigate to='/sign-in' replace />;
  }

  return (
    <div className="w-full md:flex">
      <Topbar />
      <LeftSidebar />

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      <Bottombar />
    </div>
  );
};

export default RootLayout;
