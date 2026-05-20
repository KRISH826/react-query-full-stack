"use client";

import { Button } from "@/components/ui/button";
import { useGetCartQuery } from "@/services/cartApi";
import { RootState } from "@/store/store";
import { ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

const formatCurrency = (value: number) => `Rs.${Number(value ?? 0).toLocaleString("en-IN")}`;

const OrderSummary = () => {
    const searchParams = useSearchParams();
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const { data } = useGetCartQuery(undefined, { skip: !token });
    const router = useRouter();
    const pathname = usePathname();

    const isBuyNow = searchParams.has("productId");
    const isCheckoutPage = pathname === "/checkout";
    const cartItemsCount = data?.items?.length ?? 0;
    const isCartEmpty = !isBuyNow && cartItemsCount === 0;
    const shouldRenderSummary = isCheckoutPage || isBuyNow || cartItemsCount > 0;

    const buyNowAmount = Number(searchParams.get("amount") ?? 0);
    const cartTotal = Number(data?.total ?? 0);
    const displayTotal = isBuyNow ? buyNowAmount : cartTotal;

    if (!shouldRenderSummary) {
        return null;
    }

    return (
        <div className="sticky top-20 h-fit overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
            <div className="bg-linear-to-br from-stone-900 via-stone-800 to-stone-700 p-5 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/65">
                    Order Summary
                </p>

                <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm text-white/70">
                            {isBuyNow
                                ? "Ready for instant checkout"
                                : `${cartItemsCount} ${cartItemsCount === 1 ? "item" : "items"} selected`}
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold leading-none 2xl:text-4xl">
                            {formatCurrency(displayTotal)}
                        </h2>
                    </div>

                    <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white/10">
                        <ShoppingBag className="size-6" />
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="rounded-2xl bg-stone-50 p-4">
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-stone-600">
                            <span>Subtotal</span>
                            <span className="font-medium text-stone-900">
                                {formatCurrency(displayTotal)}
                            </span>
                        </div>

                        <div className="flex justify-between text-stone-600">
                            <span>Shipping</span>
                            <span className="font-medium text-emerald-600">Free</span>
                        </div>

                        <div className="flex justify-between text-stone-600">
                            <span>Estimated tax</span>
                            <span className="font-medium text-stone-900">Calculated at checkout</span>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 text-stone-900">
                        <span className="text-sm font-semibold md:text-base">Checkout Total</span>
                        <span className="text-xl font-bold leading-none 2xl:text-2xl">
                            {formatCurrency(displayTotal)}
                        </span>
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-3 text-sm text-stone-600">
                        <Truck className="mt-0.5 size-4 shrink-0 text-stone-900" />
                        <div>
                            <p className="font-medium text-stone-900">Free delivery</p>
                            <p className="mt-1 text-xs text-stone-500">
                                Shipping stays free on this order.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-3 text-sm text-stone-600">
                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-stone-900" />
                        <div>
                            <p className="font-medium text-stone-900">Secure checkout</p>
                            <p className="mt-1 text-xs text-stone-500">
                                Protected payments and verified order details.
                            </p>
                        </div>
                    </div>
                </div>

                {isCheckoutPage ? (
                    <Button
                        type="submit"
                        form="checkout-form"
                        disabled={isCartEmpty}
                        className="mt-5 h-11 w-full rounded-xl bg-primary text-sm font-medium text-white"
                    >
                        Place Order
                    </Button>
                ) : (
                    <Button
                        className="mt-5 h-11 w-full rounded-xl text-sm font-medium"
                        onClick={() => router.push("/checkout")}
                        disabled={isCartEmpty}
                    >
                        Proceed to Checkout
                    </Button>
                )}

                <p className="mt-4 text-center text-xs text-stone-500">
                    Taxes and final charges are confirmed during checkout.
                </p>
            </div>
        </div>
    );
};

export default OrderSummary;
