"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Minus, Package2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useUpdateCartMutation } from "@/services/cartApi";
import { CartItem } from "@/types/cart";
import DeleteCartProduct from "./DeleteCartProduct";

interface CartItemsProps {
    cart: CartItem;
}

const formatCurrency = (value: number) => `Rs.${Number(value ?? 0).toLocaleString("en-IN")}`;

const CartItems = ({ cart }: CartItemsProps) => {
    const [updateCart] = useUpdateCartMutation();
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const [quantity, setQuantity] = useState(cart.quantity);

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    const effectivePrice = cart.offerPrice || cart.price;
    const hasDiscount = cart.offerPrice > 0 && cart.offerPrice < cart.price;
    const lineTotal = cart.subtotal || effectivePrice * quantity;

    const handleUpdateCart = (newQuantity: number) => {
        if (newQuantity < 1) {
            return;
        }

        setQuantity(newQuantity);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            try {
                await updateCart({
                    product_id: cart.productId,
                    variant_id: cart.variantId,
                    quantity: newQuantity,
                }).unwrap();
            } catch (error) {
                setQuantity(cart.quantity);
                const err = error as { data?: { message?: string } };
                const errorMessage = err?.data?.message || "Failed to update cart item.";
                toast.error(errorMessage);
            }
        }, 250);
    };

    return (
        <div className="group rounded-2xl border border-stone-200 bg-gradient-to-r from-white via-white to-stone-50/80 p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl bg-stone-100 sm:h-32 sm:w-32">
                    <Image
                        src={cart.imageUrl || "/placeholder.png"}
                        alt={cart.productName || "Cart product"}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                {cart.brand && (
                                    <span className="rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-700">
                                        {cart.brand}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 font-medium text-sky-700">
                                    <Package2 className="size-3.5" />
                                    In stock
                                </span>
                            </div>

                            <h2 className="line-clamp-2 text-lg font-semibold text-stone-900">
                                {cart.productName}
                            </h2>

                            <div className="flex flex-wrap gap-2 text-xs text-stone-600">
                                {cart.size && (
                                    <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 font-medium">
                                        Size: {cart.size}
                                    </span>
                                )}
                                <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 font-medium">
                                    Qty in cart: {quantity}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start justify-between gap-3 sm:justify-end">
                            <div className="text-left sm:text-right">
                                <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                                    Unit price
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2 sm:justify-end">
                                    <span className="text-lg font-semibold text-stone-900">
                                        {formatCurrency(effectivePrice)}
                                    </span>
                                    {hasDiscount && (
                                        <span className="text-sm text-stone-400 line-through">
                                            {formatCurrency(cart.price)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <DeleteCartProduct id={cart.variantId} productName={cart.productName} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 rounded-2xl border border-stone-200/80 bg-white/90 p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="inline-flex w-fit items-center overflow-hidden rounded-full border border-stone-200 bg-stone-50">
                            <button
                                type="button"
                                onClick={() => handleUpdateCart(quantity - 1)}
                                disabled={quantity === 1}
                                className="flex h-10 w-10 items-center justify-center text-stone-700 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Decrease quantity"
                            >
                                <Minus className="size-4" />
                            </button>

                            <span className="flex h-10 min-w-12 items-center justify-center px-3 text-sm font-semibold text-stone-900">
                                {quantity}
                            </span>

                            <button
                                type="button"
                                onClick={() => handleUpdateCart(quantity + 1)}
                                className="flex h-10 w-10 items-center justify-center text-stone-700 transition-colors hover:bg-stone-100"
                                aria-label="Increase quantity"
                            >
                                <Plus className="size-4" />
                            </button>
                        </div>

                        <div className="text-left sm:text-right">
                            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
                                Line total
                            </p>
                            <p className="mt-1 text-xl font-semibold text-stone-900">
                                {formatCurrency(lineTotal)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItems;
