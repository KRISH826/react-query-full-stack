"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAddFavouriteMutation, useGetFavouritesQuery } from "@/services/favouriteApi";
import { Product } from "@/types/product";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

type Props = {
    product: Product;
};

const ProductCard = ({ product }: Props) => {
    const router = useRouter();
    const { data } = useGetFavouritesQuery({ page: 1, limit: 20 });
    const [addFavourite, { isLoading, isSuccess }] = useAddFavouriteMutation();
    const image =
        product.images?.find((img) => img.isprimary)?.image_url ||
        "/placeholder.png";

    const isOutOfStock =
        product.is_track_inventory && product.stock_quantity <= 0;

    const addedWishList = data?.data?.some((fav) => fav.product_id === product.id);    

    const handlerProductDetails = (id: string) => {
        router.push(`/product/${id}`);
    };

    const handleWishList = async (productId: string) => {
        try {
            await addFavourite({ productId }).unwrap();
            toast.success("Favourites Added SuccessFully")
        } catch {
            toast.error("Failed To Add Favourites");
        }
    }

    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg">

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
            <div className="flex flex-1 flex-col p-4">
                <h2 className="line-clamp-2 text-base font-semibold text-slate-800">
                    {product.brand}
                </h2>

                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {product.productname}
                </p>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                        {
                            product.variants?.[1]?.offer_price_override ? <>
                                ₹{product.variants?.[1]?.offer_price_override.toLocaleString()} <span className="text-gray-400 line-through">₹{product.variants?.[1]?.price_override?.toLocaleString()}</span>
                            </> : <>
                                ₹{product.variants?.[1]?.price_override?.toLocaleString()}
                            </>
                        }
                    </span>
                </div>
                <Button
                className="cursor-pointer mt-3"
                disabled={isLoading || isSuccess || addedWishList}
                    onClick={() => handleWishList(product.id)}>
                    {
                        isLoading ? <Spinner className="h-4 w-4" /> : <>
                            {
                                !addedWishList && <Heart className="h-4 w-4" />
                            }
                        </>
                    }
                    {
                        isSuccess || addedWishList ? "Added to Wishlist" : "Add to Wishlist"
                    }
                </Button>
            </div>
        </div>
    );
};

export default React.memo(ProductCard);
