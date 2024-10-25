"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Users,
  Settings,
  Shield,
  Activity,
  Menu,
  Images,
  NotebookPen,
  MonitorPlay,
  ShieldCheck,
  BookOpenText 
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", icon: Users, label: "Accommodation" },
    { href: "/dashboard/flight", icon: Settings, label: "Flight" },
    { href: "/dashboard/weather", icon: Activity, label: "Weather" },
    { href: "/dashboard/img-rag", icon: Images, label: "Gallery" },
    { href: "/dashboard/create-plan", icon: NotebookPen, label: "Create Plan" },
    {
      href: "/dashboard/ongoing-plan",
      icon: MonitorPlay,
      label: "Ongoing Plan",
    },
    {
      href: "/dashboard/completed-plan",
      icon: ShieldCheck,
      label: "Completed Plan",
    },
    {
      href: "/dashboard/blogs",
      icon: BookOpenText,
      label: "Blogs",
    },
  ];

  // Effect to close the sidebar when navigating to a new tab
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-[calc(100dvh-68px)] mx-auto w-full">
      {/* Mobile header */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 p-4">
        <Button className="-mr-3" variant="ghost" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Sidebar */}
        <aside
          className={` bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0 w-64" : "w-0 -translate-x-full"
          }`}
        >
          <nav className="h-full overflow-y-auto p-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={`my-1 w-full justify-start ${
                    pathname === item.href ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-0 lg:p-4 bg-[#fcfbf3]">
          {children}
        </main>
      </div>
    </div>
  );
}
