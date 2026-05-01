"use client"

import { useState } from "react"
import {
    useCreatePaymentMutation,
    useVerifyPaymentMutation,
    useCancelPaymentMutation,
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
        if (window.Razorpay) { resolve(); return }
        const intervalId = window.setInterval(() => {
            if (!window.Razorpay) return
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
    const [verifyPayment, { isLoading: isVerifyingPayment }] = useVerifyPaymentMutation()
    const [markPaymentFailed] = useCancelPaymentMutation()
    const [clearCart] = useClearCartMutation()

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
            if (!razorpayKey) throw new Error("Razorpay key is missing")

            await waitForRazorpay()

            const paymentData = await createPayment({ order_id: orderId, amount }).unwrap()
            const razorpayOrderId = paymentData.payment.razorpay_order_id

            // Track if payment.failed fired before ondismiss
            let paymentFailed = false

            const options = {
                key: razorpayKey,
                amount: amount * 100,
                currency: "INR",
                name: "ShopNova",
                description: "Order Payment",
                order_id: razorpayOrderId,

                handler: async (response: RazorpaySuccessResponse) => {
                    // ✅ Payment success
                    try {
                        await verifyPayment({
                            order_id: orderId,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }).unwrap()
                        await clearCart().unwrap()
                        setSuccessData({ orderId, amount })
                        setIsSuccessOpen(true)
                    } catch {
                        toast.error("Verification failed. If amount was debited, your order will confirm automatically.")
                    }
                },

                prefill: {
                    name: userName,
                    email: userEmail,
                    contact: userPhone,
                },
                theme: { color: "#111827" },

                modal: {
                    // NO escape: false — net banking popup needs visibility events to work
                    ondismiss: () => {
                        if (paymentFailed) {
                            // Came back from net banking failure page — already handled
                            return
                        }
                        // Pure dismiss — user closed without paying
                        // Order stays payment_pending → hidden from list, no action needed
                    },
                },
            }

            const rzp = new window.Razorpay(options)

            rzp.on("payment.failed", async (response: RazorpayErrorResponse) => {
                // ❌ Net banking / card failure
                paymentFailed = true
                try {
                    await markPaymentFailed(orderId).unwrap()
                } catch {
                    // webhook handles in production
                }
                toast.error(`Payment failed: ${response.error.description}`)
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