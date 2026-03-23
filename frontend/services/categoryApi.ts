import { Product } from "@/types/product";
import { baseApi } from "./baseQuery";
import { Category } from "@/types/category";

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query<Category[], void>({
            query: () => ({
                url: "categories",
                method: "GET",
            }),
            transformResponse: (response: { categories: Category[] }) => response.categories,
            providesTags: ["Category"],
        }),
        getProductsByCategories: builder.query<Product[], { categoryId: string; limit: number; page: number }>({
            query: ({ categoryId, limit, page }) => `categories/${categoryId}/products?limit=${limit}&page=${page}`,
            transformResponse: (response: { data: Product[] }) => response.data,
            providesTags: ["Product"],
        })
    })
})

export const { useGetAllCategoriesQuery, useGetProductsByCategoriesQuery } = categoryApi;