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
    name?: string;
    brand?: string;
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
        deleteProduct: builder.mutation<{ success: boolean; message: string }, string | number>({
            query: (id) => ({
                url: `products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Product", id: "LIST" }],
        }),
        createProduct: builder.mutation<Product, FormData | Partial<Product>>({
            query: (data) => ({
                url: "products",
                method: "POST",
                body: data,
                formData: true,
            }),
            invalidatesTags: [{ type: "Product", id: "LIST" }],
        }),
        // update product
        updateProduct: builder.mutation<Product, { id: string; data: FormData | Partial<Product> }>({
            query: ({ id, data }) => ({
                url: `products/${id}`,
                method: "PUT",
                body: data,
                formData: true,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Product", id }, { type: "Product", id: "LIST" }],
        }),
        deleteProductImage: builder.mutation<{ success: boolean; message: string }, string | number>({
            query: (id) => ({
                url: `products/image/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Product", id: "LIST" }],
        }),
        searchProducts: builder.query<ProductsResponse, SearchProductsParams>({
            query: ({ name, brand, limit = 10 }) => {
                const params = new URLSearchParams();
                if (name) params.append("name", name);
                if (brand) params.append("brand", brand);
                params.append("limit", limit.toString());
                return `products/search?${params.toString()}`;
            },
            transformResponse: (response: ProductsResponse) => response,
            providesTags: [{ type: "Product", id: "LIST" }],
        }),

        clientSearchProducts: builder.query<Product[], string>({
            query: (query) => `search-products/search?q=${query}`,
            transformResponse: (response: ProductsResponse) => response.data,
            providesTags: [{ type: "Product", id: "LIST" }],
        })
    })
})

export const { useGetProductsQuery, useGetProductByIdQuery, useDeleteProductMutation, useCreateProductMutation, useUpdateProductMutation, useDeleteProductImageMutation, useSearchProductsQuery, useClientSearchProductsQuery } = productApi;
