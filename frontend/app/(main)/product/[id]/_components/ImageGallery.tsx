"use client";

import { ProductImage } from "@/types/product";
import Image from "next/image";
import { useState } from "react";

const ImageGallery = ({ images }: { images: ProductImage[] }) => {
    const [selected, setSelected] = useState(0);

    if (!images || images.length === 0) return null;

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">

            {/* Thumbnails */}
            <div className="flex md:flex-col md:max-h-[550px] gap-3 pb-2 md:pb-0 overflow-x-auto md:overflow-y-auto scrollbar-hide">
                {images.map((img, index) => (
                    <button
                        key={img.id}
                        onClick={() => setSelected(index)}
                        className={`
              relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-lg border transition-colors
              ${selected === index ? "border-primary ring-2 ring-primary/10" : "border-gray-200 hover:border-gray-300"}
            `}
                    >
                        <Image
                            src={img.image_url}
                            alt={img.alt_text || "thumb"}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 overflow-hidden rounded-xl border bg-white">
                <div className="relative h-[400px] sm:h-[550px] w-full">
                    <Image
                        key={images[selected].id}
                        src={images[selected].image_url}
                        alt={images[selected].alt_text || "product"}
                        fill
                        className="object-contain p-4 sm:p-6"
                        priority
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageGallery;
