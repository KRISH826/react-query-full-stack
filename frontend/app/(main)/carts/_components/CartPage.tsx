"use client";

import OrderSummary from "./OrderSummary";
import { useGetCartQuery } from "@/services/cartApi";
import CartItems from "./CartItems";
import { CartItem } from "@/types/cart";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useClearCartMutation } from "@/services/cartApi";
import { Spinner } from "@/components/ui/spinner";

const CartPage = () => {
    const { data, isLoading } = useGetCartQuery();
    const [clearCart, { isLoading: isClearing }] = useClearCartMutation();
    const ClearCart = async () => {
        try {
            await clearCart();
            toast.success("Cart cleared successfully");
        } catch (error) {
            toast.error("Failed to clear cart");
        }
    }
    return (
        <section className="py-8">
            <div className="container">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Your Cart
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Review your items before checkout.
                    </p>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {
                            isLoading ? (
                                <div className="flex items-center h-64 p-4 justify-center">
                                    <Spinner className="h-12 w-12" />
                                </div>
                            ) : data?.items.length === 0 ? (
                                <div className="flex items-center h-64 rounded-lg border border-gray-200 justify-center">
                                    <p className="text-slate-900 text-lg font-medium capitalize">Your cart is empty</p>
                                </div>
                            ) : (
                                data?.items.map((cart: CartItem) => (
                                    <CartItems key={cart.productId} cart={cart} />
                                ))
                            )
                        }
                        {
                            !isLoading && (data?.items.length || 0) > 0 && (
                                <div className="flex justify-end">
                                    <Button variant={"destructive"} disabled={isClearing} onClick={ClearCart} className="w-fit cursor-pointer py-3! px-7!">
                                        <Trash2 />
                                        {isClearing ? "Clearing..." : "Clear Cart"}
                                    </Button>
                                </div>
                            )
                        }
                    </div>
                    {/* RIGHT SIDE - ORDER SUMMARY */}
                    <OrderSummary />
                </div>
            </div>
        </section>
    );
};

export default CartPage;
