"use client"

import React from "react"
import { CheckCircle2, ArrowRight, ShoppingBag, Package } from "lucide-react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface PaymentSuccessDialogProps {
    isOpen: boolean
    onClose: () => void
    orderId: string
    amount: number
}

export const PaymentSuccessDialog = ({
    isOpen,
    onClose,
    orderId,
    amount,
}: PaymentSuccessDialogProps) => {
    const router = useRouter()

    const handleViewOrders = () => {
        onClose()
        router.push("/orders")
    }

    const handleContinueShopping = () => {
        onClose()
        router.push("/products")
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-sm p-4 border-0 rounded-2xl overflow-hidden shadow-xl">
                {/* TOP — clean white success area */}
                <div className="bg-white shadow-sm rounded-lg px-8 pt-10 pb-6 flex flex-col items-center text-center">

                    {/* Icon */}
                    <div className="relative mb-5">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500 fill-emerald-50" strokeWidth={2} />
                        </div>
                        {/* subtle ring */}
                        <div className="absolute inset-0 rounded-full ring-4 ring-emerald-100 animate-ping opacity-30" />
                    </div>

                    <AlertDialogHeader className="items-center justify-center text-center bg-white">
                        <p className="text-xs text-center font-semibold uppercase tracking-widest text-emerald-500 mb-1">
                            Payment Confirmed
                        </p>
                        <AlertDialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                            Order Placed!
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-400 mt-1.5 leading-relaxed">
                            Your payment was successful and your order is now being processed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>

                {/* DIVIDER with amount */}
                <div className="bg-white shadow-sm rounded-lg border-y border-gray-100 px-8 py-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Amount Paid</span>
                        <span className="text-lg font-bold text-gray-900">
                            ₹{Number(amount).toLocaleString("en-IN")}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Order ID</span>
                        <div className="flex items-center gap-1.5">
                            <Package size={12} className="text-gray-400" />
                            <span className="text-xs font-mono font-medium text-gray-600 truncate max-w-[160px]">
                                {orderId}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="bg-white shadow-sm rounded-lg px-8 py-6 flex flex-col gap-2.5">
                    <Button
                        onClick={handleViewOrders}
                        className="w-full h-11"
                    >
                        View My Orders
                        <ArrowRight className="ml-1.5 w-4 h-4" />
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleContinueShopping}
                        className="w-full h-11"
                    >
                        <ShoppingBag className="mr-1.5 w-4 h-4" />
                        Continue Shopping
                    </Button>
                </div>

            </AlertDialogContent>
        </AlertDialog>
    )
}