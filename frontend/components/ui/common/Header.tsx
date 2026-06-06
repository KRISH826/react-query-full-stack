"use client";

import React, { useRef, useEffect } from "react";
import Favourites from "./header/Favourites";
import Cart from "./header/Cart";
import Profile from "./header/Profile";
import SearchInput from "./header/SearchInput";
import MobileMenu from "./header/MobileMenu";
import BrandLogo from "@/components/branding/BrandLogo";
import DesktopNav from "./header/DesktopNav";

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
                {/* Top Row: Logo + Nav + Search + Actions */}
                <div className="flex h-16 items-center justify-between gap-4">
                    <div className="flex items-center gap-6 lg:gap-8 shrink-0">
                        <BrandLogo compact showTagline={false} />
                        <DesktopNav />
                    </div>
                    
                    {/* Search — hidden on mobile in this row, visible in bottom row */}
                    <div className="hidden md:flex flex-1 justify-end lg:justify-center max-w-2xl">
                        <SearchInput />
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                        <Favourites />
                        <Cart />
                        <Profile />
                        <MobileMenu />
                    </div>
                </div>

                {/* Bottom Row: Search (Mobile Only) */}
                <div className="pb-3 md:hidden">
                    <SearchInput />
                </div>
            </div>
        </header>
    );
};

export default Header;
