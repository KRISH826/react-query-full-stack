"use client";

import { Spinner } from "@/components/ui/spinner";
import { useAddToCartMutation } from "@/services/cartApi";
import { Product, ProductVariant } from "@/types/product";
import { ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import Buynow from "./Buynow";

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Return the variant that matches the chosen size */
function findVariant(
    variants: ProductVariant[],
    size: string | null
): ProductVariant | undefined {
    return variants.find((v) => size === null || v.size === size);
}

// ─── component ────────────────────────────────────────────────────────────────

const ProductContent = ({ product }: { product: Product }) => {
    const quantity = 1;
    const [addToCart, { isLoading }] = useAddToCartMutation();

    const variants = useMemo(() => product.variants ?? [], [product.variants]);
    const hasVariants = variants.length > 0;

    const hasSizes = variants.some((v) => v.size);

    const [selectedSize, setSelectedSize] = useState<string | null>(
        hasSizes ? (variants[0]?.size ?? null) : null
    );

    const activeVariant = useMemo(
        () => (hasVariants ? findVariant(variants, selectedSize) : undefined),
        [variants, selectedSize, hasVariants]
    );

    const displayPrice = activeVariant?.price_override ?? product.price;
    const originalPrice = activeVariant?.offer_price_override ?? product.offer_price ?? null;
    const hasDiscount = originalPrice !== null && originalPrice > displayPrice;
    const isOutOfStock = hasVariants
        ? (activeVariant !== undefined ? (activeVariant.stock_quantity ?? 0) <= 0 : false)
        : product.is_track_inventory && product.stock_quantity <= 0;

    const handleAddToCart = async () => {
        try {
            await addToCart({ product_id: product.id, quantity }).unwrap();
            toast.success("Item added to cart");
        } catch {
            toast.error("Failed to add item to cart");
        }
    };

    return (
        <div className="flex flex-col gap-6 lg:pr-4">
            {/* Header section */}
            <div className="space-y-1">
                {product.brand && (
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        {product.brand}
                    </p>
                )}
                <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                    {product.productname}
                </h1>
            </div>

            {/* Price section */}
            <div className="flex items-end gap-3 pb-4 border-b border-border/40">
                <span className="text-2xl font-semibold text-foreground">
                    ₹{displayPrice.toLocaleString()}
                </span>

                {hasDiscount && (
                    <span className="text-sm text-muted-foreground line-through mb-1">
                        ₹{originalPrice!.toLocaleString()}
                    </span>
                )}

                {hasDiscount && (
                    <span className="ml-2 rounded-sm bg-red-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-600 uppercase mb-1">
                        {Math.round(((originalPrice! - displayPrice) / originalPrice!) * 100)}% off
                    </span>
                )}

                {isOutOfStock ? (
                    <span className="ml-auto text-xs font-medium text-destructive">
                        Out of stock
                    </span>
                ) : (
                    <span className="ml-auto text-xs font-medium text-emerald-600">
                        In stock
                    </span>
                )}
            </div>

            {/* Sizes section */}
            {hasSizes && (
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Size</h3>
                        {selectedSize && (
                            <span className="text-xs font-medium text-foreground">
                                {selectedSize}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {variants.map((v) => {
                            if (!v.size) return null;
                            const isSelected = selectedSize === v.size;
                            const outOfStock = (v.stock_quantity ?? 0) <= 0;
                            return (
                                <button
                                    key={v.id}
                                    onClick={() => !outOfStock && setSelectedSize(v.size)}
                                    disabled={outOfStock}
                                    className={`
                                        flex h-10 min-w-[3.5rem] px-3 items-center justify-center border text-xs font-medium
                                        transition-colors duration-200 cursor-pointer select-none
                                        ${isSelected
                                            ? "border-foreground bg-foreground text-background"
                                            : outOfStock
                                                ? "border-muted bg-muted/30 text-muted-foreground/40 cursor-not-allowed"
                                                : "border-border bg-background text-foreground hover:border-foreground/40"
                                        }
                                    `}
                                >
                                    {v.size}
                                    {outOfStock && (
                                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                                            <div className="w-[120%] h-px bg-muted-foreground/30 rotate-12 transform origin-center"></div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Description */}
            <div className="space-y-2 pt-4">
                <div className="prose prose-sm text-muted-foreground/90 prose-p:leading-relaxed text-sm">
                    <p>{product.description}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 mt-auto">
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isLoading}
                    className="
                        flex-1 w-full flex items-center justify-center gap-2 h-12 bg-foreground text-background text-sm font-medium
                        transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2
                        disabled:pointer-events-none disabled:opacity-50
                    "
                >
                    {isLoading ? (
                        <Spinner className="size-4" />
                    ) : (
                        <>
                            <ShoppingBag className="size-4" />
                            Add to bag
                        </>
                    )}
                </button>
                <div className="flex-1 w-full [&>button]:h-12 [&>button]:w-full [&>button]:rounded-none [&>button]:border [&>button]:border-foreground [&>button]:bg-background [&>button]:text-foreground hover:[&>button]:bg-accent">
                    <Buynow />
                </div>
            </div>
        </div>
    );
};

export default ProductContent;
