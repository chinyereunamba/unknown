import Layout from "@/components/DashboardLayout";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
