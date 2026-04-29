"use client";

import { Button } from "@/components/ui/button";
import { useGetCartQuery } from "@/services/cartApi";
import { RootState } from "@/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

const OrderSummary = () => {
    const searchParams = useSearchParams();
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const { data } = useGetCartQuery(undefined, { skip: !token });
    const router = useRouter();
    const pathname = usePathname();

    const isBuyNow = searchParams.has("productId")
    const isCheckoutPage = pathname === "/checkout"
    const cartItemsCount = data?.items?.length ?? 0
    const isCartEmpty = !isBuyNow && cartItemsCount === 0

    // Buy now passes amount in URL, fall back to cart total
    const buyNowAmount = Number(searchParams.get("amount") ?? 0)
    const cartTotal = Number(data?.total ?? 0)
    const displayTotal = isBuyNow ? buyNowAmount : cartTotal
    const formattedTotal = displayTotal.toLocaleString("en-IN")

    return (
        <div className="rounded-xl bg-secondary/15 border border-gray-200 p-4 h-fit sticky top-20">
            <h2 className="text-base md:text-lg font-medium text-gray-900 mb-6">
                Order Summary
            </h2>
            <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">₹{formattedTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-sm md:text-base font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{formattedTotal}</span>
                </div>
            </div>

            {isCheckoutPage ? (
                <Button
                    type="submit"
                    form="checkout-form"
                    disabled={isCartEmpty}
                    className="mt-6 w-full bg-primary text-white rounded-lg py-3 text-sm font-medium"
                >
                    Place Order
                </Button>
            ) : (
                <Button
                    className="w-full mt-2.5 py-5!"
                    onClick={() => router.push("/checkout")}
                    disabled={isCartEmpty}
                >
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