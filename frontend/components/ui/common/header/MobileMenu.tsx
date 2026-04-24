"use client";

import React from "react";
import Link from "next/link";
import {
    ShoppingBag,
    User,
    Heart,
    Menu,
    ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import MobileCategoryList from "./MobileCategoryList";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGetProfileQuery } from "@/services/userApi";
import { useGetCartQuery } from "@/services/cartApi";

const MobileMenu = () => {
    const router = useRouter();
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const { data: user, isLoading } = useGetProfileQuery(undefined, {
        skip: !token,
    });
    const { data: cartData } = useGetCartQuery(undefined, { skip: !token });

    const cartCount = cartData?.items?.length ?? 0;

    const handleProtectedNavigate = (path: string) => {
        if (!user && !isLoading) {
            router.push("/login");
            return;
        }
        router.push(path);
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
            <SheetContent side="left" className="w-[280px] px-4">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        ShopNova
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
                        <MobileCategoryList />
                    </nav>

                    {/* Mobile Actions */}
                    <div className="flex flex-col gap-2 pt-4 border-t">
                        <SheetClose asChild>
                            <Button
                                variant="outline"
                                className="justify-start gap-2"
                                onClick={() => handleProtectedNavigate("/favourites")}
                            >
                                <Heart className="h-4 w-4" />
                                Wishlist
                            </Button>
                        </SheetClose>

                        <SheetClose asChild>
                            <Button
                                variant="outline"
                                className="justify-start gap-2"
                                onClick={() => handleProtectedNavigate("/carts")}
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Cart ({cartCount})
                            </Button>
                        </SheetClose>

                        <SheetClose asChild>
                            <Button
                                className="justify-start gap-2"
                                onClick={() => handleProtectedNavigate("/profile")}
                            >
                                <User className="h-4 w-4" />
                                {user ? "Account" : "Sign In"}
                            </Button>
                        </SheetClose>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MobileMenu;
