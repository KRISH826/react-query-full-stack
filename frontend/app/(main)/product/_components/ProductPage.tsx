"use client";

import { Spinner } from "@/components/ui/spinner";
import { useGetProductsQuery } from "@/services/productApi";
import ProductCard from "./ProductCard";

const ProductPage = () => {
    const { isLoading, error, data } = useGetProductsQuery();

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
                <div className="
          grid gap-5
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
        ">
                    {data?.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductPage;
