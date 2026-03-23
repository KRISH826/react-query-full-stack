"use client";

import { Spinner } from "@/components/ui/spinner";
import { useGetProductsQuery } from "@/services/productApi";
import ProductCard from "./ProductCard";
import { useState } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";
import { Product } from "@/types/product";


const LIMIT = 20;
const ProductPage = () => {
    const [page, setPage] = useState(1);
    const { isLoading, error, data } = useGetProductsQuery({ page, limit: LIMIT });
    const totalPages = data?.totalPages ?? 1;
    const pages = usePagination(page, totalPages);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-10 text-center text-red-500">
                Error loading products.
            </div>
        );
    }

    return (
        <section className="py-10 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {data?.data.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <div className="flex gap-4 w-full justify-between md:mt-10 mt-6 items-center">
                    <p className="text-xs flex-1 text-muted-foreground">
                        Page {page} of {totalPages} — {data?.total} products
                    </p>
                    {
                        totalPages > 1 && <>
                            <Pagination>
                                <PaginationContent>
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
                                                    className="cursor-pointer"
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


                        </>
                    }
                </div>
            </div>

        </section>
    );
};

export default ProductPage;
