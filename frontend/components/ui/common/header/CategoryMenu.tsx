"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useGetAllCategoriesQuery } from "@/services/categoryApi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CategoryMenu = () => {
    const { data: categories, isLoading } = useGetAllCategoriesQuery();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-foreground/70 transition-colors hover:text-foreground hover:bg-accent px-3 py-1.5 rounded-md outline-none data-[state=open]:text-foreground data-[state=open]:bg-accent">
                Categories <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-w-[750px] min-w-[550px] max-h-[60vh] overflow-y-auto p-3">
                {isLoading ? (
                    <DropdownMenuItem disabled>Loading categories...</DropdownMenuItem>
                ) : categories && categories.length > 0 ? (
                    <div className="grid grid-cols-3 gap-1">
                        {categories.map((category) => (
                            <DropdownMenuItem key={category.id} asChild className="cursor-pointer w-fit transition-all duration-300 ease-in-out">
                                <Link href={`/categories/${category.id}`}>
                                    {category.name}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </div>
                ) : (
                    <DropdownMenuItem disabled>No categories found</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default CategoryMenu;
