"use client"

import { useGetOrdersQuery } from '@/services/orderApi'
import { FlatOrderItem, OrderResponseDTO } from '@/types/order'
import { PackageX } from 'lucide-react'
import OrderItemCard from './OrderItems'
import { Spinner } from '@/components/ui/spinner'

const OrderPage = () => {
    const { data, isLoading, isError } = useGetOrdersQuery()

    // ✅ flatten orders → individual items with order info
    const flatItems: FlatOrderItem[] = data?.flatMap((order: OrderResponseDTO) =>
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
        </div>
    )
}

export default OrderPage