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

interface SearchProductsParams {
    query: string;
    limit?: number;
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
        deleteProduct: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Product", id: "LIST" }],
        }),
        createProduct: builder.mutation<Product, Partial<Product>>({
            query: (data) => ({
                url: "products",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "Product", id: "LIST" }],
        }),
        getSearchProducts: builder.query<ProductsResponse, SearchProductsParams>({
            query: ({ query, limit = 10 }) =>
                `search-products/search?q=${query}&limit=${limit}`,
            transformResponse: (response: ProductsResponse) => response,
            providesTags: [{ type: "Product", id: "LIST" }],
        }),
    })
})

export const { useGetProductsQuery, useGetProductByIdQuery, useGetSearchProductsQuery, useDeleteProductMutation, useCreateProductMutation } = productApi;