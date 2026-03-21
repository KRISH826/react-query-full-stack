"use client"

import { useGetOrdersQuery } from '@/services/orderApi'
import { FlatOrderItem, OrderResponseDTO } from '@/types/order'
import { PackageX } from 'lucide-react'
import OrderItemCard from './OrderItems'
import { Spinner } from '@/components/ui/spinner'
import { usePagination } from '@/hooks/usePagination'
import { useState } from 'react'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

const OrderPage = () => {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useGetOrdersQuery({ page, limit: 10 });
    const totalPages = data?.totalPages ?? 1;
    const pages = usePagination(page, totalPages);

    // ✅ flatten orders → individual items with order info
    const flatItems: FlatOrderItem[] = data?.orders?.flatMap((order: OrderResponseDTO) =>
        order.items.map((item) => ({
            ...item,
            ordernumber: order.ordernumber,
            status: order.status,
            created_at: order.created_at,
            totalamount: order.totalamount,
            order_id: order.id,
        }))
    ) ?? []

    if (isLoading) {
        return (
            <div className="flex h-80 border border-gray-200 rounded-lg items-center justify-center">
                <Spinner className="h-12 w-12" />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col h-80 items-center justify-center border border-gray-200 rounded-lg gap-3">
                <PackageX className="h-10 w-10 text-rose-400" />
                <p className="text-slate-900 text-lg font-medium">
                    Failed to load orders. Please try again.
                </p>
            </div>
        )
    }

    if (flatItems.length === 0) {
        return (
            <div className="flex flex-col h-80 items-center justify-center border border-gray-200 rounded-lg gap-3">
                <PackageX className="h-10 w-10 text-muted-foreground" />
                <p className="text-slate-900 text-lg font-medium capitalize">
                    No orders found
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-5">
            {flatItems.map((item) => (
                <OrderItemCard
                    key={`${item.order_id}-${item.product_id}`}  // ✅ stable unique key
                    item={item}
                />
            ))}

            {/* pagination */}
            <div className="flex gap-4 w-full justify-between md:mt-10 mt-6 items-center">
                <p className="text-xs flex-1 text-muted-foreground">
                    Page {page} of {totalPages} — {data?.total} products
                </p>
                {
                    totalPages > 1 && <>
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>

                                {pages.map((p, idx) =>
                                    p === "ellipsis" ? (
                                        <PaginationItem key={`ellipsis-${idx}`}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    ) : (
                                        <PaginationItem key={p}>
                                            <PaginationLink
                                                isActive={p === page}
                                                onClick={() => setPage(p)}
                                                className="cursor-pointer"
                                            >
                                                {p}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>


                    </>
                }
            </div>
        </div>
    )
}

export default OrderPage