"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import Favourites from "./header/Favourites";
import Cart from "./header/Cart";
import Profile from "./header/Profile";
import SearchInput from "./header/SearchInput";
import DesktopNav from "./header/DesktopNav";
import MobileMenu from "./header/MobileMenu";

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

                    {/* Desktop Navigation */}
                    <DesktopNav />

                    <SearchInput />

                    {/* Actions */}
                    <div className="flex items-center gap-0.5">
                        {/* Wishlist */}
                        <Favourites />
                        {/* Cart */}
                        <Cart />
                        {/* Profile */}
                        <Profile />

                        {/* Mobile Menu */}
                        <MobileMenu />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
