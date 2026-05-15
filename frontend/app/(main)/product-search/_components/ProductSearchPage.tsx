"use client"

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { useClientSearchProductsQuery, useGetProductFiltersQuery, useSearchProductsQuery } from '@/services/productApi';
import { Category, Product, ProductVariant } from '@/types/product';

import ProductCard from '../../product/_components/ProductCard';
import ProductFilter from './ProductFilter';

const ProductSearchPage = () => {
    const params = useSearchParams();
    const query = params.get("q") || "";
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [priceLimit, setPriceLimit] = useState<number>(0);
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(query), 300);
        return () => clearTimeout(t);
    }, [])

    const { data: filters, isLoading: isFilterLoading } = useGetProductFiltersQuery(query, {
        skip: !debouncedQuery,
    });

    const maxPrice = filters?.priceRange?.max ?? 0;  // ← yeh line add karo
    const effectivePriceLimit = priceLimit === 0 && maxPrice > 0 ? maxPrice : priceLimit;

    const { data, isLoading, error } = useSearchProductsQuery({
        q: debouncedQuery,
        brands: selectedBrands.length ? selectedBrands.join(",") : undefined,
        categories: selectedCategories.length ? selectedCategories.join(",") : undefined,
        sizes: selectedSizes.length ? selectedSizes.join(",") : undefined,
        min_rating: selectedRating ?? undefined
    }, { skip: !debouncedQuery });

    const productList = data?.data ?? [];

    const toggleCategory = (name: string) => {
        setSelectedCategories(prev =>
            prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
        );
    };

    const toggleSize = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size]
        );
    };

    const toggleBrand = (name: string) => {
        setSelectedBrands(prev =>
            prev.includes(name) ? prev.filter(b => b !== name) : [...prev, name]
        );
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedSizes([]);
        setSelectedRating(null);
        setPriceLimit(filters?.priceRange?.max || 0);
    };

    const activeFilterCount =
        selectedCategories.length +
        selectedSizes.length +
        selectedBrands.length +
        (selectedRating ? 1 : 0) +
        (
            priceLimit !== (filters?.priceRange?.max || 0)
                ? 1
                : 0
        );

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto w-full max-w-[1600px] px-4 py-10 text-center text-red-500 md:px-6 xl:px-8">
                Error loading products.
            </div>
        );
    }

    return (
        <div className="bg-linear-to-b from-stone-50 to-white py-8 md:py-10">
            <div className="mx-auto w-full max-w-400 px-4 md:px-6 xl:px-8">
                <div className="pb-3.5 border-b border-gray-200 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <h1 className="text-lg font-bold text-foreground md:text-2xl">
                        Search Results for <span className="text-primary">&quot;{query}&quot;</span>
                    </h1>
                    <p className="text-xs text-muted-foreground md:text-sm">
                        Found {data?.length || 0} items
                    </p>
                </div>

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
                                selectedBrands={selectedBrands}
                                toggleBrand={toggleBrand}
                                selectedCategories={selectedCategories}
                                toggleCategory={toggleCategory}
                                selectedSizes={selectedSizes}
                                toggleSize={toggleSize}
                                selectedRating={selectedRating}
                                setSelectedRating={setSelectedRating}
                                priceLimit={priceLimit}
                                setPriceLimit={setPriceLimit}
                                clearAllFilters={clearAllFilters}
                                activeFilterCount={activeFilterCount}
                                isMobile={true} productsCount={0} />
                        </SheetContent>
                    </Sheet>
                </div>
                <div className="grid items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
                    <aside className="hidden py-4 border-r border-stone-200 lg:block lg:sticky lg:top-20">
                        <ProductFilter
                            filters={filters}
                            selectedBrands={selectedBrands}
                            toggleBrand={toggleBrand}
                            selectedCategories={selectedCategories}
                            toggleCategory={toggleCategory}
                            selectedSizes={selectedSizes}
                            toggleSize={toggleSize}
                            selectedRating={selectedRating}
                            setSelectedRating={setSelectedRating}
                            priceLimit={priceLimit}
                            setPriceLimit={setPriceLimit}
                            clearAllFilters={clearAllFilters}
                            activeFilterCount={activeFilterCount}
                            productsCount={0}
                        />
                    </aside>

                    <div className="grid grid-cols-2 lg:pt-5 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {productList?.map((product: Product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSearchPage;
