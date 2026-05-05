"use client"

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { useClientSearchProductsQuery } from '@/services/productApi';
import { Product } from '@/types/product';

import ProductCard from '../../product/_components/ProductCard';
import ProductFilter from './ProductFilter';

const ProductSearchPage = () => {
    const params = useSearchParams();
    const query = params.get("q") || "";
    const { data, isLoading, error } = useClientSearchProductsQuery(query, {
        skip: !query,
    });

    const categoryCounts = useMemo(() => {
        const counts = new Map<string, number>();

        (data ?? []).forEach((product) => {
            product.categories?.forEach((category) => {
                counts.set(category.name, (counts.get(category.name) ?? 0) + 1);
            });
        });

        return counts;
    }, [data]);

    const categories = useMemo(() => {
        if (categoryCounts.size > 0) {
            return [...categoryCounts.keys()].slice(0, 10);
        }

        return ["T-Shirts", "Shirts", "Jeans", "Jackets", "Hoodies", "Shoes"];
    }, [categoryCounts]);

    const allPrices = useMemo(() => {
        return (data ?? [])
            .map((product) => product.variants?.[0]?.offer_price_override ?? product.variants?.[0]?.price_override)
            .filter((price): price is number => typeof price === "number" && !Number.isNaN(price));
    }, [data]);

    const minPrice = useMemo(() => {
        if (allPrices.length === 0) return 0;
        return Math.floor(Math.min(...allPrices));
    }, [allPrices]);

    const maxPrice = useMemo(() => {
        if (allPrices.length === 0) return 10000;
        return Math.ceil(Math.max(...allPrices));
    }, [allPrices]);

    const sliderMax = useMemo(() => Math.max(maxPrice, minPrice + 1), [maxPrice, minPrice]);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [priceLimit, setPriceLimit] = useState<number>(maxPrice);

    useEffect(() => {
        setPriceLimit(maxPrice);
    }, [maxPrice]);

    const toggleCategory = (name: string) => {
        setSelectedCategories((prev) =>
            prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
        );
    };

    const toggleSize = (size: string) => {
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
        );
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedSizes([]);
        setSelectedRating(null);
        setPriceLimit(maxPrice);
    };

    const activeFilterCount =
        selectedCategories.length +
        selectedSizes.length +
        (selectedRating ? 1 : 0) +
        (priceLimit !== maxPrice ? 1 : 0);



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
                                data={data}
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
                                isMobile={true}
                            />
                        </SheetContent>
                    </Sheet>
                </div>
                <div className="grid items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
                    <aside className="hidden py-4 border-r border-stone-200 lg:block lg:sticky lg:top-20">
                        <ProductFilter
                            data={data}
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
                        />
                    </aside>

                    <div className="grid grid-cols-2 lg:pt-5 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {data?.map((product: Product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSearchPage;
