"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { usePagination } from "@/hooks/usePagination";
import { useClearFavouriteMutation, useGetFavouritesQuery } from "@/services/favouriteApi";
import { RootState } from "@/store/store";
import { ArrowLeft, CalendarHeart, Trash2 } from "lucide-react";
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
    const allIds = favouriteItems.map((item) => item.product_id);
    const visibleSelectedIds = selectIds.filter((id) => allIds.includes(id));
    const selectedCount = visibleSelectedIds.length;
    const allSelected = hasItems && allIds.every((id) => visibleSelectedIds.includes(id));

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
            const idsOutsideCurrentPage = prev.filter((id) => !allIds.includes(id));
            return allSelected ? idsOutsideCurrentPage : [...idsOutsideCurrentPage, ...allIds];
        });
    };

    const handleRemoveSelected = async () => {
        if (selectedCount === 0) {
            return;
        }

        try {
            await clearFavourite({ productIds: visibleSelectedIds }).unwrap();
            setSelectIds((prev) => prev.filter((id) => !visibleSelectedIds.includes(id)));
            toast.success(`${selectedCount} item${selectedCount > 1 ? "s" : ""} removed from wishlist.`);
        } catch {
            toast.error("Failed to remove selected items.");
        }
    };

    const handlePageChange = (nextPage: number) => {
        setPage(nextPage);
        setSelectIds([]);
    };

    if (isLoading) {
        return (
            <section className="bg-stone-50/80 py-10">
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
            <section className="bg-stone-50/80 py-10">
                <div className="container py-10 text-center text-red-500">Error loading wishlist.</div>
            </section>
        );
    }

    return (
        <section className="bg-stone-50/80 py-8 md:py-10">
            <div className="container mx-auto">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-6 flex flex-col gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                                Wishlist
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                                Saved for later
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-stone-500 sm:text-base">
                                Keep track of the items you love and move them to your bag when you are ready.
                            </p>
                        </div>

                        <Button
                            onClick={() => router.push("/product")}
                            variant="outline"
                            className="rounded-full border-stone-300 bg-white px-5"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Shopping
                        </Button>
                    </div>

                    {!hasItems ? (
                        <div className="flex h-[26rem] flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white px-6 text-center shadow-sm">
                            <div className="mb-5 grid h-18 w-18 place-items-center rounded-full bg-rose-50 text-rose-600">
                                <CalendarHeart className="size-8" />
                            </div>
                            <h2 className="text-2xl font-semibold text-stone-900">Your wishlist is empty</h2>
                            <p className="mt-2 max-w-md text-sm text-stone-500 sm:text-base">
                                Save the products you love so they are easy to come back to later.
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
                            <div className="flex flex-col gap-4 border-b border-stone-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={() => handleSelectAll()}
                                        className="border-stone-300 bg-white data-[state=checked]:border-stone-900 data-[state=checked]:bg-stone-900"
                                    />
                                    <div>
                                        <h2 className="text-lg font-semibold text-stone-900">Saved items</h2>
                                        <p className="text-sm text-stone-500">
                                            {data?.total ?? 0} item{(data?.total ?? 0) === 1 ? "" : "s"} in your wishlist
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    {selectedCount > 0 && (
                                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                                            {selectedCount} selected
                                        </span>
                                    )}

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
                                </div>
                            </div>

                            <div className="divide-y divide-stone-200">
                                {favouriteItems.map((item) => (
                                    <FavouritesItems
                                        key={item.product_id}
                                        item={item}
                                        isSelected={visibleSelectedIds.includes(item.product_id)}
                                        onSelect={handleSelect}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white px-4 py-4 shadow-sm sm:flex-row">
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
