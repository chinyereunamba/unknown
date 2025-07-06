import React from "react";

import Layout from "@/components/DashboardLayout";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = await authClient.getSession();

  if (!session) return redirect("/login");

  return <Layout>{children}</Layout>;
}
