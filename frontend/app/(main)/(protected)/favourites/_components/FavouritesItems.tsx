"use client";

import { FavouriteItem } from "@/types/favourite";
import { useAddToCartMutation } from "@/services/cartApi";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import DeleteDialog from "./DeleteDialog";
import { Button } from "@/components/ui/button";

interface FavouritesItemsProps {
    item: FavouriteItem;
}

const FavouritesItems = ({ item }: FavouritesItemsProps) => {
    const router = useRouter();
    const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
    const product = item.product;
    const image = product.primary_image || "/placeholder.png";
    const activeVariant = product.variants?.[0];
    const offerPrice = activeVariant?.offer_price_override;
    const originalPrice = activeVariant?.price_override;
    const displayPrice = offerPrice ?? originalPrice;
    const hasDiscount = offerPrice && originalPrice && originalPrice > offerPrice;
    const discountPercent = hasDiscount
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
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            const errorMessage = err?.data?.message || "Failed to add item.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="group flex gap-4 p-4 sm:p-5 bg-background rounded-2xl border border-border transition-all duration-200 hover:shadow-md hover:border-border/80 w-full">

            {/* Image */}
            <div
                onClick={() => router.push(`/product/${item.product_id}`)}
                className="relative shrink-0 h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 overflow-hidden rounded-xl bg-secondary/20 cursor-pointer border border-border/40"
            >
                <Image
                    src={image}
                    alt={product.productname}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Content */}
            <div className="flex flex-1 min-w-0 flex-col justify-between gap-3">

                {/* Top Row: Brand + Name + Delete */}
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 space-y-0.5">
                        {product.brand && (
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate">
                                {product.brand}
                            </p>
                        )}
                        <h2
                            onClick={() => router.push(`/product/${item.product_id}`)}
                            className="text-sm sm:text-base font-semibold text-foreground cursor-pointer hover:underline underline-offset-4 line-clamp-2 leading-snug"
                        >
                            {product.productname}
                        </h2>
                    </div>
                    <div className="shrink-0">
                        <DeleteDialog productId={item.product_id} />
                    </div>
                </div>

                {/* Bottom Row: Price + Button */}
                <div className="flex flex-wrap items-center justify-between gap-3">

                    {/* Price */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg sm:text-xl font-bold text-foreground">
                            ₹{displayPrice?.toLocaleString("en-IN")}
                        </span>
                        {hasDiscount && (
                            <>
                                <span className="text-xs sm:text-sm text-muted-foreground line-through">
                                    ₹{originalPrice.toLocaleString("en-IN")}
                                </span>
                                <span className="text-[10px] sm:text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                                    {discountPercent}% OFF
                                </span>
                            </>
                        )}
                    </div>

                    {/* Add to Bag */}
                    <Button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        size="sm"
                        className="h-9 sm:h-10 px-4 sm:px-5 rounded-lg font-semibold text-xs sm:text-sm shrink-0"
                    >
                        {isAddingToCart ? (
                            <Spinner className="size-3.5 mr-1.5" />
                        ) : (
                            <ShoppingBag className="size-3.5 mr-1.5" />
                        )}
                        Add to Bag
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FavouritesItems;