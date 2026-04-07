"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Product, ProductStatus } from "@/types/product"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import DeleteProduct from "../common/DeleteProduct"

const ActionCell = ({ product }: { product: Product }) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Button size="icon" className="h-8 w-8" asChild>
        <Link href={`/admin/product/${product.id}`}>
          <Pencil size={14} />
        </Link>
      </Button>

      <Button
        size="icon"
        variant="destructive"
        className="h-8 w-8"
        onClick={() => setDeleteDialogOpen(true)}
      >
        <Trash2 size={14} />
      </Button>

      <DeleteProduct
        name={product.productname}
        id={product.id}
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  )
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "productname",
    header: "Product",
    cell: ({ row }) => <span className="font-semibold">{row.original.productname}</span>
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge className="capitalize rounded-md! px-3!" variant={status === ProductStatus.ACTIVE ? "default" : "secondary"}>
          {status}
        </Badge>
      )
    }
  },
  {
    accessorKey: "total_reviews",
    header: "Reviews",
  },
  {
    accessorKey: "is_track_inventory",
    header: "Inventory Track",
    cell: ({ row }) => (
      <span className={row.original.is_track_inventory ? "text-green-600" : "text-amber-600"}>
        {row.original.is_track_inventory ? "Enabled" : "Disabled"}
      </span>
    )
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell product={row.original} />
  }
]