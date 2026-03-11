"use client";

import { FavouriteItem } from "@/types/favourite";
import { useRemoveFavouriteMutation } from "@/services/favouriteApi";
import { useAddToCartMutation } from "@/services/cartApi";
import { ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import DeleteDialog from "./DeleteDialog";

interface FavouritesItemsProps {
    item: FavouriteItem;
}

const FavouritesItems = ({ item }: FavouritesItemsProps) => {
    const router = useRouter();
    const [removeFavourite, { isLoading: isRemoving }] = useRemoveFavouriteMutation();
    const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

    const product = item.product;
    const image = product.primary_image;
    const activeVariant = product.variants?.[0];
    const offerPrice = activeVariant?.offer_price_override;
    const originalPrice = activeVariant?.price_override;

    const handleRemove = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await removeFavourite({ productId: item.product_id }).unwrap();
            toast.success("Removed from wishlist");
        } catch {
            toast.error("Failed to remove item");
        }
    };

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
            toast.error("Failed to add to bag");
        }
    };

    const navigateToDetails = () => {
        router.push(`/product/${item.product_id}`);
    };

    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg">

            {/* Image section mirroring ProductCard.tsx */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                <Image
                    onClick={navigateToDetails}
                    src={image}
                    alt={product.productname}
                    fill
                    sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 20vw"
                    className="object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                />

               <DeleteDialog productId={item.product_id} />
            </div>

            <div className="flex flex-1 flex-col p-4">
                <h2 className="line-clamp-2 text-base font-semibold text-slate-800">
                    {product.brand}
                </h2>

                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {product.productname}
                </p>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Price section mirroring ProductCard.tsx */}
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                        {offerPrice ? (
                            <>
                                ₹{offerPrice.toLocaleString()}{' '}
                                {originalPrice && originalPrice > offerPrice && (
                                    <span className="text-sm font-normal text-gray-400 line-through">
                                        ₹{originalPrice.toLocaleString()}
                                    </span>
                                )}
                            </>
                        ) : (
                            originalPrice ? `₹${originalPrice.toLocaleString()}` : 'Price N/A'
                        )}
                    </span>
                </div>

                {/* Prominent Action Button mirroring app's primary buttons */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 mt-3 cursor-pointer text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isAddingToCart ? (
                        <Spinner className="h-4 w-4" />
                    ) : (
                        <>
                            <ShoppingBag className="h-4 w-4" />
                            Add to Bag
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default FavouritesItems;
