"use client";

import { useGetFavouritesQuery } from "@/services/favouriteApi";
import { Spinner } from "@/components/ui/spinner";
import FavouritesItems from "./FavouritesItems";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarHeart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const FavouritePage = () => {
    const [page, setPage] = useState(1);
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const { data, isLoading, error } = useGetFavouritesQuery({ page: 1, limit: 20 }, { skip: !token });
    const totalPages = data?.totalPages ?? 1;
    const pages = usePagination(page, totalPages);
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
        <section className="py-10 bg-background/30">
            <div className="container mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Wishlist</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {hasItems ? `You have ${data.total} items saved.` : "Your wishlist is empty."}
                        </p>
                    </div>
                    <Button onClick={() => router.push("/product")} variant="outline" className="cursor-pointer border-border w-full sm:w-auto">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Shopping
                    </Button>
                </div>

                {/* List Container - Changed from Grid to Flex Column */}
                {!hasItems ? (
                    <div className="flex flex-col items-center justify-center h-80 rounded-2xl border border-dashed border-border bg-card/50">
                        <div className="bg-primary/10 mb-4 w-18 h-18 rounded-full grid place-items-center">
                            <CalendarHeart />
                        </div>
                        <p className="text-muted-foreground font-medium">Your wishlist is currently empty</p>
                        <Button onClick={() => router.push("/product")} className="mt-4 bg-primary text-primary-foreground px-8 rounded-lg">
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

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-between md:mt-10 mt-8 items-center">
                    <p className="text-xs text-muted-foreground order-2 sm:order-1">
                        Page {page} of {totalPages} — {data?.total} products
                    </p>
                    {
                        totalPages > 1 && (
                            <div className="order-1 sm:order-2 w-full sm:w-auto overflow-x-auto">
                                <Pagination>
                                    <PaginationContent className="flex-nowrap">
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>

                                        {pages.map((p, idx) =>
                                            p === "ellipsis" ? (
                                                <PaginationItem key={`ellipsis-${idx}`}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            ) : (
                                                <PaginationItem key={p}>
                                                    <PaginationLink
                                                        isActive={p === page}
                                                        onClick={() => setPage(p)}
                                                        className="cursor-pointer text-xs sm:text-sm"
                                                    >
                                                        {p}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        )}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )
                    }
                </div>
            </div>
        </section>
    );
};

export default FavouritePage;