"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { columns } from "./column";
import { useGetAllOrdersQuery } from "@/services/orderApi";
import { FlatOrderItem } from "@/types/order";

export function OrderTable({ searchTerm }: { searchTerm: string }) {
    const { data: orders, isLoading, isError } = useGetAllOrdersQuery();

    const data = React.useMemo(() => {
        if (!orders) return [];
        const flattened: (FlatOrderItem & { orderId: string })[] = [];
        orders.forEach(order => {
            if (order.items && order.items.length > 0) {
                order.items.forEach(item => {
                    const flatItem = {
                        ...item,
                        ordernumber: order.ordernumber,
                        status: item.status || order.status,
                        created_at: order.created_at,
                        totalamount: order.totalamount,
                        orderId: order.id
                    };
                    flattened.push(flatItem as FlatOrderItem & { orderId: string });
                });
            }
        });
        
        if (searchTerm) {
             return flattened.filter(item => 
                 item.ordernumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 item.productname.toLowerCase().includes(searchTerm.toLowerCase())
             );
        }
        return flattened;
    }, [orders, searchTerm]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    if (isError) {
        return <div className="p-4 text-destructive">Failed to load orders. Please try again.</div>;
    }

    return (
        <div className="w-full overflow-hidden">
            <Table className="min-w-full border-collapse border-0">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="hover:bg-transparent">
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    className="bg-secondary/40 border-b border-secondary/70 font-bold text-sm uppercase tracking-wider whitespace-nowrap"
                                    key={header.id}
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={columns.length} className="py-4">
                                    <Skeleton className="h-6 w-full opacity-50" />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="transition-colors border-b last:border-0 hover:bg-muted/50"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell className="py-3 px-4 text-base" key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                                No order items found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
