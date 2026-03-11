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
        return <div className="container py-10 text-center text-red-500">Error loading wishlist.</div>;
    }

    const hasItems = data?.data && data.data.length > 0;

    return (
        <section className="py-10 bg-background/30 min-h-screen">
            <div className="container mx-auto">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
                        <p className="text-muted-foreground mt-1">
                            {hasItems ? `You have ${data.total} items saved.` : "Your wishlist is empty."}
                        </p>
                    </div>
                    <Button onClick={() => router.push("/product")} variant="outline" className="cursor-pointer border-border">
                        <ArrowLeft className="mr-2 h-4 w-4" /> 
                        Back to Shopping
                    </Button>
                </div>

                {/* List Container - Changed from Grid to Flex Column */}
                {!hasItems ? (
                    <div className="flex flex-col items-center justify-center h-80 rounded-2xl border-2 border-dashed border-border bg-card/50">
                        <p className="text-muted-foreground font-medium">Your wishlist is currently empty</p>
                        <Button onClick={() => router.push("/product")} className="mt-6 bg-primary text-primary-foreground px-8 rounded-lg">
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 w-full">
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