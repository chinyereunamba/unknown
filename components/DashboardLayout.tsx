"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  FileText,
  Globe,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Summaries", href: "/summaries", icon: FileText },
  { name: "Scraped Pages", href: "/scraped", icon: Globe },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

const DashboardSidebar = () => {
  const location = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="">
        {/* Logo */}
        <div className="p-4 border-b flex items-center justify-between">
          <span>
            <Link className="flex items-center space-x-2" href="/dashboard">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  S
                </span>
              </div>
              {!isCollapsed && (
                <span className="text-gradient font-semibold">SummaryAI</span>
              )}
            </Link>
          </span>
          <SidebarTrigger className="m-2 self-end" />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = location === item.href;

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <Link
                        className={`${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        } transition-smooth`}
                        href={item.href}
                      >
                        <item.icon className="w-4 h-4" />
                        {!isCollapsed && <span>{item.name}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <div className="mt-auto p-4 border-t">
          {session?.user?.name || "no name"}
          <Button
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            size="icon"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className="max-w-7xl mx-auto flex-1 bg-background overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
