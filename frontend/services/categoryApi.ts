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
        })
    })
})

export const { useGetAllCategoriesQuery } = categoryApi;