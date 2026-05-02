"use client"

import React from "react"
import { CheckCircle2, ArrowRight, ShoppingBag, Package, Truck, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, useParams } from "next/navigation"
import { useGetOrderByIdQuery } from "@/services/orderApi"
import { Skeleton } from "@/components/ui/skeleton"

const OrderSuccessPage = () => {
    const router = useRouter()
    const params = useParams()
    const orderId = params.id as string

    const { data: order, isLoading } = useGetOrderByIdQuery(orderId)

    const handleViewOrders = () => {
        router.push("/orders")
    }

    const handleContinueShopping = () => {
        router.push("/categories")
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full space-y-4">
                    <Skeleton className="h-64 w-full rounded-2xl" />
                    <Skeleton className="h-32 w-full rounded-2xl" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <p className="text-gray-500">Order not found.</p>
                    <Button onClick={() => router.push("/")}>Return Home</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4 md:p-8">
            <div className="max-w-md w-full space-y-6">

                {/* SUCCESS CARD */}
                <div className="bg-white rounded-3xl shadow-xl shadow-emerald-500/5 overflow-hidden border border-gray-100">
                    <div className="p-8 md:p-10 flex flex-col items-center text-center">

                        {/* ANIMATED ICON */}
                        <div className="relative mb-6">
                            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center relative z-10">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500 fill-emerald-50" strokeWidth={2} />
                            </div>
                            <div className="absolute inset-0 rounded-full ring-8 ring-emerald-100 animate-ping opacity-30" />
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">
                                Payment Successful
                            </p>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                Order Confirmed!
                            </h1>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-[280px] mx-auto">
                                Thank you for your purchase. Your order has been placed and is being processed.
                            </p>
                        </div>
                    </div>

                    {/* ORDER SUMMARY STRIP */}
                    <div className="px-8 py-6 bg-gray-50 border-y border-gray-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Package size={14} />
                                <span className="text-xs font-semibold uppercase tracking-wider">Order ID</span>
                            </div>
                            <span className="text-xs font-mono font-bold text-gray-900 bg-white px-2 py-1 rounded border border-gray-200">
                                #{orderId?.slice(-8).toUpperCase()}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Truck size={14} />
                                <span className="text-xs font-semibold uppercase tracking-wider">Estimated Delivery</span>
                            </div>
                            <span className="text-xs font-bold text-gray-900">
                                3-5 Business Days
                            </span>
                        </div>

                        <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-900">Total Paid</span>
                            <span className="text-xl font-black text-gray-900">
                                ₹{Number(order?.totalamount || 0).toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="p-8 space-y-3">
                        <Button
                            onClick={handleViewOrders}
                            className="w-full h-12 text-sm font-bold rounded-xl shadow-lg shadow-gray-900/10"
                        >
                            View Order Status
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={handleContinueShopping}
                            className="w-full h-12 text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                        >
                            <ShoppingBag className="mr-2 w-4 h-4" />
                            Continue Shopping
                        </Button>
                    </div>
                </div>

                {/* FOOTER NOTE */}
                <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                    <Calendar size={12} />
                    A confirmation email has been sent to your inbox.
                </p>
            </div>
        </div>
    )
}

export default OrderSuccessPage
