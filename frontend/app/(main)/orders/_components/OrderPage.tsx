"use client"

import { useGetOrdersQuery } from '@/services/orderApi'
import { FlatOrderItem, OrderResponseDTO } from '@/types/order'
import { Calendar, PackageX } from 'lucide-react'
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

    if (data?.orders?.length === 0) {
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
            {
                data?.orders?.map((order) => {
                    return (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-3 bg-gray-50 border-b border-gray-200">
                                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                                    <div className="min-w-[80px]">
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                                            Order
                                        </p>
                                        <p className="text-xs font-bold text-gray-800 mt-0.5">
                                            #{order.ordernumber}
                                        </p>
                                    </div>

                                    <div className="w-px h-7 bg-gray-200 hidden sm:block" />

                                    <div className="min-w-[100px]">
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                                            Placed On
                                        </p>
                                        <div className="flex items-center gap-1 text-xs font-medium text-gray-700 mt-0.5">
                                            <Calendar size={11} className="text-gray-400" />
                                            {new Date(order.created_at).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </div>

                                    <div className="w-px h-7 bg-gray-200 hidden sm:block" />

                                    <div className="min-w-[80px]">
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                                            Order Total
                                        </p>
                                        <p className="text-xs font-bold text-gray-800 mt-0.5">
                                            ₹{Number(order.totalamount).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>

                                {/* STATUS BADGE */}
                                {/* <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border",
                    status.color,
                    status.bg,
                    status.border
                )}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                    {status.icon}
                    {status.label}
                </div> */}
                            </div>
                            <div className='space-y-4 divide-y divide-accent'>
                                {order.items.map((item) => (
                                    <OrderItemCard
                                        key={`${order.id}-${item.id}`}
                                        orderId={order.id}
                                        item={item}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                })
            }

            {/* pagination */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-between md:mt-10 mt-8 items-center">
                <p className="text-xs text-muted-foreground order-2 sm:order-1">
                    Page {page} of {totalPages} — {data?.total} products
                </p>
                {
                    totalPages > 1 && (
                        <div className="order-1 sm:order-2 w-full sm:w-auto overflow-x-auto">
                            <Pagination>
                                <PaginationContent className="flex-nowrap">
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
                                                    className="cursor-pointer text-xs sm:text-sm"
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
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default OrderPage