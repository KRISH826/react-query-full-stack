"use client";

import OrderSummary from "./OrderSummary";
import { useGetCartQuery } from "@/services/cartApi";
import CartItems from "./CartItems";
import { CartItem } from "@/types/cart";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useClearCartMutation } from "@/services/cartApi";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const CartPage = () => {
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const { data, isLoading } = useGetCartQuery(undefined, { skip: !token });
    const [clearCart, { isLoading: isClearing }] = useClearCartMutation();
    const router = useRouter();
    const ClearCart = async () => {
        try {
            await clearCart();
            toast.success("Cart cleared successfully");
        } catch (error) {
            toast.error("Failed to clear cart");
        }
    }
    const backToShopping = () => {
        router.push("/product");
    }
    return (
        <section className="py-8">
            <div className="container">
                <div className="heading flex flex-wrap items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="title">
                        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                            Your Cart
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Review your items before checkout.
                        </p>
                    </div>
                    <Button onClick={backToShopping} variant={"outline"} className="w-auto"><ArrowLeft /> Back to Shopping</Button>
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
                                    <CartItems key={cart.variantId} cart={cart} />
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
