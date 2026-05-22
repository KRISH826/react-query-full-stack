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
        <div className={`px-5 py-5 transition-colors sm:px-6 ${isSelected ? "bg-stone-50/80" : "bg-white"}`}>
            <div className="grid gap-4 md:grid-cols-[auto_7rem_minmax(0,1fr)_auto] md:items-center md:gap-5">
                <div className="flex items-start md:pt-1">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onSelect(item.product_id)}
                        className="border-stone-300 bg-white data-[state=checked]:border-stone-900 data-[state=checked]:bg-stone-900"
                    />
                </div>

                <div
                    onClick={() => router.push(`/product/${item.product_id}`)}
                    className="relative h-28 w-24 cursor-pointer overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 sm:h-32 sm:w-28"
                >
                    <Image
                        src={image}
                        alt={product.productname}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                </div>

                <div className="min-w-0">
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

                    <h3
                        onClick={() => router.push(`/product/${item.product_id}`)}
                        className="mt-3 cursor-pointer text-lg font-semibold leading-snug text-stone-900 hover:underline underline-offset-4"
                    >
                        {product.productname}
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm text-stone-500">
                        Saved for later. Move it to your bag whenever you are ready.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-stone-600">
                        <span className="rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-700">
                            Wishlist pick
                        </span>
                        <span className="rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-700">
                            Ready to add
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 md:items-end">
                    <div className="flex items-start gap-3 md:justify-end">
                        <div className="text-left md:text-right">
                            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
                                Price
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-2 md:justify-end">
                                <span className="text-2xl font-semibold text-stone-900">
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

                    <Button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className="h-11 rounded-xl px-5 text-sm font-semibold"
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
    );
};

export default FavouritesItems;
