"use client";
import { useGetCartQuery } from '@/services/cartApi'
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useRazorpay } from '@/hooks/useRazorpay';
import { PaymentSuccessDialog } from '@/components/payment/PaymentSuccessDialog';
import { OrderResponseDTO } from '@/types/order';


const OrderSummary = () => {
    const { data, isLoading } = useGetCartQuery();
    const router = useRouter();
    const pathname = usePathname();
    const isCheckoutPage = pathname === "/checkout";

    const {
        initiatePayment,
        isLoading: isPaymentLoading,
        isSuccessOpen,
        successData,
        closeSuccess
    } = useRazorpay();

    useEffect(() => {
        const handleOrderCreated = (event: Event) => {
            const customEvent = event as CustomEvent<{
                order: OrderResponseDTO;
                userData: { name: string; email: string; phone: string };
            }>;
            const { order, userData } = customEvent.detail;
            initiatePayment({
                orderId: order.id,
                amount: order.totalamount,
                userName: userData.name || "Customer",
                userEmail: userData.email,
                userPhone: userData.phone
            });
        };

        window.addEventListener('ORDER_CREATED', handleOrderCreated as EventListener);
        return () => window.removeEventListener('ORDER_CREATED', handleOrderCreated as EventListener);
    }, [initiatePayment]);

    return (
        <div className="rounded-xl bg-secondary/15 border border-gray-200 p-4 h-fit sticky top-20">
            <h2 className="text-base md:text-lg font-medium text-gray-900 mb-6">
                Order Summary
            </h2>
            <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">
                        ₹{data?.total}
                    </span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">
                        Free
                    </span>
                </div>
                <div className="border-t pt-4 flex justify-between text-sm md:text-base font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{data?.total}</span>
                </div>
            </div>

            {isCheckoutPage ? (
                <button
                    type="submit"
                    form="checkout-form"
                    disabled={isPaymentLoading}
                    className="mt-6 cursor-pointer w-full bg-primary text-white rounded-lg py-3 text-sm font-medium transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPaymentLoading ? "Processing..." : "Place Order"}
                </button>
            ) : (
                <button
                    onClick={() => router.push("/checkout")}
                    disabled={isLoading || !data?.items || data.items.length === 0}
                    className="mt-6 cursor-pointer w-full bg-primary text-white rounded-lg py-3 text-sm font-medium transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Checking cart..." : "Proceed to Checkout"}
                </button>
            )}

            <p className="text-[11px] md:text-sm text-gray-500 mt-4 text-center">
                Taxes calculated at checkout.
            </p>

            {/* Success Dialog */}
            {successData && (
                <PaymentSuccessDialog
                    isOpen={isSuccessOpen}
                    onClose={closeSuccess}
                    orderId={successData.orderId}
                    amount={successData.amount}
                />
            )}
        </div>
    )
}

export default OrderSummary
