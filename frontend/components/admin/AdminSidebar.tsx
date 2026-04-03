"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Tags, ShoppingCart, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/services/userApi";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { baseApi } from "@/services/baseQuery";
import { useDispatch } from 'react-redux'

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/product", icon: Package, label: "Products" },
  { href: "/category", icon: Tags, label: "Categories" },
  { href: "/orders", icon: ShoppingCart, label: "Orders" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [logout, { isLoading }] = useLogoutMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logout successful");
      router.replace("/login");

      // Reset API state after navigation to avoid flash of empty content
      setTimeout(() => {
        dispatch(baseApi.util.resetApiState());
      }, 100);
    } catch {
      // Fallback if API fails
      toast.error("Logout failed, but session cleared");
      router.replace("/login");
      setTimeout(() => {
        dispatch(baseApi.util.resetApiState());
      }, 100);
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold uppercase tracking-wider text-sidebar-primary">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <LayoutDashboard className="size-5" />
          </div>
          React Admin
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4">
          <p className="px-2 pb-2 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-widest">
            Main Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="size-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-sidebar-border p-4">
        <nav className="grid gap-1">
          <Button variant={"link"}
            onClick={handleLogout}
            className="flex hover:no-underline! items-center justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all"
          >
            {
              isLoading ? <Spinner className="size-5 shrink-0 animate-spin" /> : <LogOut className="size-[18px] shrink-0" />
            }
            Logout
          </Button>
        </nav>
      </div>
    </aside>
  );
}
