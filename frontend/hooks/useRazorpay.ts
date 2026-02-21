"use client"

import { useState } from "react"
import { useCancelOrderMutation, useCreatePaymentMutation, useVerifyPaymentMutation } from "@/services/orderApi"
import { toast } from "sonner"

declare global {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface Window { Razorpay: any }
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

export const useRazorpay = () => {
    const [createPayment, { isLoading: isCreatingPayment }] = useCreatePaymentMutation()
    const [verifyPayment, { isLoading: isVerifyingPayment }] = useVerifyPaymentMutation()
    const [cancelOrder] = useCancelOrderMutation()

    // ✅ Modal state hook ke andar
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
            // Step 1 — Backend pe payment order banao
            const paymentData = await createPayment({
                order_id: orderId,
                amount,
            }).unwrap()

            const razorpayOrderId = paymentData.payment.razorpay_order_id
            // Step 2 — Razorpay modal open karo
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: amount * 100,
                currency: "INR",
                name: "ShopNova",
                description: "Order Payment",
                order_id: razorpayOrderId,

                handler: async (response: {
                    razorpay_order_id: string
                    razorpay_payment_id: string
                    razorpay_signature: string
                }) => {
                    try {
                        // Step 3 — Verify karo
                        await verifyPayment({
                            order_id: orderId,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }).unwrap()

                        // ✅ Success modal open karo
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
                    ondismiss: async () => {
                        await cancelOrder(orderId).unwrap()
                        toast.warning("Payment cancelled. Order has been cancelled.")
                    },
                },
            }

            const rzp = new window.Razorpay(options)

            rzp.on("payment.failed", async (response: RazorpayErrorResponse) => {
                await cancelOrder(orderId).unwrap()
                toast.error(`Payment failed: ${response.error.description}. Order has been cancelled.`)
            })


            rzp.open()

        } catch (error) {
            toast.error("Failed to initiate payment. Please try again.")
            throw error
        }
    }

    return {
        initiatePayment,
        isLoading: isCreatingPayment || isVerifyingPayment,
        // ✅ modal state expose karo
        isSuccessOpen,
        successData,
        closeSuccess,
    }
}