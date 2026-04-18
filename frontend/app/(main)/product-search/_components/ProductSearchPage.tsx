"use client"

import { useClientSearchProductsQuery } from '@/services/productApi';
import { Product } from '@/types/product';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../../product/_components/ProductCard';
import { Spinner } from '@/components/ui/spinner';

const ProductSearchPage = () => {
    const params = useSearchParams();
    const query = params.get("q") || "";
    const { data, isLoading, error } = useClientSearchProductsQuery(
        query,
        { skip: !query }
    )
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
            <div className="container">
                <div className="flex items-center mb-6 justify-between">
                    <h1 className="text-xl font-bold">Search Results for {query}</h1>
                </div>
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {data?.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProductSearchPage