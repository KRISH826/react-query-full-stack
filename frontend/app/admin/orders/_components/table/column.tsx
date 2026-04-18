"use client";
import { ColumnDef } from "@tanstack/react-table";
import { FlatOrderItem } from "@/types/order";
import { DeleteAction } from "../common/DeleteDIalog";
import { UpdateStatusAction } from "../common/UpdateStatus";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<FlatOrderItem & { orderId: string }>[] = [
    {
        accessorKey: "ordernumber",
        header: "Order Number",
        cell: ({ row }) => <span className="font-medium text-primary">{row.original.ordernumber}</span>
    },
    {
        accessorKey: "productname",
        header: "Product Name",
        cell: ({ row }) => <span className="font-semibold line-clamp-1 max-w-[200px]" title={row.original.productname}>{row.original.productname}</span>
    },
    {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) => {
            if (!row.original.created_at) return "-";
            const date = new Date(row.original.created_at);
            return <span className="text-muted-foreground text-sm">{date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</span>;
        }
    },
    {
        accessorKey: "quantity",
        header: "Amount",
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => <span className="font-bold tracking-tight">₹{row.original.price?.toLocaleString()}</span>
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant="outline" className="capitalize">
                {row.original.status || "placed"}
            </Badge>
        )
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <UpdateStatusAction orderId={row.original.orderId} itemId={row.original.id} currentStatus={row.original.status || 'placed'} />
                    <DeleteAction orderId={row.original.orderId} itemId={row.original.id} />
                </div>
            )
        }
    }
];
