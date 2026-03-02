"use client"

import { FlatOrderItem, OrderStatus } from "@/types/order"
import { Calendar, ChevronRight, RefreshCw, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { statusConfig } from "./statusConfig"
import { Button } from "@/components/ui/button"
import { useCancelOrderMutation } from "@/services/orderApi"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Props = {
    item: FlatOrderItem
}


const TRACK_STEPS = ["Placed", "Confirmed", "Shipped", "Delivered"]

const OrderItemCard = ({ item }: Props) => {
    const status = statusConfig[item.status?.toLowerCase() as OrderStatus] ?? statusConfig.placed
    const isCancelledOrRefunded = item.status === "cancelled" || item.status === "refunded"
    const [cancelOrder, { isLoading }] = useCancelOrderMutation();
    const router = useRouter();

    const handleViewProduct = () => {
        router.push(`/product/${item.product_id}`);
    }

    const handleCancelOrder = async () => {
        try {
            await cancelOrder(item.order_id);
            toast.success("Order cancelled successfully");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Failed to cancel order");
            }
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">

            {/* TOP BAR — order meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-wrap items-center gap-5">
                    <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                            Order
                        </p>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">
                            #{item.ordernumber}
                        </p>
                    </div>

                    <div className="w-px h-7 bg-gray-200 hidden sm:block" />

                    <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                            Placed On
                        </p>
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-700 mt-0.5">
                            <Calendar size={11} className="text-gray-400" />
                            {new Date(item.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </div>
                    </div>

                    <div className="w-px h-7 bg-gray-200 hidden sm:block" />

                    <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                            Order Total
                        </p>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">
                            ₹{Number(item.totalamount).toLocaleString("en-IN")}
                        </p>
                    </div>
                </div>

                {/* STATUS BADGE */}
                <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border",
                    status.color,
                    status.bg,
                    status.border
                )}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                    {status.icon}
                    {status.label}
                </div>
            </div>

            {/* PRODUCT ROW */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4">
                <div className="flex gap-4 items-start">
                    {/* IMAGE */}
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                        <Image
                            onClick={handleViewProduct}
                            src={item.image_url || "/placeholder-product.png"}
                            alt={item.productname}
                            fill
                            className="object-cover cursor-pointer"
                        />
                        {/* qty badge */}
                        {item.quantity > 1 && (
                            <div className="absolute top-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                ×{item.quantity}
                            </div>
                        )}
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="space-y-1.5 pt-0.5">
                        <p className="font-semibold text-sm text-gray-900 leading-snug line-clamp-2">
                            {item.productname}
                        </p>
                        <p className="text-xs text-gray-500">
                            Brand: <span className="font-medium text-gray-700">{item.product_brand}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                            Qty: <span className="font-medium text-gray-700">{item.quantity}</span>
                        </p>
                        {item.size && (
                            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                                Size: {item.size}
                            </span>
                        )}
                        <div className="flex items-baseline gap-1.5 pt-0.5">
                            <p className="text-xs text-gray-400 line-through">
                                ₹{(Number(item.price) * 1.1).toFixed(0)}
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                                ₹{Number(item.price).toLocaleString("en-IN")}
                            </p>
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                10% off
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT — subtotal + action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-2 shrink-0 sm:min-w-[130px]">
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Subtotal</p>
                        <p className="text-lg font-bold text-gray-900">
                            ₹{Number(item.subtotal).toLocaleString("en-IN")}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={item.status === "cancelled" || item.status === "refunded" ? `/product/${item.product_id}` : `/orders/${item.order_id}`}
                            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg whitespace-nowrap"
                        >
                            {item.status === "cancelled" || item.status === "refunded" ? "Re-Order" : "Track Order"}
                            <ChevronRight size={13} />
                        </Link>
                        {
                            item.status !== "cancelled" && item.status !== "refunded" && (
                                <Button disabled={isLoading} onClick={handleCancelOrder} variant={"destructive"} size={"sm"} className="text-xs! cursor-pointer">
                                    {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                    {isLoading ? "Cancelling..." : "Cancel Order"}
                                </Button>
                            )
                        }
                    </div>
                </div>
            </div>

            {/* TRACKING BAR — only for active orders */}
            {
                !isCancelledOrRefunded && (
                    <div className="px-5 pb-4 pt-1">
                        <div className="flex items-center gap-0">
                            {TRACK_STEPS.map((step, idx) => {
                                const stepNum = idx + 1
                                const isCompleted = status.track >= stepNum
                                const isActive = status.track === stepNum

                                return (
                                    <div key={step} className="flex items-center flex-1 last:flex-none">
                                        {/* DOT */}
                                        <div className="flex flex-col items-center gap-1">
                                            <div className={cn(
                                                "h-2.5 w-2.5 rounded-full border-2 transition-all",
                                                isCompleted
                                                    ? "bg-gray-900 border-gray-900"
                                                    : "bg-white border-gray-300",
                                                isActive && "ring-2 ring-gray-900/20"
                                            )} />
                                            <p className={cn(
                                                "text-[9px] font-semibold whitespace-nowrap",
                                                isCompleted ? "text-gray-900" : "text-gray-400"
                                            )}>
                                                {step}
                                            </p>
                                        </div>

                                        {/* LINE */}
                                        {idx < TRACK_STEPS.length - 1 && (
                                            <div className={cn(
                                                "flex-1 h-0.5 mx-1 mb-3.5 rounded-full transition-all",
                                                status.track > stepNum ? "bg-gray-900" : "bg-gray-200"
                                            )} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            }

            {/* CANCELLED / REFUNDED NOTE */}
            {
                isCancelledOrRefunded && (
                    <div className={cn(
                        "mx-5 mb-4 px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2",
                        status.bg, status.color
                    )}>
                        {status.icon}
                        {item.status === "cancelled"
                            ? "This item was cancelled and will not be delivered."
                            : "Refund has been initiated for this item."}
                    </div>
                )
            }
        </div >
    )
}

export default OrderItemCard