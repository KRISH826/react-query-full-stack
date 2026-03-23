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
        getProductsByCategories: builder.query<{ data: Product[]; total: number },
            { categoryId: string; slug: string; limit: number; page: number }>({
                query: ({ categoryId, slug, limit, page }) => `categories/products?slug=${slug}&id=${categoryId}&limit=${limit}&page=${page}`,
                transformResponse: (response: { products: { data: Product[]; total: number } }) => response.products,
                providesTags: ["Product"],
            })
    })
})

export const { useGetAllCategoriesQuery, useGetProductsByCategoriesQuery } = categoryApi;