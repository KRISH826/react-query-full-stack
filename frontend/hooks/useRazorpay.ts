"use client"

import { useState } from "react"
import {
    useCancelOrderMutation,
    useCreatePaymentMutation,
    useVerifyPaymentMutation,
} from "@/services/orderApi"
import { toast } from "sonner"
import { useClearCartMutation } from "@/services/cartApi"

declare global {
    interface Window {
        Razorpay: new (options: Record<string, unknown>) => {
            open: () => void
            on: (event: string, callback: (response: RazorpayErrorResponse) => void) => void
        }
    }
}

interface RazorpayOptions {
    orderId: string
    amount: number
    userName: string
    userEmail: string
    userPhone: string
}

interface PaymentSuccess {
    orderId: string
    amount: number
}

interface RazorpayErrorResponse {
    error: {
        code: string
        description: string
        source: string
        step: string
        reason: string
        metadata: {
            order_id: string
            payment_id?: string
        }
    }
}

interface RazorpaySuccessResponse {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
}

const waitForRazorpay = (timeoutMs = 10000) =>
    new Promise<void>((resolve, reject) => {
        if (typeof window === "undefined") {
            reject(new Error("Razorpay is only available in the browser"))
            return
        }

        if (window.Razorpay) {
            resolve()
            return
        }

        const intervalId = window.setInterval(() => {
            if (!window.Razorpay) {
                return
            }

            window.clearInterval(intervalId)
            window.clearTimeout(timeoutId)
            resolve()
        }, 100)

        const timeoutId = window.setTimeout(() => {
            window.clearInterval(intervalId)
            reject(new Error("Razorpay SDK failed to load"))
        }, timeoutMs)
    })

export const useRazorpay = () => {
    const [createPayment, { isLoading: isCreatingPayment }] = useCreatePaymentMutation()
    const [verifyPayment, { isLoading: isVerifyingPayment }] = useVerifyPaymentMutation();
    const [clearCart] = useClearCartMutation();
    const [cancelOrder] = useCancelOrderMutation()

    const [successData, setSuccessData] = useState<PaymentSuccess | null>(null)
    const [isSuccessOpen, setIsSuccessOpen] = useState(false)

    const closeSuccess = () => {
        setIsSuccessOpen(false)
        setSuccessData(null)
    }

    const initiatePayment = async ({
        orderId,
        amount,
        userName,
        userEmail,
        userPhone,
    }: RazorpayOptions) => {
        try {
            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
            if (!razorpayKey) {
                throw new Error("Razorpay key is missing")
            }

            await waitForRazorpay()

            const paymentData = await createPayment({
                order_id: orderId,
                amount,
            }).unwrap()

            const razorpayOrderId = paymentData.payment.razorpay_order_id
            let paymentCompleted = false
            let cancellationRequested = false

            const cancelPendingOrder = async (message: string, variant: "warning" | "error") => {
                if (paymentCompleted || cancellationRequested) {
                    return
                }
                cancellationRequested = true
                try {
                    await cancelOrder(orderId).unwrap()
                } catch {
                    // Preserve the payment interruption message even if cancellation fails.
                }

                if (variant === "error") {
                    toast.error(message)
                    return
                }

                toast.warning(message)
            }

            const options = {
                key: razorpayKey,
                amount: amount * 100,
                currency: "INR",
                name: "ShopNova",
                description: "Order Payment",
                order_id: razorpayOrderId,
                handler: async (response: RazorpaySuccessResponse) => {
                    try {
                        await verifyPayment({
                            order_id: orderId,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }).unwrap()

                        paymentCompleted = true
                        await clearCart().unwrap(); // ✅ move here

                        setSuccessData({ orderId, amount })
                        setIsSuccessOpen(true)
                    } catch {
                        toast.error("Payment verification failed. Please contact support.")
                    }
                },
                prefill: {
                    name: userName,
                    email: userEmail,
                    contact: userPhone,
                },
                theme: {
                    color: "#111827",
                },
                modal: {
                    ondismiss: () => {
                        toast.warning("Not Added Order Items")
                    },
                },
            }

            const rzp = new window.Razorpay(options)

            rzp.on("payment.failed", (response: RazorpayErrorResponse) => {
                toast.warning(`Payment failed: ${response.error.description}`)
            })

            rzp.open()
        } catch (error) {
            console.error("[useRazorpay] Payment initiation failed:", error)
            toast.error("Failed to initiate payment. Please try again.")
            throw error
        }
    }

    return {
        initiatePayment,
        isLoading: isCreatingPayment || isVerifyingPayment,
        isSuccessOpen,
        successData,
        closeSuccess,
    }
}
