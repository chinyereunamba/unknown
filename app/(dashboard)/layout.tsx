import React from "react";

import Layout from "@/components/DashboardLayout";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  


  return <Layout>{children}</Layout>;
}
