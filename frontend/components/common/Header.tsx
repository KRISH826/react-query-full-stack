"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">ShopNova</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6 text-base font-medium">
                        {[
                            { name: "Home", href: "/" },
                            { name: "Products", href: "/product" },
                            { name: "Categories", href: "/categories" },
                            { name: "About", href: "/about" },
                        ].map((link, index) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`transition-colors hover:text-foreground/80 ${index === 0 ? "text-foreground" : "text-foreground/60"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Search Bar (Hidden on small mobile) */}
                    <div className="hidden md:flex flex-1 max-w-sm items-center gap-2">
                        <div className="relative w-full">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                className="w-full bg-background pl-8 md:w-[300px] lg:w-[300px]"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <Button variant="ghost" size="icon" className="hidden sm:flex" aria-label="Wishlist">
                            <Heart className="w-6 h-6" />
                            <span className="sr-only">Wishlist</span>
                        </Button>

                        <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
                            <ShoppingBag className="w-6 h-6" />
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                3
                            </span>
                            <span className="sr-only">Cart</span>
                        </Button>

                        <Button variant="ghost" size="icon" aria-label="User account">
                            <User className="w-6 h-6" />
                            <span className="sr-only">Account</span>
                        </Button>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t bg-background">
                    <div className="container py-4 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                className="w-full bg-background pl-8"
                            />
                        </div>
                        <nav className="flex flex-col gap-2">
                            <Link
                                href="/"
                                className="px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/product"
                                className="px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Products
                            </Link>
                            <Link
                                href="/categories"
                                className="px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Categories
                            </Link>
                            <Link
                                href="/about"
                                className="px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;