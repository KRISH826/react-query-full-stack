"use client";

import React from "react";
import Link from "next/link";
import CategoryMenu from "./CategoryMenu";
import { usePathname } from "next/navigation";

const menuData = [
    { label: "Home", href: "/" },
    { label: "Product", href: "/product" },
    { label: "About", href: "/about" },
]

const DesktopNav = () => {
    const pathName = usePathname();
    return (
        <nav className="hidden lg:flex items-center gap-4 text-sm font-medium">
            {menuData.map((item) => (
                <Link
                    key={item.label}
                    href={item.href}
                    prefetch={false}
                    className={`text-foreground/70 transition-colors hover:text-foreground hover:bg-accent px-3 py-1.5 rounded-md ${pathName === item.href ? "bg-accent text-primary!" : ""}`}
                >
                    {item.label}
                </Link>
            ))}
            <CategoryMenu />
        </nav>
    );
};

export default DesktopNav;
