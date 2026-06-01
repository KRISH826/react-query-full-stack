"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { ProductFilterResponse } from "@/types/filter";

interface ProductFilterProps {
    filters: ProductFilterResponse | undefined;
    productsCount: number;
    selectedBrands: string[];
    toggleBrand: (name: string) => void;
    selectedCategories: string[];
    toggleCategory: (name: string) => void;
    selectedSizes: string[];
    toggleSize: (size: string) => void;
    selectedRating: number | null;
    setSelectedRating: (rating: number | null | ((prev: number | null) => number | null)) => void;
    priceLimit: number;
    setPriceLimit: (price: number) => void;
    clearAllFilters: () => void;
    activeFilterCount: number;
    isMobile?: boolean;
}

const ProductFilter = ({
    filters,
    productsCount,
    selectedBrands,
    toggleBrand,
    selectedCategories,
    toggleCategory,
    selectedSizes,
    toggleSize,
    selectedRating,
    setSelectedRating,
    priceLimit,
    setPriceLimit,
    clearAllFilters,
    activeFilterCount,
    isMobile = false
}: ProductFilterProps) => {

    return (
        <div
            className={`rounded-2xl border-0 bg-transparent shadow-none ${isMobile ? "px-5 py-5" : "px-0 pr-4!"
                }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight text-foreground">Filters</h2>
                        <p className="text-xs text-muted-foreground">Refine what you want to see</p>
                    </div>
                </div>

                {!isMobile && activeFilterCount > 0 && (
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
                {/* <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {filters?.length ?? 0} results
                </span> */}
            </div>

            <div className="mt-5 space-y-5">
                 {filters?.brands && filters.brands.length > 0 && (
                    <>
                        <section className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-foreground">Brand</h3>
                                <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Make</span>
                            </div>
                            <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
                                {filters.brands.map((brand) => (
                                    <label key={brand.name}
                                        className="flex cursor-pointer items-center justify-between rounded-xl px-2 py-2 transition-colors hover:bg-stone-50">
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                checked={selectedBrands.includes(brand.name)}
                                                onCheckedChange={() => toggleBrand(brand.name)}
                                            />
                                            <span className="text-sm text-foreground">{brand.name}</span>
                                        </div>
                                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                            {brand.count}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </section>
                        <Separator className="bg-stone-200" />
                    </>
                )}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">Category</h3>
                        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Browse</span>
                    </div>

                    <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
                        {filters?.categories?.map((category) => (
                            <label
                                key={category.name}
                                className="flex cursor-pointer items-center justify-between rounded-xl px-2 py-2 transition-colors hover:bg-stone-50"
                            >
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        checked={selectedCategories.includes(category.name)}
                                        onCheckedChange={() => toggleCategory(category.name)}
                                    />
                                    <span className="text-sm text-foreground">{category.name}</span>
                                </div>

                                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                    {category.count}
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
                        <span>Rs {filters?.priceRange.min}</span>
                        <span>Rs {filters?.priceRange.max}</span>
                    </div>

                    <Slider
                        value={[priceLimit]}
                        min={filters?.priceRange.min || 0}
                        max={filters?.priceRange.max || 10000}
                        step={100}
                        onValueChange={(value) => setPriceLimit(value[0] ?? 0)}
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
                        {filters?.ratings?.map((item) => {
                            const ratingValue = Number(item.rating);
                            return (
                                <button
                                    key={item.rating}
                                    type="button"
                                    onClick={() => setSelectedRating((prev) => (prev === ratingValue ? null : ratingValue))}
                                    className={`
                                        flex w-full items-center justify-between rounded-xl px-2 py-2.5 text-sm transition-colors
                                        ${selectedRating === ratingValue
                                            ? "bg-stone-100 text-foreground"
                                            : "text-foreground hover:bg-stone-50"
                                        }
                                    `}
                                >
                                    <span className="flex items-center gap-1">
                                        {Array.from({ length: 5 }).map((_, idx) => (
                                            <Star
                                                key={idx}
                                                className={`size-3.5 ${idx < ratingValue ? "fill-current" : ""}`}
                                            />
                                        ))}
                                    </span>
                                    <span className="text-xs font-medium">&amp; up <span className="text-[10px] text-muted-foreground ml-1">({item.count})</span></span>
                                </button>
                            );
                        })}
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
};

export default ProductFilter;
