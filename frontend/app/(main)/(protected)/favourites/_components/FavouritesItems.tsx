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
            <div className="flex items-start gap-4 sm:gap-6">
                {/* Checkbox Selection */}
                <div className="flex items-center pt-1.5 sm:pt-2">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onSelect(item.product_id)}
                        className="border-stone-300 bg-white data-[state=checked]:border-stone-900 data-[state=checked]:bg-stone-900"
                    />
                </div>

                {/* Product Image */}
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

                {/* Product Info Block */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-1 min-w-0">
                    <div className="flex-1 min-w-0 space-y-1">
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
                            className="cursor-pointer text-sm sm:text-base font-semibold leading-snug text-stone-900 hover:text-stone-700 hover:underline underline-offset-4"
                        >
                            {product.productname}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-stone-500 line-clamp-1 sm:line-clamp-2 mt-1">
                            {product.description || "Saved to wishlist. Move to bag when ready."}
                        </p>

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

                    {/* Price and Actions */}
                    <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end gap-3 sm:gap-4 sm:shrink-0 w-full sm:w-auto">
                        {/* Price Details */}
                        <div className="text-left sm:text-right">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
                                Price
                            </p>
                            <div className="mt-0.5 flex flex-wrap items-baseline gap-1.5 sm:justify-end">
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

                        {/* Action buttons (Delete & Add to Bag) */}
                        <div className="flex items-center gap-2">
                            {/* Delete button */}
                            <div className="shrink-0">
                                <DeleteDialog productId={item.product_id} />
                            </div>

                            {/* Add to Bag */}
                            <Button
                                onClick={handleAddToCart}
                                disabled={isAddingToCart}
                                size="sm"
                                className="h-9 rounded-lg px-4 text-xs font-semibold"
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
            </div>
        </div>
    );
};

export default FavouritesItems;
