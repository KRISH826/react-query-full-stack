"use client";

import Loading from "@/components/ui/common/Loading";
import { ProductCardSkeletonGrid } from "@/components/ui/common/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useGetProductFiltersQuery, useSearchProductsQuery } from "@/services/productApi";
import { Product } from "@/types/product";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "../../product/_components/ProductCard";
import ProductFilter from "./ProductFilter";

const ProductSearchPage = () => {
    const params = useSearchParams();
    const query = params.get("q") || "";
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [priceLimit, setPriceLimit] = useState<number | null>(null);
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedQuery(query), 300);
        return () => clearTimeout(timeout);
    }, [query]);

    const { data: filters } = useGetProductFiltersQuery(query, {
        skip: !debouncedQuery,
    });

    const maxPrice = filters?.priceRange?.max ?? 0;
    const effectivePriceLimit = priceLimit ?? maxPrice;

    const { data, isLoading, isFetching, error } = useSearchProductsQuery(
        {
            q: debouncedQuery,
            brands: selectedBrands.length ? selectedBrands.join(",") : undefined,
            categories: selectedCategories.length ? selectedCategories.join(",") : undefined,
            sizes: selectedSizes.length ? selectedSizes.join(",") : undefined,
            min_rating: selectedRating ?? undefined,
        },
        { skip: !debouncedQuery }
    );

    const productList = data?.data ?? [];
    const isProductsLoading = isLoading || isFetching;

    const toggleCategory = (name: string) => {
        setSelectedCategories((previousCategories) =>
            previousCategories.includes(name)
                ? previousCategories.filter((category) => category !== name)
                : [...previousCategories, name]
        );
    };

    const toggleSize = (size: string) => {
        setSelectedSizes((previousSizes) =>
            previousSizes.includes(size)
                ? previousSizes.filter((selectedSize) => selectedSize !== size)
                : [...previousSizes, size]
        );
    };

    const toggleBrand = (name: string) => {
        setSelectedBrands((previousBrands) =>
            previousBrands.includes(name)
                ? previousBrands.filter((brand) => brand !== name)
                : [...previousBrands, name]
        );
    };

    const filteredProducts = productList.filter((product: Product) => {
        if (!product.variants || product.variants.length === 0) {
            return true;
        }

        const minVariantPrice = Math.min(
            ...product.variants.map((variant) => variant.price_override ?? Infinity)
        );

        return minVariantPrice <= effectivePriceLimit;
    });

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedSizes([]);
        setSelectedBrands([]);
        setSelectedRating(null);
        setPriceLimit(null);
    };

    const activeFilterCount =
        selectedCategories.length +
        selectedSizes.length +
        selectedBrands.length +
        (selectedRating ? 1 : 0) +
        (effectivePriceLimit !== maxPrice ? 1 : 0);
    const hasProducts = filteredProducts.length > 0;
    const hasFilterData = Boolean(filters);
    const isInitialProductsLoading = isLoading && !data;
    const isFilterProductsLoading = !isInitialProductsLoading && isProductsLoading;
    const shouldShowFilters = hasFilterData && (isFilterProductsLoading || hasProducts);
    const displayedProductCount = isFilterProductsLoading ? data?.total ?? 0 : filteredProducts.length;

    if (error) {
        return (
            <div className="mx-auto w-full max-w-400 px-4 py-10 text-center text-red-500 md:px-6 xl:px-8">
                Error loading products.
            </div>
        );
    }

    if (isInitialProductsLoading) {
        return (
            <div className="bg-linear-to-b from-stone-50 to-white py-8 md:py-10">
                <div className="mx-auto flex min-h-[50vh] w-full max-w-400 items-center justify-center px-4 md:px-6 xl:px-8">
                    <Loading />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-linear-to-b from-stone-50 to-white py-8 md:py-10">
            <div className="mx-auto w-full max-w-400 px-4 md:px-6 xl:px-8">
                <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-3.5 sm:flex-row sm:items-center">
                    <h1 className="text-lg font-bold text-foreground md:text-2xl">
                        Search Results for <span className="text-primary">&quot;{query}&quot;</span>
                    </h1>
                    <p className="text-xs text-muted-foreground md:text-sm">
                        Found {displayedProductCount} items
                    </p>
                </div>

                {shouldShowFilters && (
                    <div className="my-3 flex items-center justify-between lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button type="button" size="sm" className="gap-2 shadow-sm">
                                    <SlidersHorizontal className="size-4" />
                                    Filters
                                    {activeFilterCount > 0 && (
                                        <span className="rounded-full bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-background">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="left" className="scrollbar-hide w-[80vw] max-w-90 overflow-y-auto bg-white/95 p-3 sm:w-90 sm:p-4">
                                <SheetTitle className="sr-only">Product Filters</SheetTitle>
                                <ProductFilter
                                    filters={filters}
                                    productsCount={filteredProducts.length}
                                    selectedBrands={selectedBrands}
                                    toggleBrand={toggleBrand}
                                    selectedCategories={selectedCategories}
                                    toggleCategory={toggleCategory}
                                    selectedSizes={selectedSizes}
                                    toggleSize={toggleSize}
                                    selectedRating={selectedRating}
                                    setSelectedRating={setSelectedRating}
                                    priceLimit={effectivePriceLimit}
                                    setPriceLimit={(nextPrice) => setPriceLimit(nextPrice)}
                                    clearAllFilters={clearAllFilters}
                                    activeFilterCount={activeFilterCount}
                                    isMobile={true}
                                />
                            </SheetContent>
                        </Sheet>
                    </div>
                )}

                {!isFilterProductsLoading && !hasProducts ? (
                    <div className="mt-4 flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-stone-50/70 px-6 py-16 text-center">
                        <h2 className="text-xl font-semibold text-foreground">No products found</h2>
                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            We couldn&apos;t find any products matching your search right now.
                        </p>
                        {activeFilterCount > 0 && (
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-5 rounded-full"
                                onClick={clearAllFilters}
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
                        {hasFilterData && (
                            <aside className="hidden border-r border-stone-200 py-4 lg:sticky lg:top-20 lg:block">
                                <ProductFilter
                                    filters={filters}
                                    productsCount={filteredProducts.length}
                                    selectedBrands={selectedBrands}
                                    toggleBrand={toggleBrand}
                                    selectedCategories={selectedCategories}
                                    toggleCategory={toggleCategory}
                                    selectedSizes={selectedSizes}
                                    toggleSize={toggleSize}
                                    selectedRating={selectedRating}
                                    setSelectedRating={setSelectedRating}
                                    priceLimit={effectivePriceLimit}
                                    setPriceLimit={(nextPrice) => setPriceLimit(nextPrice)}
                                    clearAllFilters={clearAllFilters}
                                    activeFilterCount={activeFilterCount}
                                />
                            </aside>
                        )}

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:pt-5 lg:grid-cols-4 xl:grid-cols-5">
                            {isFilterProductsLoading ? (
                                <ProductCardSkeletonGrid />
                            ) : (
                                filteredProducts.map((product: Product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductSearchPage;
