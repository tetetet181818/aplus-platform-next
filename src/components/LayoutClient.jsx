"use client";

import { useEffect } from "react";
import { NotificationPanel } from "@/components/notifications/NotificationBell";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import { useAuthStore } from "@/stores/useAuthStore";

export default function LayoutClient({ children }) {
  const { getUser, fetchNotifications, fetchTheNumberOfUnreadNotifications } =
    useAuthStore((state) => state);

  useEffect(() => {
    async function fetchData() {
      await getUser();
      await fetchNotifications();
      await fetchTheNumberOfUnreadNotifications();
    }
    fetchData();
  }, []);

  return (
    <>
      <ScrollToTop />
      <Layout>{children}</Layout>
      <Toaster position="top-center" reverseOrder={false} />
      <NotificationPanel />
    </>
  );
}
