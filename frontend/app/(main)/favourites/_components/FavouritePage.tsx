"use client";

import { useGetFavouritesQuery } from "@/services/favouriteApi";
import { Spinner } from "@/components/ui/spinner";
import FavouritesItems from "./FavouritesItems";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FavouritePage = () => {
    const [page] = useState(1);
    const { data, isLoading, error } = useGetFavouritesQuery({ page, limit: 20 });
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-10 text-center text-red-500 font-medium">
                Error loading your wishlist.
            </div>
        );
    }

    const hasItems = data?.data && data.data.length > 0;

    return (
        <section className="py-8 bg-white min-h-[80vh]">
            <div className="container mx-auto px-4">
                
                {/* Heading mirroring CartPage.tsx structure */}
                <div className="heading flex items-center justify-between gap-4 mb-8">
                    <div className="title">
                        <h1 className="text-3xl font-semibold text-gray-900">
                            My Wishlist
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {hasItems ? `Manage your ${data.total} saved items.` : "You haven't saved any items yet."}
                        </p>
                    </div>
                    <Button onClick={() => router.push("/product")} variant={"outline"} className="cursor-pointer">
                        <ArrowLeft className="mr-2 h-4 w-4" /> 
                        Back to Shopping
                    </Button>
                </div>

                {/* Content - mirroring ProductPage.tsx grid */}
                {!hasItems ? (
                    <div className="flex flex-col items-center justify-center h-64 rounded-xl border-2 border-dashed border-gray-100 bg-gray-50/50">
                        <p className="text-gray-500 font-medium">Your wishlist is currently empty</p>
                        <Button 
                            onClick={() => router.push("/product")} 
                            className="mt-6 bg-black hover:bg-gray-800 text-white px-8 rounded-lg cursor-pointer"
                        >
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {data.data.map((item) => (
                            <FavouritesItems key={item.product_id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FavouritePage;
