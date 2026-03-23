"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Loader2 } from "lucide-react";
import { useGetAllCategoriesQuery } from "@/services/categoryApi";

const COLORS = [
    "hsl(346, 84%, 50%)",  // rose/pink
    "hsl(24, 95%, 53%)",   // orange
    "hsl(262, 83%, 58%)",  // purple
    "hsl(199, 89%, 48%)",  // blue
    "hsl(142, 71%, 45%)",  // green
    "hsl(346, 84%, 50%)",  // rose again
];

const CategoryMenu = () => {
    const { data: categories, isLoading } = useGetAllCategoriesQuery();
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setIsOpen(false), 80);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div
            ref={menuRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Trigger */}
            <button
                className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-md outline-none transition-colors
                    ${isOpen
                        ? "text-foreground bg-accent"
                        : "text-foreground/70 hover:text-foreground hover:bg-accent"
                    }`}
            >
                Categories
                <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* Mega Menu Panel */}
            {isOpen && (
                <div
                    className="absolute top-full min-w-[500px] max-w-[750px] left-0 mt-1 z-50 bg-white rounded-lg shadow-xl border border-gray-100 animate-in fade-in-0 slide-in-from-top-2 duration-200"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-sm">Loading categories...</span>
                        </div>
                    ) : categories && categories.length > 0 ? (
                        <div className="flex flex-col flex-wrap p-4 gap-0 max-h-[500px]">
                            {categories.map((category, index) => (
                                <div
                                    key={category.id}
                                    className={`flex-1 px-5 ${index !== categories.length - 1
                                        ? "border-r border-secondary"
                                        : ""
                                        }`}
                                >
                                    {/* Parent Category Header */}
                                    <Link
                                        href={`/categories/${category.id}`}
                                        className="inline-block text-sm font-bold uppercase tracking-wide mb-3 pb-1 transition-opacity hover:opacity-70"
                                        style={{ color: COLORS[index % COLORS.length] }}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {category.name}
                                    </Link>

                                    {/* Children List */}
                                    {category.children && category.children.length > 0 && (
                                        <ul className="flex flex-col gap-0.5">
                                            {category.children.map((child) => (
                                                <li key={child.id}>
                                                    <Link
                                                        href={`/categories/${child.id}`}
                                                        className="block text-sm text-gray-600 py-1 rounded transition-all duration-150 hover:text-gray-900 hover:bg-gray-50"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            No categories found
                        </div>
                    )}

                    {/* Bottom strip like Myntra */}
                    <div className="border-t border-secondary bg-secondary/50 rounded-b-lg px-5 py-2.5">
                        <Link
                            href="/categories"
                            className="text-xs font-medium text-primary hover:underline"
                            onClick={() => setIsOpen(false)}
                        >
                            View all categories →
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryMenu;
