"use client";

import { Button } from "@/components/ui/button";
import { useGetCartQuery } from "@/services/cartApi";
import { usePathname, useRouter } from "next/navigation";

const OrderSummary = () => {
    const { data } = useGetCartQuery();
    const router = useRouter();
    const pathname = usePathname();
    const isCheckoutPage = pathname === "/checkout";

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
                <Button
                    type="submit"
                    form="checkout-form"
                    className="mt-6 w-full bg-primary text-white rounded-lg py-3 text-sm font-medium"
                >
                    Place Order
                </Button>
            ) : (
                <Button onClick={() => router.push("/checkout")}>
                    Proceed to Checkout
                </Button>
            )}

            <p className="text-[11px] md:text-sm text-gray-500 mt-4 text-center">
                Taxes calculated at checkout.
            </p>
        </div>
    );
};

export default OrderSummary;
