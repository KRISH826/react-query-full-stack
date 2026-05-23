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
        <div className="group relative py-5 transition-all duration-200">
            <div className="flex gap-4 sm:gap-6">
                {/* Product Image */}
                <div className="relative h-20 w-20 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-stone-50 border border-stone-100/80">
                    <Image
                        src={cart.imageUrl || "/placeholder.png"}
                        alt={cart.productName || "Cart product"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Product Details & Top Row */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="space-y-1">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold tracking-wide uppercase">
                            {cart.brand && (
                                <span className="text-stone-500">
                                    {cart.brand}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
                                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                                In stock
                            </span>
                        </div>

                        {/* Title & Delete Button */}
                        <div className="flex items-start justify-between gap-3">
                            <h2 className="line-clamp-2 text-sm sm:text-base font-semibold text-stone-900 leading-snug">
                                {cart.productName}
                            </h2>
                            <div className="shrink-0 -mt-1">
                                <DeleteCartProduct id={cart.variantId} productName={cart.productName} />
                            </div>
                        </div>

                        {/* Size Spec */}
                        {cart.size && (
                            <p className="text-xs text-stone-500 font-medium">
                                Size: <span className="text-stone-800">{cart.size}</span>
                            </p>
                        )}
                    </div>

                    {/* Unit Price (shown only on mobile here under the title) */}
                    <div className="mt-1 flex items-baseline gap-2 sm:hidden">
                        <span className="text-sm font-semibold text-stone-900">
                            {formatCurrency(effectivePrice)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-stone-400 line-through">
                                {formatCurrency(cart.price)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Inner dashed separator inside item */}
            <div className="my-4 border-t border-dashed border-stone-200/60" />

            {/* Controls Row (No nested card, fully responsive) */}
            <div className="flex items-center justify-between gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center rounded-full border border-stone-200 bg-stone-50/60 p-0.5">
                    <button
                        type="button"
                        onClick={() => handleUpdateCart(quantity - 1)}
                        disabled={quantity === 1}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 transition-all hover:bg-white hover:shadow-sm active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Decrease quantity"
                    >
                        <Minus className="size-3.5" />
                    </button>

                    <span className="w-8 text-center text-xs font-bold text-stone-800">
                        {quantity}
                    </span>

                    <button
                        type="button"
                        onClick={() => handleUpdateCart(quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 transition-all hover:bg-white hover:shadow-sm active:scale-95"
                        aria-label="Increase quantity"
                    >
                        <Plus className="size-3.5" />
                    </button>
                </div>

                {/* Pricing (Unit & Total) */}
                <div className="flex items-center gap-6">
                    {/* Unit Price for Desktop */}
                    <div className="hidden sm:block text-right">
                        <span className="text-[10px] font-medium text-stone-400 block uppercase tracking-wider">Unit Price</span>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                            <span className="text-sm font-semibold text-stone-850">
                                {formatCurrency(effectivePrice)}
                            </span>
                            {hasDiscount && (
                                <span className="text-xs text-stone-400 line-through">
                                    {formatCurrency(cart.price)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Total Price */}
                    <div className="text-right">
                        <span className="text-[10px] font-medium text-stone-400 block uppercase tracking-wider">Total</span>
                        <span className="text-base sm:text-lg font-bold text-stone-900 mt-0.5 block">
                            {formatCurrency(lineTotal)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItems;
