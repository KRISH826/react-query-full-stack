import { Product } from "@/types/product";
import { baseApi } from "./baseQuery";
import { Category, CategoryCreatePayload, CategoryUpdatePayload } from "@/types/category";

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createCategory: builder.mutation<Category, CategoryCreatePayload>({
            query: (payload) => ({
                url: "categories",
                method: "POST",
                body: payload,
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
            invalidatesTags: (result, error, id) => [
                { type: "Category", id },
                { type: "Category", id: "LIST" },
            ],
        }),

        updateCategory: builder.mutation<Category, { id: string; data: CategoryUpdatePayload }>({
            query: ({ id, data }) => ({
                url: `categories/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Category", id },
                { type: "Category", id: "LIST" },
            ],
        }),

        getAllCategories: builder.query<Category[], void>({
            query: () => ({
                url: "categories",
                method: "GET",
            }),
            transformResponse: (response: { categories: Category[] }) => response.categories,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: "Category" as const, id })),
                        { type: "Category", id: "LIST" },
                    ]
                    : [{ type: "Category", id: "LIST" }],
        }),
        getProductsByCategories: builder.query<{ data: Product[]; total: number },
            { categoryId: string; slug: string; limit: number; page: number }>({
                query: ({ categoryId, slug, limit, page }) => `categories/products?slug=${slug}&id=${categoryId}&limit=${limit}&page=${page}`,
                transformResponse: (response: { products: { data: Product[]; total: number } }) => response.products,
                providesTags: ["Product"],
            })
    }),
})

export const { useGetAllCategoriesQuery, useGetProductsByCategoriesQuery, useDeleteCategoryMutation, useCreateCategoryMutation, useGetCategoriesByIdQuery, useUpdateCategoryMutation } = categoryApi;
