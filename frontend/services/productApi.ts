import { Product } from "@/types/product";
import { baseApi } from "./baseQuery";

interface ApiResponse<T> {
    data: T;
}

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<Product[], void>({
            query: () => "products/?limit=20&page=1",
            transformResponse: (response: ApiResponse<Product[]>) => response.data,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: "Product" as const,
                            id,
                        })),
                        { type: "Product", id: "LIST" },
                    ]
                    : [{ type: "Product", id: "LIST" }],

            keepUnusedDataFor: 300,
        }),
        getProductById: builder.query<Product, number>({
            query: (id: number) => `products/${id}`,
            transformResponse: (response: ApiResponse<Product>) => response.data,
            providesTags: (result, error, id) => [{ type: "Product", id }],
            keepUnusedDataFor: 300,
        }),
    })
})

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi;