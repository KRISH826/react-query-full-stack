import { Product } from "@/types/product";
import { baseApi } from "./baseQuery";
import { Category, CategoryCreatePayload } from "@/types/category";

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCategory: builder.mutation<Category, CategoryCreatePayload>({
            query: (payload: CategoryCreatePayload) => ({
                url: "categories",
                method: "POST",
                body: payload
            }),
            invalidatesTags: [{ type: "Category", id: "LIST" }],
        }),

        getCategoriesById: builder.query<Category, string>({
            query: (id: string) => ({
                url: `categories/${id}`,
                method: "GET",
            }),
            transformResponse: (response: { category: Category }) => response.category,
            providesTags: ["Category"],
        }),

         deleteCategory: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id: string) => ({
                url: `categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),

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
        }),
})

export const { useGetAllCategoriesQuery, useGetProductsByCategoriesQuery, useDeleteCategoryMutation, useCreateCategoryMutation, useGetCategoriesByIdQuery } = categoryApi;