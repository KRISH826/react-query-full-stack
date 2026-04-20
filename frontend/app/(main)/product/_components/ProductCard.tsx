"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAddFavouriteMutation, useGetFavouritesQuery } from "@/services/favouriteApi";
import { useAddToCartMutation } from "@/services/cartApi";
import { Product } from "@/types/product";
import { Heart, ShoppingBag } from "lucide-react";
import ProductRating from "./ProductRating";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type Props = {
    product: Product;
};

const ProductCard = ({ product }: Props) => {
    const router = useRouter();
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const { data: favouritesData } = useGetFavouritesQuery({ page: 1, limit: 20 }, { skip: !token });
    const [addFavourite, { isLoading: isFavLoading }] = useAddFavouriteMutation();
    const [addToCart, { isLoading: isCartLoading }] = useAddToCartMutation();

    const image =
        product.images?.find((img) => img.isprimary)?.image_url ||
        "/placeholder.png";

    const isOutOfStock =
        product.is_track_inventory && product.stock_quantity <= 0;

    const addedWishList = favouritesData?.data?.some((fav) => fav.product_id === product.id);

    const handlerProductDetails = (id: string) => {
        router.push(`/product/${id}`);
    };

    const handleWishList = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!token) {
            toast.error("Please login to add favourites");
            return;
        }
        try {
            await addFavourite({ productId: product.id }).unwrap();
            toast.success("Favourites Added SuccessFully")
        } catch {
            toast.error("Failed To Add Favourites");
        }
    }

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!token) {
            toast.error("Please login to add to bag");
            return;
        }
        const variantId = product.variants?.[0]?.id;
        if (!variantId) {
            toast.error("Product variant not found");
            return;
        }
        try {
            await addToCart({
                product_id: product.id,
                variant_id: variantId,
                quantity: 1
            }).unwrap();
            toast.success("Added to Bag successfully");
        } catch {
            toast.error("Failed to add to bag");
        }
    }

    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-xl md:rounded-2xl border bg-white shadow-sm transition hover:shadow-lg">

            {/* Image */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                <Image
                    onClick={() => handlerProductDetails(product.id)}
                    src={image}
                    alt={product.productname}
                    fill
                    sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 20vw"
                    className="object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                />

                {/* Status Badge */}
                {isOutOfStock && (
                    <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                        Out of Stock
                    </span>
                )}

                {!isOutOfStock && (
                    <span className="absolute left-3 top-3 rounded-md bg-green-600 px-2 py-1 text-xs font-semibold text-white">
                        In Stock
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-3 md:p-4">
                <h2 className="line-clamp-1 text-[13px] md:text-base font-bold text-slate-800">
                    {product.brand}
                </h2>

                <p className="mt-0.5 line-clamp-1 text-[10px] md:text-sm text-gray-500">
                    {product.productname}
                </p>

                <div className="scale-90 origin-left md:scale-100">
                    <ProductRating
                        rating={product.avg_rating}
                        reviewCount={product.total_reviews}
                    />
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Footer */}
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm md:text-lg font-bold text-gray-900">
                        {
                            product.variants?.[0]?.offer_price_override ? <>
                                ₹{product.variants?.[0]?.offer_price_override.toLocaleString()} <span className="text-[9px] md:text-xs text-gray-400 line-through ml-1">₹{product.variants?.[0]?.price_override?.toLocaleString()}</span>
                            </> : <>
                                ₹{product.variants?.[0]?.price_override?.toLocaleString() || product.variants?.[1]?.price_override?.toLocaleString()}
                            </>
                        }
                    </span>
                </div>

                {/* Actions Row */}
                <div className="mt-4 flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className={`h-9 w-9 shrink-0 cursor-pointer transition-all ${addedWishList ? "text-red-500 border-red-200 bg-red-50" : ""}`}
                        disabled={isFavLoading}
                        onClick={handleWishList}
                    >
                        {isFavLoading ? (
                            <Spinner className="h-4 w-4" />
                        ) : (
                            <Heart className={`h-4 w-4 ${addedWishList ? "fill-current" : ""}`} />
                        )}
                    </Button>

                    <Button
                        className="flex-1 cursor-pointer h-9 md:h-10 text-[10px] md:text-sm font-semibold gap-2"
                        disabled={isCartLoading || isOutOfStock}
                        onClick={handleAddToCart}
                    >
                        {isCartLoading ? (
                            <Spinner className="h-3 w-3 md:h-4 md:w-4" />
                        ) : (
                            <>
                                <ShoppingBag className="h-3 w-3 md:h-4 md:w-4" />
                                <span>Add to Bag</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProductCard);
