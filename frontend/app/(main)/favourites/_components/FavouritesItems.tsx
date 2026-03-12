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

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await addToCart({
                product_id: item.product_id,
                variant_id: activeVariant?.id ?? "",
                quantity: 1,
            }).unwrap();
            toast.success("Added to bag");
        } catch {
            toast.error("Failed to add");
        }
    };

    return (
        <div className="group flex flex-col sm:flex-row items-center gap-6 p-5 bg-background rounded-2xl border border-border transition-all hover:shadow-sm w-full">
            
            {/* Image Box */}
            <div 
                className="relative h-40 w-40 shrink-0 overflow-hidden rounded-xl bg-secondary/20 cursor-pointer border border-border/50"
                onClick={() => router.push(`/product/${item.product_id}`)}
            >
                <Image
                    src={image}
                    alt={product.productname}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Info Section */}
            <div className="flex flex-1 flex-col w-full">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                            {product.brand}
                        </span>
                        <h2 
                            onClick={() => router.push(`/product/${item.product_id}`)}
                            className="text-xl font-semibold text-foreground cursor-pointer hover:underline underline-offset-4"
                        >
                            {product.productname}
                        </h2>
                    </div>
                    {/* Your Delete Dialog Trigger */}
                    <DeleteDialog productId={item.product_id} />
                </div>

                {/* Description */}
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 max-w-3xl">
                    {product.description}
                </p>

                {/* Price & Action Row */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-foreground">
                            ₹{(offerPrice ?? originalPrice)?.toLocaleString()}
                        </span>
                        {offerPrice && originalPrice && originalPrice > offerPrice && (
                            <span className="text-sm text-muted-foreground line-through opacity-60">
                                ₹{originalPrice.toLocaleString()}
                            </span>
                        )}
                        {offerPrice && originalPrice && originalPrice > offerPrice && (
                            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">
                                {Math.round(((originalPrice - offerPrice) / originalPrice) * 100)}% OFF
                            </span>
                        )}
                    </div>

                    <Button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className="h-11 px-6! rounded-md bg-primary text-primary-foreground font-semibold cursor-pointer shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-50"
                    >
                        {isAddingToCart ? (
                            <Spinner className="size-4 mr-0.5" />
                        ) : (
                            <ShoppingBag className="size-4 mr-0.5" />
                        )}
                        Add to Bag
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FavouritesItems;