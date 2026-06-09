"use client";

import React from "react";
import Link from "next/link";
import {
    User,
    Heart,
    Menu,
    ShoppingCart,
    LogOut,
    Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { baseApi } from "@/services/baseQuery";
import { useGetProfileQuery, useLogoutMutation } from "@/services/userApi";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import BrandLogo from "@/components/branding/BrandLogo";

const MobileMenu = () => {
    const router = useRouter();
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const { data: user, isLoading } = useGetProfileQuery(undefined, {
        skip: !token,
    });
    const [logout] = useLogoutMutation();
    const dispatch = useDispatch();

    const handleProtectedNavigate = (path: string) => {
        if (!user && !isLoading) {
            router.push("/login");
            return;
        }
        router.push(path);
    };

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            toast.success("Logout successful");
            router.replace("/login");
            setTimeout(() => {
                dispatch(baseApi.util.resetApiState());
            }, 100);
        } catch {
            toast.error("Logout failed, but session cleared");
            router.replace("/login");
            setTimeout(() => {
                dispatch(baseApi.util.resetApiState());
            }, 100);
        }
    };

    const navLinks = [
        { label: "Home", href: "/" },
        { label: "Products", href: "/product" },
        { label: "Categories", href: "/categories" },
    ];

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-70 px-4">
                <SheetHeader>
                    <SheetTitle className="text-left">
                        <BrandLogo className="w-fit" />
                    </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Mobile Nav */}
                    <nav className="flex flex-col gap-1">
                        {navLinks.map((item) => (
                            <SheetClose key={item.label} asChild>
                                <Link
                                    href={item.href}
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                                    {item.label}
                                </Link>
                            </SheetClose>
                        ))}
                    </nav>

                    {/* Mobile Actions */}
                    <div className="flex flex-col gap-2 pt-4 border-t">
                        {user ? (
                            <>
                                <SheetClose asChild>
                                    <Button
                                        variant="outline"
                                        className="justify-start gap-2"
                                        onClick={() => router.push("/profile")}
                                    >
                                        <User className="h-4 w-4" />
                                        Profile
                                    </Button>
                                </SheetClose>

                                <SheetClose asChild>
                                    <Button
                                        variant="outline"
                                        className="justify-start gap-2"
                                        onClick={() => router.push("/orders")}
                                    >
                                        <Package className="h-4 w-4" />
                                        Orders
                                    </Button>
                                </SheetClose>

                                <SheetClose asChild>
                                    <Button
                                        variant="destructive"
                                        className="justify-start gap-2 bg-red-50 text-red-600 hover:bg-red-100 border-none"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </Button>
                                </SheetClose>
                            </>
                        ) : (
                            <>
                                <SheetClose asChild>
                                    <Button
                                        variant="outline"
                                        className="justify-start gap-2"
                                        onClick={() => router.push("/login")}
                                    >
                                        <User className="h-4 w-4" />
                                        Sign In
                                    </Button>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Button
                                        className="justify-start gap-2"
                                        onClick={() => router.push("/register")}
                                    >
                                        <User className="h-4 w-4" />
                                        Register
                                    </Button>
                                </SheetClose>
                            </>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MobileMenu;
