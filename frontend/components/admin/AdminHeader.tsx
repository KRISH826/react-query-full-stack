"use client";

import { Menu, Search, User, LayoutDashboard, Package, Tags, ShoppingCart, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useGetProfileQuery } from "@/services/userApi";
import { Spinner } from "../ui/spinner";
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useEffect, useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/product", icon: Package, label: "Products" },
  { href: "/category", icon: Tags, label: "Categories" },
  { href: "/orders", icon: ShoppingCart, label: "Orders" },
];

export function AdminHeader() {
  const pathname = usePathname();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data, isLoading } = useGetProfileQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-sidebar-border bg-background px-4 shadow-xs sm:px-6 lg:px-8">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 flex flex-col p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold uppercase tracking-wider text-primary">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="size-5" />
              </div>
              React Admin
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid gap-1 px-4">
              <p className="px-2 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">
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
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-5 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="mt-auto border-t border-border p-4">
            <nav className="grid gap-1">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all"
              >
                <LogOut className="size-5 shrink-0" />
                Logout
              </Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input className="w-[270px] pl-8 border border-primary/35" placeholder="Search products, orders..." />
          </div>
        </form>
        {
          !mounted || isLoading ? <Spinner className="size-5" /> : <>
            <Avatar>
              <AvatarImage src={data?.profileimage} />
              <AvatarFallback>{data?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2)}</AvatarFallback>
            </Avatar>
          </>
        }
      </div>
    </header>
  );
}
