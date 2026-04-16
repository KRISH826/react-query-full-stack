"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import Favourites from "./header/Favourites";
import Cart from "./header/Cart";
import Profile from "./header/Profile";
import SearchInput from "./header/SearchInput";
import MobileMenu from "./header/MobileMenu";

const Header = () => {
    const scrollHeader = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                scrollHeader.current?.classList.add("shadow-md");
            } else {
                scrollHeader.current?.classList.remove("shadow-md");
            }
        }
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <header ref={scrollHeader} className="sticky top-0 z-50 w-full bg-background transition-all duration-300">
            <div className="container">
                <div className="flex h-16 items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <span className="text-lg md:text-xl font-semibold tracking-tight">
                            ShopNova
                        </span>
                    </Link>

                    {/* Search — takes up the center */}
                    <SearchInput />

                    {/* Actions — icon + label like Amazon */}
                    <div className="flex items-center gap-1">
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
