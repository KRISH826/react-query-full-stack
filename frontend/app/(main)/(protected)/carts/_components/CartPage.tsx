"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useClearCartMutation, useGetCartQuery } from "@/services/cartApi";
import { RootState } from "@/store/store";
import { CartItem } from "@/types/cart";
import { ArrowLeft, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import CartItems from "./CartItems";
import OrderSummary from "./OrderSummary";

const CartPage = () => {
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const { data, isLoading } = useGetCartQuery(undefined, { skip: !token });
    const [clearCart, { isLoading: isClearing }] = useClearCartMutation();
    const router = useRouter();

    const cartItems = data?.items ?? [];
    const itemCount = cartItems.length;
    const formattedTotal = Number(data?.total ?? 0).toLocaleString("en-IN");

    const handleClearCart = async () => {
        try {
            await clearCart().unwrap();
            toast.success("Cart cleared successfully.");
        } catch (error) {
            const err = error as { data?: { message?: string } };
            const errorMessage = err?.data?.message || "Failed to clear cart.";
            toast.error(errorMessage);
        }
    };

    const backToShopping = () => {
        router.push("/product");
    };

    return (
        <section className="bg-linear-to-b from-stone-50 via-white to-stone-100/70 py-8 md:py-10">
            <div className="container">
                <div className="space-y-6">
                    <div className="rounded-3xl border border-stone-200 bg-white/85 p-5 shadow-sm backdrop-blur sm:p-6 lg:p-7">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                            <div className="space-y-4">
                                <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                                    <ShoppingBag className="size-3.5" />
                                    Cart overview
                                </span>

                                <div>
                                    <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                                        Your Cart
                                    </h1>
                                    <p className="mt-2 max-w-2xl text-sm text-stone-500 sm:text-base">
                                        Review your items, adjust quantities, and head to checkout when everything looks right.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                                        {itemCount} {itemCount === 1 ? "item" : "items"}
                                    </span>
                                    {itemCount > 0 && (
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                            Rs.{formattedTotal} ready for checkout
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                                        <Truck className="size-3.5" />
                                        Free shipping
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                                        <ShieldCheck className="size-3.5" />
                                        Secure checkout
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button
                                    onClick={backToShopping}
                                    variant="outline"
                                    className="rounded-full border-stone-300 bg-white px-5"
                                >
                                    <ArrowLeft className="size-4" />
                                    Back to Shopping
                                </Button>

                                {!isLoading && itemCount > 0 && (
                                    <Button
                                        variant="outline"
                                        disabled={isClearing}
                                        onClick={handleClearCart}
                                        className="rounded-full border-rose-200 px-5 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                    >
                                        <Trash2 className="size-4" />
                                        {isClearing ? "Clearing cart..." : "Clear cart"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex min-h-[22rem] items-center justify-center rounded-3xl border border-stone-200 bg-white shadow-sm">
                                    <div className="flex flex-col items-center gap-3 text-center text-stone-500">
                                        <Spinner className="size-10" />
                                        <p className="text-sm font-medium">Loading your cart...</p>
                                    </div>
                                </div>
                            ) : itemCount === 0 ? (
                                <div className="rounded-3xl border border-dashed border-stone-300 bg-white/80 p-10 text-center shadow-sm">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 text-stone-700">
                                        <ShoppingBag className="size-8" />
                                    </div>
                                    <h2 className="mt-5 text-2xl font-semibold text-stone-900">
                                        Your cart is empty
                                    </h2>
                                    <p className="mx-auto mt-2 max-w-md text-sm text-stone-500 sm:text-base">
                                        Looks like you have not added anything yet. Explore the catalog and add your favorite products here.
                                    </p>
                                    <Button
                                        onClick={backToShopping}
                                        className="mt-6 rounded-full px-6"
                                    >
                                        Browse products
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="rounded-3xl border border-stone-200 bg-white p-3 shadow-sm sm:p-4">
                                        <div className="mb-4 flex flex-col gap-3 border-b border-stone-200 px-2 pb-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <h2 className="text-lg font-semibold text-stone-900">
                                                    Cart items
                                                </h2>
                                                <p className="text-sm text-stone-500">
                                                    Everything you picked, organized for a quick review.
                                                </p>
                                            </div>

                                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                                <Truck className="size-3.5" />
                                                Free shipping available
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {cartItems.map((cart: CartItem) => (
                                                <CartItems key={cart.variantId} cart={cart} />
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <OrderSummary />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CartPage;
