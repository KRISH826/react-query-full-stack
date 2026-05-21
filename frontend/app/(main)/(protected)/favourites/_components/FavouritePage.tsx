"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { usePagination } from "@/hooks/usePagination";
import { useClearFavouriteMutation, useGetFavouritesQuery } from "@/services/favouriteApi";
import { RootState } from "@/store/store";
import { ArrowLeft, CalendarHeart, Heart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import FavouritesItems from "./FavouritesItems";

const FavouritePage = () => {
    const [page, setPage] = useState(1);
    const [selectIds, setSelectIds] = useState<string[]>([]);
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const [clearFavourite, { isLoading: isClearLoading }] = useClearFavouriteMutation();
    const { data, isLoading, error } = useGetFavouritesQuery({ page, limit: 20 }, { skip: !token });
    const totalPages = data?.totalPages ?? 1;
    const pages = usePagination(page, totalPages);
    const router = useRouter();

    const favouriteItems = data?.data ?? [];
    const hasItems = favouriteItems.length > 0;
    const favouriteIds = favouriteItems.map((item) => item.product_id);
    const favouriteIdSet = new Set(favouriteIds);
    const visibleSelectedIds = selectIds.filter((id) => favouriteIdSet.has(id));
    const visibleSelectedSet = new Set(visibleSelectedIds);
    const selectedCount = visibleSelectedIds.length;
    const allSelected = hasItems && favouriteIds.every((id) => visibleSelectedSet.has(id));

    const handleSelect = (productId: string) => {
        setSelectIds((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    const handleSelectAll = () => {
        if (!hasItems) {
            return;
        }

        setSelectIds((prev) => {
            const idsOutsidePage = prev.filter((id) => !favouriteIdSet.has(id));
            return allSelected ? idsOutsidePage : [...idsOutsidePage, ...favouriteIds];
        });
    };

    const handlePageChange = (nextPage: number) => {
        setPage(nextPage);
        setSelectIds([]);
    };

    const handleRemoveSelected = async () => {
        if (selectedCount === 0) {
            return;
        }

        try {
            await clearFavourite({ productIds: visibleSelectedIds }).unwrap();
            setSelectIds((prev) => prev.filter((id) => !favouriteIdSet.has(id)));
            toast.success(`${selectedCount} item${selectedCount > 1 ? "s" : ""} removed from wishlist.`);
        } catch {
            toast.error("Failed to remove selected items.");
        }
    };

    if (isLoading) {
        return (
            <section className="bg-linear-to-b from-stone-50 via-white to-stone-100/70 py-10">
                <div className="container mx-auto">
                    <div className="flex min-h-[60vh] items-center justify-center rounded-3xl border border-stone-200 bg-white shadow-sm">
                        <Spinner className="h-12 w-12" />
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="bg-linear-to-b from-stone-50 via-white to-stone-100/70 py-10">
                <div className="container py-10 text-center text-red-500">Error loading wishlist.</div>
            </section>
        );
    }

    return (
        <section className="bg-linear-to-b from-stone-50 via-white to-stone-100/70 py-8 md:py-10">
            <div className="container mx-auto">
                <div className="space-y-6">
                    <div className="rounded-3xl border border-stone-200 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6 lg:p-7">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                            <div className="space-y-4">
                                <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                                    <Heart className="size-3.5" />
                                    Wishlist overview
                                </span>

                                <div>
                                    <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                                        My Wishlist
                                    </h1>
                                    <p className="mt-2 max-w-2xl text-sm text-stone-500 sm:text-base">
                                        Save the pieces you love and move them to your bag whenever you are ready.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                                        {data?.total ?? 0} saved item{(data?.total ?? 0) === 1 ? "" : "s"}
                                    </span>
                                    {selectedCount > 0 && (
                                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                            {selectedCount} selected
                                        </span>
                                    )}
                                    {hasItems && (
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                            Ready to move to bag
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {hasItems && (
                                    <Button
                                        variant="outline"
                                        className="rounded-full border-stone-300 bg-white px-5"
                                        onClick={handleSelectAll}
                                    >
                                        {allSelected ? "Clear Selection" : "Select All"}
                                    </Button>
                                )}

                                {hasItems && (
                                    <Button
                                        onClick={handleRemoveSelected}
                                        variant="destructive"
                                        disabled={selectedCount === 0 || isClearLoading}
                                        className="rounded-full px-5"
                                    >
                                        {isClearLoading ? (
                                            <Spinner className="mr-1.5 h-4 w-4" />
                                        ) : (
                                            <Trash2 className="mr-1.5 h-4 w-4" />
                                        )}
                                        Remove Selected
                                    </Button>
                                )}

                                <Button
                                    onClick={() => router.push("/product")}
                                    variant="outline"
                                    className="rounded-full border-stone-300 bg-white px-5"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Shopping
                                </Button>
                            </div>
                        </div>
                    </div>

                    {hasItems && (
                        <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <label className="flex items-center gap-3">
                                <Checkbox
                                    checked={allSelected}
                                    onCheckedChange={() => handleSelectAll()}
                                    className="border-stone-300 bg-white data-[state=checked]:border-stone-900 data-[state=checked]:bg-stone-900"
                                />
                                <div>
                                    <p className="text-sm font-medium text-stone-900">Select all on this page</p>
                                    <p className="text-xs text-stone-500">
                                        {selectedCount > 0
                                            ? `${selectedCount} item${selectedCount > 1 ? "s" : ""} selected for bulk actions`
                                            : "Use checkboxes to manage multiple favourites at once."}
                                    </p>
                                </div>
                            </label>

                            <p className="text-xs text-stone-500 sm:text-sm">
                                Page {page} of {totalPages}
                            </p>
                        </div>
                    )}

                    {!hasItems ? (
                        <div className="flex h-88 flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white/80 px-6 text-center shadow-sm">
                            <div className="mb-5 grid h-18 w-18 place-items-center rounded-full bg-rose-50 text-rose-600">
                                <CalendarHeart className="size-8" />
                            </div>
                            <h2 className="text-2xl font-semibold text-stone-900">Your wishlist is empty</h2>
                            <p className="mt-2 max-w-md text-sm text-stone-500 sm:text-base">
                                Start saving products you love so they stay easy to find later.
                            </p>
                            <Button
                                onClick={() => router.push("/product")}
                                className="mt-6 rounded-full px-6"
                            >
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
                            <div className="flex flex-col gap-3 border-b border-stone-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-stone-900">Saved items</h2>
                                    <p className="text-sm text-stone-500">
                                        A clean view of everything you have bookmarked for later.
                                    </p>
                                </div>

                                {selectedCount > 0 && (
                                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                        {selectedCount} selected
                                    </span>
                                )}
                            </div>

                            <div className="px-5 pb-2 sm:px-6">
                                {favouriteItems.map((item, index) => (
                                    <div key={item.product_id}>
                                        <FavouritesItems
                                            item={item}
                                            isSelected={visibleSelectedSet.has(item.product_id)}
                                            onSelect={handleSelect}
                                        />
                                        {index < favouriteItems.length - 1 && (
                                            <Separator className="bg-stone-200" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white px-4 py-4 shadow-sm sm:flex-row">
                            <p className="order-2 text-xs text-stone-500 sm:order-1">
                                Page {page} of {totalPages} • {data?.total ?? 0} products
                            </p>

                            <div className="order-1 w-full overflow-x-auto sm:order-2 sm:w-auto">
                                <Pagination>
                                    <PaginationContent className="flex-nowrap">
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => handlePageChange(Math.max(1, page - 1))}
                                                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>

                                        {pages.map((pageItem, idx) =>
                                            pageItem === "ellipsis" ? (
                                                <PaginationItem key={`ellipsis-${idx}`}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            ) : (
                                                <PaginationItem key={pageItem}>
                                                    <PaginationLink
                                                        isActive={pageItem === page}
                                                        onClick={() => handlePageChange(pageItem)}
                                                        className="cursor-pointer text-xs sm:text-sm"
                                                    >
                                                        {pageItem}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        )}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                                                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FavouritePage;
