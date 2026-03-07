"use client"

import { useGetSearchProductsQuery } from '@/services/productApi';
import { useSearchParams } from 'next/navigation';

const ProductSearchPage = () => {
    const params = useSearchParams();
    const query = params.get("q") || "";
    const { data, isLoading } = useGetSearchProductsQuery(
        { query },
        { skip: !query }
    )
    console.log(data);
    return (
        <div>ProductSearchPage</div>
    )
}

export default ProductSearchPage