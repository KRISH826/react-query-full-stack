import { Product } from "@/types/product";
import { baseApi } from "./baseQuery";

export interface ProductsQueryParams {
    page: number;
    limit: number;
}

export interface ProductsResponse {
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface ProductResponse {
    data: Product;
}

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<ProductsResponse, ProductsQueryParams>({
            query: ({ page, limit }) => `products/?limit=${limit}&page=${page}`,
            transformResponse: (response: ProductsResponse) => response, // ✅ full response return karo
            providesTags: [{ type: "Product", id: "LIST" }],
        }),
        getProductById: builder.query<Product, string>({
            query: (id) => `products/${id}`,
            transformResponse: (response: ProductResponse) => response.data,
            providesTags: (result, error, id) => [{ type: "Product", id }],
        }),
    })
})

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi;