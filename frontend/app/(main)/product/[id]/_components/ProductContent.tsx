"use client";
import { Spinner } from "@/components/ui/spinner";
import { useAddToCartMutation, useGetCartQuery } from "@/services/cartApi";
import { Product, ProductVariant } from "@/types/product";
import { CircleCheck, RotateCcw, ShoppingBag, Truck, Tag } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import Buynow from "./Buynow";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ProductRating from "../../_components/ProductRating";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

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
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const quantity = 1;
    const [addToCart, { isLoading }] = useAddToCartMutation();
    const { data: cart } = useGetCartQuery(undefined, { skip: !token });
    const router = useRouter();

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
    const addcarted = cart?.items.some((item) => item.variantId === activeVariant?.id) ?? false;
    const displayPrice = activeVariant?.offer_price_override;
    const originalPrice = activeVariant?.price_override;
    const hasDiscount = originalPrice! > displayPrice!;
    const isOutOfStock = hasVariants
        ? (activeVariant !== undefined ? (activeVariant.stock_quantity ?? 0) <= 0 : false)
        : product.is_track_inventory && product.stock_quantity <= 0;

    const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);

    const handleAddToCart = async () => {
        if (!activeVariant && hasVariants) {
            toast.error("Please select a size");
            return;
        }
        try {
            await addToCart({
                product_id: product.id,
                variant_id: activeVariant?.id || '', // fallback if no variants (though backend might fail)
                quantity
            }).unwrap();
            toast.success("Item added to bag");
        } catch {
            toast.error("Failed to add item to bag");
        }
    };

    const handleBuyNow = () => {
        if (!activeVariant && hasVariants) {
            toast.error("Please select a size")
            return
        }
        setIsBuyNowLoading(true);
        const effectivePrice = activeVariant?.offer_price_override ?? activeVariant?.price_override ?? 0
        const params = new URLSearchParams({
            productId: product.id,
            variantId: activeVariant?.id ?? "",
            quantity: String(quantity),
            amount: String(effectivePrice * quantity),  // ← ye missing tha
        })
        router.push(`/checkout?${params.toString()}`)
    }

    return (
        <div className="flex flex-col gap-5 lg:pr-4">
            {/* Header section */}
            <div className="space-y-1">
                {product.brand && (
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        {product.brand}
                    </p>
                )}
                <h1 className="text-xl md:text-3xl font-medium tracking-tight text-foreground">
                    {product.productname}
                </h1>
            </div>

            {/* Price section */}
            <div className="flex items-end gap-3 pb-4 border-b border-border/40">
                {
                    displayPrice && <span className="text-xl md:text-2xl font-semibold text-foreground">
                        ₹{displayPrice?.toLocaleString()}
                    </span>
                }

                {hasDiscount && (
                    <span
                        className={
                            displayPrice
                                ? "text-sm text-muted-foreground line-through mb-1"
                                : "text-xl md:text-2xl font-semibold text-foreground"
                        }
                    >
                        ₹{originalPrice?.toLocaleString("en-IN")}
                    </span>
                )}
                {hasDiscount || !displayPrice && (
                    <span className="ml-2 rounded-sm bg-red-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-600 uppercase mb-1">
                        {Math.round(((originalPrice! - displayPrice!) / originalPrice!) * 100)}% off
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
            <ProductRating rating={product.avg_rating} reviewCount={product.total_reviews} size={14} fontSizeClass="text-xs md:text-base" />
            <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-sm text-foreground">
                    <CircleCheck className="size-4 text-emerald-600" />
                    <span>100% Original Products</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                    <Truck className="size-4 text-emerald-600" />
                    <span>Pay on delivery might be available</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                    <RotateCcw className="size-4 text-emerald-600" />
                    <span>Easy 14 days returns and exchanges</span>
                </div>
            </div>

            {/* Bank Offers Section (Static) */}
            <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                        Available Offers
                    </h3>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                        <Tag className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-muted-foreground leading-snug"><span className="font-medium text-foreground">Bank Offer</span> 5% Unlimited Cashback on Axis Bank Credit Card <span className="text-primary cursor-pointer hover:underline text-xs font-medium ml-1">T&C</span></p>
                    </div>
                    <div className="flex items-start gap-2">
                        <Tag className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-muted-foreground leading-snug"><span className="font-medium text-foreground">Special Price</span> Get extra 10% off (price inclusive of cashback/coupon) <span className="text-primary cursor-pointer hover:underline text-xs font-medium ml-1">T&C</span></p>
                    </div>
                    <div className="flex items-start gap-2">
                        <Tag className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-muted-foreground leading-snug"><span className="font-medium text-foreground">Partner Offer</span> Make a purchase and enjoy a surprise cashback/coupon that you can redeem later! <span className="text-primary cursor-pointer hover:underline text-xs font-medium ml-1">Know More</span></p>
                    </div>
                </div>
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
                                        flex h-10 sm:min-w-14 min-w-10 px-3 items-center justify-center border text-xs font-medium
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

            {/* Actions */}
            <div className="mt-auto grid w-full grid-cols-2 gap-3 pt-6">
                <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isLoading || addcarted}
                    className="h-12 w-full"
                >
                    {isLoading ? (
                        <Spinner className="size-4" />
                    ) : (
                        <>
                            <ShoppingBag className="size-5! mr-1" />
                            {addcarted ? "Added to bag" : "Add to bag"}
                        </>
                    )}
                </Button>

                <Buynow
                    onClick={handleBuyNow}
                    disabled={isOutOfStock || isLoading || isBuyNowLoading}
                    isLoading={isBuyNowLoading}
                />
            </div>

            <div className="content">
                <h2 className="text-primary mb-3.5 lg:text-2xl sm:text-xl text-lg font-semibold">Product Details</h2>
                {/* Description */}
                <div className="space-y-2 border border-secondary/85 rounded-xl p-4">
                    <div dangerouslySetInnerHTML={{
                        __html: product.description ? product.description.replace(/&nbsp;/g, ' ') : ''
                    }} className="product-desc-viewer">
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductContent;
