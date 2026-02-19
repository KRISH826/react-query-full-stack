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
import Favourites from "./header/Favourites";
import Cart from "./header/Cart";
import Profile from "./header/Profile";
import SearchInput from "./header/SearchInput";

const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
            <div className="container">
                <div className="flex h-16 items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <span className="text-lg md:text-xl font-semibold tracking-tight">
                            ShopNova
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        {["Home", "Product", "Categories", "About"].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                                className="text-foreground/70 transition-colors hover:text-foreground relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>
                    <SearchInput />
                    {/* Actions */}
                    <div className="flex items-center gap-1 md:gap-2">
                        {/* Wishlist */}
                        <Favourites />

                        {/* Cart */}
                        <Cart />

                        {/* Profile */}
                        <Profile />

                        {/* Mobile Menu */}
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

                                    {/* Mobile Search */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search products..."
                                            className="pl-9"
                                        />
                                    </div>

                                    {/* Mobile Nav */}
                                    <nav className="flex flex-col gap-1">
                                        {["Home", "Products", "Categories", "About"].map(
                                            (item) => (
                                                <Link
                                                    key={item}
                                                    href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                                                    className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-accent-foreground transition-colors"
                                                >
                                                    {item}
                                                </Link>
                                            )
                                        )}
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
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
