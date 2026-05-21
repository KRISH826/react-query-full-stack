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
        <div
            className={`group px-2 py-5 transition-colors sm:px-1 ${
                isSelected ? "rounded-2xl bg-primary/5" : ""
            }`}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex items-start gap-3">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onSelect(item.product_id)}
                        className="mt-1 size-5 border-stone-300 bg-white data-[state=checked]:border-stone-900 data-[state=checked]:bg-stone-900"
                    />

                    <div
                        onClick={() => router.push(`/product/${item.product_id}`)}
                        className="relative h-26 w-24 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 sm:h-32 sm:w-28 md:h-36 md:w-32"
                    >
                        <Image
                            src={image}
                            alt={product.productname}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                {product.brand && (
                                    <span className="rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-700">
                                        {product.brand}
                                    </span>
                                )}
                                {hasDiscount && (
                                    <span className="rounded-full bg-rose-50 px-2.5 py-1 font-medium text-rose-600">
                                        {discountPercent}% off
                                    </span>
                                )}
                            </div>

                            <h2
                                onClick={() => router.push(`/product/${item.product_id}`)}
                                className="line-clamp-2 cursor-pointer text-base font-semibold leading-snug text-stone-900 hover:underline underline-offset-4 sm:text-lg"
                            >
                                {product.productname}
                            </h2>

                            <p className="text-sm text-stone-500">
                                Saved for later. Move it to your bag whenever you are ready.
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="text-left sm:text-right">
                                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
                                    Price
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2 sm:justify-end">
                                    <span className="text-lg font-semibold text-stone-900 sm:text-xl">
                                        {formatCurrency(displayPrice)}
                                    </span>
                                    {hasDiscount && originalPrice && (
                                        <span className="text-sm text-stone-400 line-through">
                                            {formatCurrency(originalPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <DeleteDialog productId={item.product_id} />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="flex flex-wrap gap-2 text-xs text-stone-600 sm:text-sm">
                            <span className="rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-700">
                                Wishlist pick
                            </span>
                            <span className="rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-700">
                                Ready to add
                            </span>
                        </div>

                        <Button
                            onClick={handleAddToCart}
                            disabled={isAddingToCart}
                            size="sm"
                            className="h-10 shrink-0 rounded-xl px-4 text-sm font-semibold"
                        >
                            {isAddingToCart ? (
                                <Spinner className="mr-1.5 size-3.5" />
                            ) : (
                                <ShoppingBag className="mr-1.5 size-3.5" />
                            )}
                            Add to Bag
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FavouritesItems;
