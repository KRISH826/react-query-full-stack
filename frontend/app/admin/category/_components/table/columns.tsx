"use client"

import { Button } from "@/components/ui/button"
import { Category } from "@/types/category"
import {ColumnDef} from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"

export const columns: ColumnDef<Category>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "slug",
        header: "Slug",
    },
    {
        accessorKey: "parent_id",
        header: "Parent Name",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const category = row.original
            return (
                <div className="flex items-center gap-2.5">
                    <Button size={"icon"} onClick={() => console.log("Edit", category.id)}>
                        <Pencil size={16} />
                    </Button>
                    <Button size={"icon"} variant={"destructive"} onClick={() => console.log("Delete", category.id)}>
                        <Trash2 size={16} />
                    </Button>
                </div>
            )
        }
    }
]
