"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useGetAllCategoriesQuery } from "@/services/categoryApi";
import { Category } from "@/types/category";

const MobileCategoryList = () => {
    const { data: categories, isLoading } = useGetAllCategoriesQuery();

    const grouped = useMemo(() => {
        if (!categories) return [];

        const parentCategories = categories.filter(
            (c) => !c.parent_id || c.parent_id === ""
        );
        const childMap = new Map<string, Category[]>();

        categories.forEach((c) => {
            if (c.parent_id && c.parent_id !== "") {
                const existing = childMap.get(c.parent_id) || [];
                existing.push(c);
                childMap.set(c.parent_id, existing);
            }
        });

        return parentCategories.map((parent) => ({
            parent,
            children: childMap.get(parent.id) || [],
        }));
    }, [categories]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center px-3 py-2 text-sm font-medium text-foreground/80">
                Categories
            </div>
            <div className="flex flex-col pl-4 gap-2">
                {isLoading ? (
                    <span className="text-sm text-muted-foreground px-3 py-1">Loading...</span>
                ) : grouped.length > 0 ? (
                    grouped.map(({ parent, children }) => (
                        <div key={parent.id} className="flex flex-col gap-0.5">
                            <Link
                                href={`/categories/${parent.id}`}
                                className="px-3 py-1 text-sm font-semibold text-primary hover:underline"
                            >
                                {parent.name}
                            </Link>
                            {children.map((child) => (
                                <Link
                                    key={child.id}
                                    href={`/categories/${child.id}`}
                                    className="rounded-lg px-6 py-1.5 text-sm text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                                    {child.name}
                                </Link>
                            ))}
                        </div>
                    ))
                ) : (
                    <span className="text-sm text-muted-foreground px-3 py-1">No categories</span>
                )}
            </div>
        </div>
    );
};

export default MobileCategoryList;
