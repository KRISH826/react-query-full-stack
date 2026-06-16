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
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";
import { useAddFavouriteMutation, useGetFavouritesQuery } from "@/services/favouriteApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type ImageGalleryProps = {
    images: ProductImage[];
    productId: string;
    productName?: string;  // add karon to use in share text
};

const ImageGallery = ({ images, productId, productName }: ImageGalleryProps) => {
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const [selected, setSelected] = useState(0);
    const [api, setApi] = useState<CarouselApi>();
    const hasImages = !!images?.length;
    const [addFavourite, { isLoading: isFavLoading }] = useAddFavouriteMutation();
    const { data: favouritesData } = useGetFavouritesQuery({ page: 1, limit: 20 }, { skip: !token });
    const addedWishList = favouritesData?.data?.some((fav) => fav.product_id === productId);

    const handleWishList = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!token) {
            toast.error("Please login to add favourites");
            return;
        }
        try {
            await addFavourite({ productId }).unwrap();
            toast.success("Favourites Added SuccessFully")
        } catch {
            toast.error("Failed To Add Favourites");
        }
    }

    const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const shareUrl = `${window.location.origin}/product/${productId}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: productName || "Check out this product",
                    text: `Hey! Check out this product on DropCulture 🛍️\n${productName}`,
                    url: shareUrl,
                });
            } catch (error) {
                console.error("Error sharing product:", error);
            }
        }else {
            await navigator.clipboard.writeText(shareUrl);
            toast.success("Link copied to clipboard!");
        }
    }


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
                            <div className="relative h-90 2xl:h-134 xl:[450px] md:[h-400px] w-full">
                                <Image
                                    src={img.image_url}
                                    alt={img.alt_text || "product"}
                                    fill
                                    className="sm:object-contain object-cover"
                                    priority
                                />
                                <div className="absolute right-4 top-4 z-10 flex flex-col gap-2 sm:right-4 sm:top-5">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 rounded-full cursor-pointer border-secondary bg-secondary/30 backdrop-blur-lg text-slate-800 shadow hover:bg-secondary"
                                        aria-label="Share product"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="h-4 text-blue-600 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 rounded-full cursor-pointer border-secondary bg-secondary/30 backdrop-blur-lg text-slate-800 shadow hover:bg-secondary"
                                        aria-label="Add to favourites"
                                        onClick={handleWishList}
                                        disabled={isFavLoading}
                                    >
                                        <Heart className={`h-4 w-4 text-red-500 ${addedWishList ? "fill-red-500" : ""}`} />
                                    </Button>
                                </div>
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
