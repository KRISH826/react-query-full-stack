"use client";

import { Spinner } from "@/components/ui/spinner";
import { useAddToCartMutation } from "@/services/cartApi";
import { Product } from "@/types/product";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ProductContent = ({ product }: { product: Product }) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [addToCart, { isLoading }] = useAddToCartMutation();
    const isOutOfStock =
        product.is_track_inventory && product.stock_quantity <= 0;

    const handleAddToCart = async () => {
        try {
            await addToCart({
                product_id: product.id,
                quantity
            }).unwrap();
            toast.success("Item added to cart");
        } catch (error) {
            console.log(error);
            toast.error("Failed to add item to cart");
        }
    }

    return (
        <div className="space-y-6">

            {/* Title */}
            <h1 className="text-2xl font-semibold text-gray-900">
                {product.productname}
            </h1>

            {/* Brand */}
            {product.brand && (
                <p className="text-sm text-gray-500">
                    Brand: <span className="font-medium">{product.brand}</span>
                </p>
            )}

            {/* Price */}
            <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                </span>

                {isOutOfStock ? (
                    <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                        Out of Stock
                    </span>
                ) : (
                    <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                        In Stock
                    </span>
                )}
            </div>

            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {product.categories.map((cat) => (
                        <span
                            key={cat.name}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs"
                        >
                            {cat.name}
                        </span>
                    ))}
                </div>
            )}

            {/* Stock Info */}
            {product.is_track_inventory && (
                <p className="text-sm text-gray-500">
                    Available Quantity: {product.stock_quantity}
                </p>
            )}
            {/* Quantity */}
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                    Quantity
                </span>

                <div className="flex items-center overflow-hidden rounded-lg border">
                    <button onClick={() => setQuantity(quantity - 1)} disabled={quantity === 1} className="flex h-10 w-10 items-center justify-center text-lg font-medium transition hover:bg-gray-100">
                        −
                    </button>
                    <div className="flex h-10 w-12 items-center justify-center text-sm font-medium">
                        {quantity}
                    </div>
                    <button onClick={() => setQuantity(quantity + 1)} className="flex h-10 w-10 items-center justify-center text-lg font-medium transition hover:bg-gray-100">
                        +
                    </button>
                </div>
            </div>
            {/* Description */}
            <div>
                <h2 className="mb-2 text-lg font-semibold">Description</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {product.description}
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="
             rounded-lg bg-primary flex-1 flex items-center justify-center px-6 py-3 text-sm font-medium text-white
            transition hover:bg-primary/90 cursor-pointer duration-300 ease-in-out
            disabled:cursor-not-allowed disabled:opacity-50
          "
                >
                    {
                        isLoading ? <Spinner className='size-5' /> : <>
                            <Heart className="size-5! mr-1" />  Add to Cart
                        </>
                    }
                </button>

                <button className="flex items-center gap-2 justify-center rounded-lg bg-secondary border-secondary border-solid transition-all cursor-pointer duration-300 ease-in-out flex-1 border px-6 py-3 text-sm font-medium">
                    <ShoppingBag className="size-5! mr-1" />  Buy Now
                </button>
            </div>
        </div>
    );
};

export default ProductContent;
