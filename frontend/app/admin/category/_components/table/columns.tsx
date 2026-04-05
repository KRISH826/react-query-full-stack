"use client"

import { Button } from "@/components/ui/button"
import { Category } from "@/types/category"
import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2, ChevronRight, ChevronDown } from "lucide-react"
import { DeleteCategoryDialog } from "../common/DeleteCategory"
import AddEditCategory from "../common/AddEditCategory"
import { useState } from "react"
import { set } from "zod/v3"

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row, getValue }) => {
      const hasChildren = row.getCanExpand();
      const isExpanded = row.getIsExpanded();
      const isRoot = row.depth === 0;

      return (
        <div
          style={{ paddingLeft: `${row.depth * 20}px` }} 
          className="flex items-center gap-0.5"
        >
          {hasChildren && (
            <button className="p-1"
              onClick={row.getToggleExpandedHandler()}
            >
              {isExpanded ? (
                <ChevronDown size={16} className="text-primary" />
              ) : (
                <ChevronRight size={16} className="text-primary" />
              )}
            </button>
          )}
          <span className={`ml-1 ${isRoot ? "font-medium text-base" : "text-sm text-primary font-normal italic"}`}>
            {getValue<string>()}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ getValue }) => (
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-light">
        {getValue<string>()}
      </code>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original;
      const [dialogOpen, setDialogOpen] = useState(false);
      const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
      const handleEdit = () => {
        setSelectedCategory(category);
        setDialogOpen(true);
      }
      // FIX: Seedha return karo, kisi function ke andar wrap mat karo
      return (
        <div className="flex items-center gap-2">
          <Button 
            size="icon" 
            className="h-8 w-8 cursor-pointer"
            onClick={handleEdit}
          >
            <Pencil size={14} />
          </Button>
          <AddEditCategory onOpenChange={setDialogOpen} open={dialogOpen} initialData={selectedCategory} />
          {/* Delete Dialog yahan render hoga */}
          <DeleteCategoryDialog id={category.id} />
        </div>
      )
    }
  }
]