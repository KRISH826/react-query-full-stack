import { OrderStatus } from "@/types/order"
import { Clock, CheckCircle2, Truck, XCircle, RefreshCw } from "lucide-react"

export const statusConfig: Record<OrderStatus, {
    color: string
    bg: string
    border: string
    dot: string
    label: string
    icon: React.ReactNode
    track: number // 0-4 progress steps
}> = {
    placed: {
        color: "text-blue-700",
        bg: "bg-blue-50",
        border: "border-blue-200",
        dot: "bg-blue-500",
        label: "Order Placed",
        icon: <Clock size={13} />,
        track: 1,
    },
    confirmed: {
        color: "text-violet-700",
        bg: "bg-violet-50",
        border: "border-violet-200",
        dot: "bg-violet-500",
        label: "Confirmed",
        icon: <CheckCircle2 size={13} />,
        track: 2,
    },
    shipped: {
        color: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        dot: "bg-amber-500",
        label: "Shipped",
        icon: <Truck size={13} />,
        track: 3,
    },
    delivered: {
        color: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
        label: "Delivered",
        icon: <CheckCircle2 size={13} />,
        track: 4,
    },
    cancelled: {
        color: "text-rose-700",
        bg: "bg-rose-50",
        border: "border-rose-200",
        dot: "bg-rose-500",
        label: "Cancelled",
        icon: <XCircle size={13} />,
        track: 0,
    },
    refunded: {
        color: "text-orange-700",
        bg: "bg-orange-50",
        border: "border-orange-200",
        dot: "bg-orange-500",
        label: "Refunded",
        icon: <RefreshCw size={13} />,
        track: 0,
    },
}