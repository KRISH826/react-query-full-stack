"use client";

import { ProductImage } from "@/types/product";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const ImageGallery = ({ images }: { images: ProductImage[] }) => {
    const [selected, setSelected] = useState(0);
    const [api, setApi] = useState<CarouselApi>();
    const hasImages = !!images?.length;

    useEffect(() => {
        if (!api) return;

        const onSelect = () => {
            setSelected(api.selectedScrollSnap());
        };

        onSelect();
        api.on("select", onSelect);
        api.on("reInit", onSelect);

        return () => {
            api.off("select", onSelect);
            api.off("reInit", onSelect);
        };
    }, [api]);

    if (!hasImages) return null;

    return (
        <div className="space-y-4">
            <Carousel
                setApi={setApi}
                opts={{ loop: images.length > 1 }}
                className="relative overflow-hidden rounded-xl border bg-white"
            >
                <CarouselContent className="ml-0">
                    {images.map((img) => (
                        <CarouselItem key={img.id} className="pl-0">
                            <div className="relative h-[400px] sm:h-[550px] w-full">
                                <Image
                                    src={img.image_url}
                                    alt={img.alt_text || "product"}
                                    fill
                                    className="object-contain p-4 sm:p-6"
                                    priority
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {images.length > 1 && (
                    <>
                        <CarouselPrevious
                            className="left-3 top-1/2 -translate-y-1/2 border-border/70 bg-background/90 hover:bg-background"
                            aria-label="Previous image"
                        />
                        <CarouselNext
                            className="right-3 top-1/2 -translate-y-1/2 border-border/70 bg-background/90 hover:bg-background"
                            aria-label="Next image"
                        />
                    </>
                )}
            </Carousel>

            {/* Thumbnails at bottom */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, index) => (
                    <button
                        key={img.id}
                        onClick={() => api?.scrollTo(index)}
                        className={`
                            relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-lg border transition-colors
                            ${selected === index ? "border-primary ring-2 ring-primary/10" : "border-gray-200 hover:border-gray-300"}
                        `}
                        aria-label={`Show image ${index + 1}`}
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
        </div>
    );
};

export default ImageGallery;
