import { Product } from "@/types/product";
import { Heart } from "lucide-react";
import Image from "next/image";

type Props = {
    product: Product;
};

const ProductCard = ({ product }: Props) => {
    const image =
        product.images?.[0]?.image_url || "/placeholder.png";

    const isOutOfStock =
        product.is_track_inventory && product.stock_quantity <= 0;

    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg">

            {/* Image */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                <Image
                    src={image}
                    alt={product.productname}
                    fill
                    sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
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
                        ₹{product.price.toLocaleString()}
                    </span>
                </div>
                <button
                    className="
              flex w-full items-center justify-center gap-2
              rounded-lg bg-black px-4 py-2 mt-3 cursor-pointer text-sm font-medium text-white
              transition hover:bg-gray-800
              disabled:cursor-not-allowed disabled:opacity-50
            "
                >
                    <Heart className="h-4 w-4" />
                    Add to Wishlist
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
