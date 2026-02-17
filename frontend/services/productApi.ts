import { Product } from "@/types/product";
import { baseApi } from "./baseQuery";

interface ProductsResponse {
    data: Product[];
}

interface ProductResponse {
    product: Product;
}

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<Product[], void>({
            query: () => "products/?limit=20&page=1",
            transformResponse: (response: ProductsResponse) => response.data,
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
        getProductById: builder.query<Product, string>({
            query: (id: string) => `products/${id}`,
            transformResponse: (response: ProductResponse) => response.product,
            providesTags: (result, error, id) => [{ type: "Product", id }],
            keepUnusedDataFor: 300,
        }),
    })
})

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi;