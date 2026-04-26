"use client"

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Spinner } from '@/components/ui/spinner';
import { useClientSearchProductsQuery } from '@/services/productApi';
import { Product } from '@/types/product';

import ProductCard from '../../product/_components/ProductCard';

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

    const renderFilterPanel = (isMobile = false) => (
        <div
            className={`px-5 py-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)] ${isMobile ? "rounded-2xl border-0 bg-transparent shadow-none" : "rounded-[26px] border border-stone-200 bg-white"
                }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-foreground p-2 text-background">
                        <SlidersHorizontal className="size-4" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold tracking-tight text-foreground">Filters</h2>
                        <p className="text-xs text-muted-foreground">Refine what you want to see</p>
                    </div>
                </div>

                {activeFilterCount > 0 && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-full border-stone-200 px-3 text-xs"
                        onClick={clearAllFilters}
                    >
                        Clear all
                    </Button>
                )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-foreground">
                    {activeFilterCount} active
                </span>
                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {data?.length ?? 0} results
                </span>
            </div>

            <div className="mt-5 space-y-5">
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">Category</h3>
                        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Browse</span>
                    </div>

                    <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
                        {categories.map((category) => (
                            <label
                                key={category}
                                className="flex cursor-pointer items-center justify-between rounded-xl px-2 py-2 transition-colors hover:bg-stone-50"
                            >
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        checked={selectedCategories.includes(category)}
                                        onCheckedChange={() => toggleCategory(category)}
                                    />
                                    <span className="text-sm text-foreground">{category}</span>
                                </div>

                                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                    {categoryCounts.get(category) ?? 0}
                                </span>
                            </label>
                        ))}
                    </div>
                </section>

                <Separator className="bg-stone-200" />

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">Price</h3>
                        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-foreground">
                            Up to Rs {priceLimit.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Rs {minPrice.toLocaleString()}</span>
                        <span>Rs {sliderMax.toLocaleString()}</span>
                    </div>

                    <Slider
                        value={[priceLimit]}
                        min={minPrice}
                        max={sliderMax}
                        step={100}
                        onValueChange={(value) => setPriceLimit(value[0] ?? minPrice)}
                        className="w-full"
                    />

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Budget</span>
                        <span>Premium</span>
                    </div>
                </section>

                <Separator className="bg-stone-200" />

                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">Reviews</h3>
                        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Quality</span>
                    </div>

                    <div className="space-y-1">
                        {[4, 3, 2].map((rating) => (
                            <button
                                key={rating}
                                type="button"
                                onClick={() => setSelectedRating((prev) => (prev === rating ? null : rating))}
                                className={`
                                    flex w-full items-center justify-between rounded-xl px-2 py-2.5 text-sm transition-colors
                                    ${selectedRating === rating
                                        ? "bg-stone-100 text-foreground"
                                        : "text-foreground hover:bg-stone-50"
                                    }
                                `}
                            >
                                <span className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <Star
                                            key={idx}
                                            className={`size-3.5 ${idx < rating ? "fill-current" : ""}`}
                                        />
                                    ))}
                                </span>
                                <span className="text-xs font-medium">&amp; up</span>
                            </button>
                        ))}
                    </div>
                </section>

                <Separator className="bg-stone-200" />

                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">Size</h3>
                        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Fit</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(size)}
                                className={`
                                    rounded-full border px-2 py-2 text-xs font-semibold tracking-wide transition-colors
                                    ${selectedSizes.includes(size)
                                        ? "border-foreground bg-foreground text-background"
                                        : "border-stone-200 bg-white text-foreground hover:border-stone-300 hover:bg-stone-50"
                                    }
                                `}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
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
        <div className="bg-gradient-to-b from-stone-50 to-white py-8 md:py-10">
            <div className="mx-auto w-full max-w-[1600px] px-4 md:px-6 xl:px-8">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <h1 className="text-lg font-bold text-foreground md:text-2xl">
                        Search Results for <span className="text-primary">&quot;{query}&quot;</span>
                    </h1>
                    <p className="text-xs text-muted-foreground md:text-sm">
                        Found {data?.length || 0} items
                    </p>
                </div>

                <div className="mb-5 flex items-center justify-between lg:hidden">
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

                        <SheetContent side="left" className="scrollbar-hide w-[92vw] max-w-[360px] overflow-y-auto bg-secondary/30 p-3 sm:w-[360px] sm:p-4">
                            <SheetTitle className="sr-only">Product Filters</SheetTitle>
                            {renderFilterPanel(true)}
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
                    <aside className="hidden lg:block lg:sticky lg:top-20">
                        {renderFilterPanel()}
                    </aside>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
