"use client"
import { useSearchParams } from 'next/navigation'
import { useGetProductsByCategoriesQuery } from '@/services/categoryApi';
import { Spinner } from '@/components/ui/spinner';
import ProductCard from '@/app/(main)/product/_components/ProductCard';
import { Product } from '@/types/product';
import { useState } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";
import { Card, CardContent } from '@/components/ui/card';

const CategoryPage = () => {
    const searchParams = useSearchParams();
    const id = searchParams?.get('id') as string;
    const slug = searchParams?.get('slug') as string;
    const [page, setPage] = useState(1);

    const { data, isLoading, error } = useGetProductsByCategoriesQuery({
        categoryId: id,   // from URL params
        slug: slug || "",       // from URL params
        limit: 30,
        page: page,
    }, {
        skip: !id || !slug
    });

    const totalPages = Math.ceil((data?.total || 0) / 30);
    const pages = usePagination(page, totalPages);

    console.log(data);

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
        <div className="py-10 bg-white">
            <div className='container mx-auto'>
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {data?.data.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    {
                        data?.data.length === 0 && <>
                            <Card className="col-span-full">
                                <CardContent className='py-24'>
                                    <p className="text-center text-muted-foreground">No products found</p>
                                </CardContent>
                            </Card>
                        </>
                    }
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
        </div>
    )
}

export default CategoryPage