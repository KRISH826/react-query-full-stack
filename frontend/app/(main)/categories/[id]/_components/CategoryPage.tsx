"use client";

import ProductCard from "@/app/(main)/product/_components/ProductCard";
import { ProductCardSkeletonGrid } from "@/components/ui/common/ProductCardSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { usePagination } from "@/hooks/usePagination";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetProductsByCategoriesQuery } from "@/services/categoryApi";
import { Product } from "@/types/product";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const PAGE_SIZE = 30;

const CategoryPage = () => {
    const searchParams = useSearchParams();
    const id = searchParams?.get("id") as string;
    const slug = searchParams?.get("slug") as string;
    const [page, setPage] = useState(1);

    const { data, isLoading, isFetching, error } = useGetProductsByCategoriesQuery(
        {
            categoryId: id,
            slug: slug || "",
            limit: PAGE_SIZE,
            page,
        },
        {
            skip: !id || !slug,
        }
    );

    const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);
    const pages = usePagination(page, totalPages);
    const isProductsLoading = isLoading || isFetching;

    if (error) {
        return (
            <div className="container py-10 text-center text-red-500">
                Error loading products.
            </div>
        );
    }

    return (
        <div className="bg-white py-10">
            <div className="container mx-auto">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {isProductsLoading ? (
                        <ProductCardSkeletonGrid />
                    ) : (
                        <>
                            {data?.data.map((product: Product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}

                            {data?.data.length === 0 && (
                                <Card className="col-span-full">
                                    <CardContent className="py-24">
                                        <p className="text-center text-muted-foreground">No products found</p>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </div>

                <div className="mt-8 flex w-full flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 md:mt-12 sm:flex-row">
                    <p className="order-2 text-[10px] font-medium text-muted-foreground md:text-xs sm:order-1">
                        Page {page} of {totalPages} - {data?.total ?? 0} products
                    </p>

                    {totalPages > 1 && (
                        <div className="order-1 w-full overflow-x-auto sm:order-2 sm:w-auto">
                            <Pagination>
                                <PaginationContent className="flex-nowrap">
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                                            className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>

                                    {pages.map((paginationPage, index) =>
                                        paginationPage === "ellipsis" ? (
                                            <PaginationItem key={`ellipsis-${index}`}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        ) : (
                                            <PaginationItem key={paginationPage}>
                                                <PaginationLink
                                                    isActive={paginationPage === page}
                                                    onClick={() => setPage(paginationPage)}
                                                    className="cursor-pointer text-xs sm:text-sm"
                                                >
                                                    {paginationPage}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    )}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
                                            className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
