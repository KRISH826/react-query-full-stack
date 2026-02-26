"use client";

import { Spinner } from "@/components/ui/spinner";
import { useAddToCartMutation } from "@/services/cartApi";
import { Product, ProductVariant } from "@/types/product";
import { Heart } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import Buynow from "./Buynow";

// ─── helpers ──────────────────────────────────────────────────────────────────

/** All unique non-null colors that exist across the variant list */
function uniqueColors(variants: ProductVariant[]): string[] {
    return [...new Set(variants.map((v) => v.color).filter(Boolean) as string[])];
}

/** All sizes available for a given color (null color = any) */
function sizesForColor(variants: ProductVariant[], color: string | null): ProductVariant[] {
    if (!color) return variants;
    return variants.filter((v) => v.color === color);
}

/** Return the variant that matches the chosen color + size */
function findVariant(
    variants: ProductVariant[],
    color: string | null,
    size: string | null
): ProductVariant | undefined {
    return variants.find(
        (v) =>
            (color === null || v.color === color) &&
            (size === null || v.size === size)
    );
}

// ─── component ────────────────────────────────────────────────────────────────

const ProductContent = ({ product }: { product: Product }) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [addToCart, { isLoading }] = useAddToCartMutation();

    const variants = product.variants ?? [];
    const hasVariants = variants.length > 0;

    // Detect whether variants carry color / size info
    const colors = useMemo(() => uniqueColors(variants), [variants]);
    const hasColors = colors.length > 0;

    // Selection state
    const [selectedColor, setSelectedColor] = useState<string | null>(
        hasColors ? colors[0] : null
    );

    const availableSizes = useMemo(
        () => sizesForColor(variants, selectedColor),
        [variants, selectedColor]
    );
    const hasSizes = availableSizes.some((v) => v.size);

    const [selectedSize, setSelectedSize] = useState<string | null>(
        hasSizes ? (availableSizes[0]?.size ?? null) : null
    );

    // Derive the active variant
    const activeVariant = useMemo(
        () => (hasVariants ? findVariant(variants, selectedColor, selectedSize) : undefined),
        [variants, selectedColor, selectedSize, hasVariants]
    );

    // Pricing
    const displayPrice =
        activeVariant?.price_override ?? product.price;
    const originalPrice =
        activeVariant?.offer_price_override ?? product.offer_price ?? null;
    const hasDiscount = originalPrice !== null && originalPrice > displayPrice;

    // Stock
    const variantOutOfStock =
        activeVariant !== undefined
            ? (activeVariant.stock_quantity ?? 0) <= 0
            : product.is_track_inventory && product.stock_quantity <= 0;
    const isOutOfStock = hasVariants ? variantOutOfStock : product.is_track_inventory && product.stock_quantity <= 0;

    // ── handlers ──────────────────────────────────────────────────────────────

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        // Reset size to first available for new color
        const sizes = sizesForColor(variants, color);
        setSelectedSize(sizes[0]?.size ?? null);
    };

    const handleAddToCart = async () => {
        try {
            await addToCart({ product_id: product.id, quantity }).unwrap();
            toast.success("Item added to cart");
        } catch {
            toast.error("Failed to add item to cart");
        }
    };

    // ── render ────────────────────────────────────────────────────────────────

    return (
        <div className="space-y-6">

            {/* Title */}
            <h1 className="text-2xl font-semibold text-gray-900">
                {product.productname}
            </h1>

            {/* Brand */}
            {product.brand && (
                <p className="text-sm text-gray-500">
                    Brand: <span className="font-medium">{product.brand}</span>
                </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-gray-900">
                    ₹{displayPrice.toLocaleString()}
                </span>

                {hasDiscount && (
                    <span className="text-lg text-gray-400 line-through">
                        ₹{originalPrice!.toLocaleString()}
                    </span>
                )}

                {hasDiscount && (
                    <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                        {Math.round(((originalPrice! - displayPrice) / originalPrice!) * 100)}% OFF
                    </span>
                )}

                {isOutOfStock ? (
                    <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                        Out of Stock
                    </span>
                ) : (
                    <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                        In Stock
                    </span>
                )}
            </div>

            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {product.categories.map((cat) => (
                        <span
                            key={cat.name}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs"
                        >
                            {cat.name}
                        </span>
                    ))}
                </div>
            )}

            {/* ── Color Selector ── */}
            {hasColors && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                        Color:{" "}
                        <span className="font-semibold text-gray-900">{selectedColor}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => {
                            const isSelected = selectedColor === color;
                            return (
                                <button
                                    key={color}
                                    onClick={() => handleColorSelect(color)}
                                    title={color}
                                    className={`
                                        relative h-8 w-8 rounded-full border-2 transition-all duration-150 cursor-pointer
                                        ${isSelected
                                            ? "border-black scale-110 shadow-md"
                                            : "border-gray-300 hover:border-gray-500"
                                        }
                                    `}
                                    style={{ backgroundColor: color.toLowerCase() }}
                                >
                                    {isSelected && (
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <span className="h-2 w-2 rounded-full bg-white shadow" />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Size Selector ── */}
            {hasSizes && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                        Size:{" "}
                        <span className="font-semibold text-gray-900">{selectedSize}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {availableSizes.map((v) => {
                            if (!v.size) return null;
                            const isSelected = selectedSize === v.size;
                            const outOfStock = (v.stock_quantity ?? 0) <= 0;
                            return (
                                <button
                                    key={v.id}
                                    onClick={() => !outOfStock && setSelectedSize(v.size)}
                                    disabled={outOfStock}
                                    className={`
                                        relative min-w-[2.75rem] rounded-md border px-3 py-1.5 text-sm font-medium transition-all duration-150 cursor-pointer
                                        ${isSelected
                                            ? "border-black bg-black text-white"
                                            : outOfStock
                                                ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                                                : "border-gray-300 hover:border-gray-700 text-gray-800"
                                        }
                                    `}
                                >
                                    {v.size}
                                    {outOfStock && (
                                        <span className="absolute -top-1.5 -right-1.5 rounded-full bg-red-400 h-2 w-2" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Variant SKU */}
            {activeVariant?.sku && (
                <p className="text-xs text-gray-400">SKU: {activeVariant.sku}</p>
            )}

            {/* Stock Info (no-variant products) */}
            {!hasVariants && product.is_track_inventory && (
                <p className="text-sm text-gray-500">
                    Available Quantity: {product.stock_quantity}
                </p>
            )}

            {/* Variant Stock Info */}
            {hasVariants && activeVariant && (
                <p className="text-sm text-gray-500">
                    Available Quantity:{" "}
                    <span className={`font-medium ${(activeVariant.stock_quantity ?? 0) <= 0 ? "text-red-500" : "text-green-600"}`}>
                        {activeVariant.stock_quantity ?? 0}
                    </span>
                </p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity</span>

                <div className="flex items-center overflow-hidden rounded-lg border">
                    <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity === 1}
                        className="flex h-10 w-10 items-center justify-center text-lg font-medium transition hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
                    >
                        −
                    </button>
                    <div className="flex h-10 w-12 items-center justify-center text-sm font-medium">
                        {quantity}
                    </div>
                    <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="flex h-10 w-10 items-center justify-center text-lg font-medium transition hover:bg-gray-100 cursor-pointer"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Description */}
            <div>
                <h2 className="mb-2 text-lg font-semibold">Description</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {product.description}
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isLoading}
                    className="
                        rounded-lg bg-primary flex-1 flex items-center justify-center px-6 py-3 text-sm font-medium text-white
                        transition hover:bg-primary/90 cursor-pointer duration-300 ease-in-out
                        disabled:cursor-not-allowed disabled:opacity-50
                    "
                >
                    {isLoading ? (
                        <Spinner className="size-5" />
                    ) : (
                        <>
                            <Heart className="size-5! mr-1" /> Add to Cart
                        </>
                    )}
                </button>
                <Buynow />
            </div>
        </div>
    );
};

export default ProductContent;
