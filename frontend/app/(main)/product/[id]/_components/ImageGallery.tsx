"use client";

import { ProductImage } from "@/types/product";
import Image from "next/image";
import { useState } from "react";

const ImageGallery = ({ images }: { images: ProductImage[] }) => {
    const [selected, setSelected] = useState(0);

    if (!images || images.length === 0) return null;

    return (
        <div className="flex gap-4">

            {/* Thumbnails */}
            <div className="flex max-h-[520px] flex-col gap-3 overflow-y-auto">
                {images.map((img, index) => (
                    <button
                        key={img.id}
                        onClick={() => setSelected(index)}
                        className={`
              relative h-20 w-20 overflow-hidden rounded-lg border
              ${selected === index ? "border-black" : "border-gray-200"}
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
            <div className="relative flex-1 overflow-hidden rounded-xl border bg-gray-100">
                <div className="relative h-[520px] w-full">
                    <Image
                        src={images[selected].image_url}
                        alt={images[selected].alt_text || "product"}
                        fill
                        className="object-contain p-6"
                        priority
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageGallery;
