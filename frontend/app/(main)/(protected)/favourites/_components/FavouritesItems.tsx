"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { useAddToCartMutation } from "@/services/cartApi";
import { FavouriteItem } from "@/types/favourite";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DeleteDialog from "./DeleteDialog";

interface FavouritesItemsProps {
    item: FavouriteItem;
    isSelected: boolean;
    onSelect: (productId: string) => void;
}

const formatCurrency = (price?: number | null) => `Rs.${Number(price ?? 0).toLocaleString("en-IN")}`;

const FavouritesItems = ({ item, isSelected, onSelect }: FavouritesItemsProps) => {
    const router = useRouter();
    const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
    const product = item.product;
    const image = product.primary_image || "/placeholder.png";
    const activeVariant = product.variants?.[0];
    const offerPrice = activeVariant?.offer_price_override;
    const originalPrice = activeVariant?.price_override;
    const displayPrice = offerPrice ?? originalPrice;
    const hasDiscount = Boolean(offerPrice && originalPrice && originalPrice > offerPrice);
    const discountPercent = hasDiscount && originalPrice && offerPrice
        ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100)
        : 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            await addToCart({
                product_id: item.product_id,
                variant_id: activeVariant?.id ?? "",
                quantity: 1,
            }).unwrap();
            toast.success("Added to bag");
        } catch (error) {
            const err = error as { data?: { message?: string } };
            const errorMessage = err?.data?.message || "Failed to add item.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className={`group relative py-5 px-4 sm:px-6 transition-colors duration-200 ${isSelected ? "bg-stone-50/50" : "bg-white"}`}>
            {/* Top Row: Checkbox, Image, Product details and Price */}
            <div className="flex items-start gap-3 sm:gap-6">
                {/* Checkbox Selection */}
                <div className="flex items-center pt-1.5 sm:pt-2">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onSelect(item.product_id)}
                        className="border-stone-300 bg-white data-[state=checked]:border-stone-900 data-[state=checked]:bg-stone-900"
                    />
                </div>

                {/* Product Image (shrink-0 ensures it never shrinks) */}
                <div
                    onClick={() => router.push(`/product/${item.product_id}`)}
                    className="relative h-20 w-16 sm:h-28 sm:w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-stone-100 bg-stone-50"
                >
                    <Image
                        src={image}
                        alt={product.productname}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Product Info Block (Title, Brand, Price) */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-6 flex-1 min-w-0">
                    <div className="space-y-1">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold tracking-wide uppercase">
                            {product.brand && (
                                <span className="text-stone-500">
                                    {product.brand}
                                </span>
                            )}
                            {hasDiscount && (
                                <span className="rounded-full bg-rose-50 px-2 py-0.5 font-bold text-rose-600">
                                    {discountPercent}% off
                                </span>
                            )}
                        </div>

                        {/* Product Title */}
                        <h3
                            onClick={() => router.push(`/product/${item.product_id}`)}
                            className="cursor-pointer text-sm sm:text-base font-semibold leading-snug text-stone-900 hover:text-stone-700 hover:underline underline-offset-4 line-clamp-2"
                        >
                            {product.productname}
                        </h3>

                        {/* Status/Wishlist details for Desktop */}
                        <div className="hidden sm:flex flex-wrap gap-2 mt-2">
                            <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-medium text-stone-600 uppercase tracking-wider">
                                Wishlist pick
                            </span>
                            <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-medium text-stone-600 uppercase tracking-wider">
                                Ready to add
                            </span>
                        </div>
                    </div>

                    {/* Price Details */}
                    <div className="text-left sm:text-right shrink-0">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400 hidden sm:block">
                            Price
                        </p>
                        <div className="flex flex-wrap items-baseline gap-1.5 sm:justify-end">
                            <span className="text-base sm:text-lg font-bold text-stone-900">
                                {formatCurrency(displayPrice)}
                            </span>
                            {hasDiscount && originalPrice && (
                                <span className="text-xs text-stone-400 line-through">
                                    {formatCurrency(originalPrice)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Actions (separated on mobile, side-by-side or stacked cleanly) */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-dashed border-stone-200/80 sm:border-0 sm:pt-0 sm:mt-4">
                {/* Empty block for spacing or small badge on mobile */}
                <div className="flex sm:hidden items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-[9px] font-medium text-stone-600 uppercase tracking-wider">
                        Wishlist pick
                    </span>
                    <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-[9px] font-medium text-stone-600 uppercase tracking-wider">
                        Ready to add
                    </span>
                </div>

                {/* Actions: Delete & Add to Bag (never squish or shrink) */}
                <div className="flex items-center justify-end gap-2 w-full sm:w-auto ml-auto shrink-0">
                    {/* Delete button (never shrink) */}
                    <div className="shrink-0">
                        <DeleteDialog productId={item.product_id} />
                    </div>

                    {/* Add to Bag (takes full remaining width on mobile so it's a solid button, but normal shrink-0 size on desktop) */}
                    <Button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        size="sm"
                        className="h-9 rounded-lg px-4 text-xs font-semibold flex-1 sm:flex-initial justify-center shrink-0"
                    >
                        {isAddingToCart ? (
                            <Spinner className="mr-1.5 size-3" />
                        ) : (
                            <ShoppingBag className="mr-1.5 size-3" />
                        )}
                        Add to Bag
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FavouritesItems;
