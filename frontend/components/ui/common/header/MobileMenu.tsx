"use client";

import React from "react";
import Link from "next/link";
import {
    Search,
    ShoppingBag,
    User,
    Heart,
    Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import MobileCategoryList from "./MobileCategoryList";

const MobileMenu = () => {
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
                        {["Home", "Products", "About"].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                        <MobileCategoryList />
                    </nav>

                    {/* Mobile Actions */}
                    <div className="flex flex-col gap-2 pt-4 border-t">
                        <Button variant="outline" className="justify-start gap-2">
                            <Heart className="h-4 w-4" />
                            Wishlist
                        </Button>

                        <Button variant="outline" className="justify-start gap-2">
                            <ShoppingBag className="h-4 w-4" />
                            Cart (3)
                        </Button>

                        <Button className="justify-start gap-2">
                            <User className="h-4 w-4" />
                            Account
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MobileMenu;
