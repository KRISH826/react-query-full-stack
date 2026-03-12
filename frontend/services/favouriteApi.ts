import { FavouriteItem } from "@/types/favourite";
import { baseApi } from "./baseQuery";

export interface PaginatedFavouritesResponse {
    data: FavouriteItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface BackendFavouritesResponse {
    success: boolean;
    message: string;
    favourite: PaginatedFavouritesResponse;
}

interface BackendMutationResponse {
    success: boolean;
    message: string;
}


export const favouriteApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFavourites: builder.query<PaginatedFavouritesResponse, { page: number; limit: number }>({
            query: ({ page, limit }) => ({
                url: `favourites`,
                method: "GET",
                params: { page, limit }
            }),
            transformResponse: (response: BackendFavouritesResponse) => response.favourite,
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ product_id }) => ({ type: "Favourite" as const, id: product_id })),
                        { type: "Favourite", id: "USER_FAVOURITES" }
                    ]
                    : [{ type: "Favourite", id: "USER_FAVOURITES" }],
        }),
        addFavourite: builder.mutation<BackendMutationResponse, { productId: string }>({
            query: ({ productId }) => ({
                url: `favourites/${productId}`,
                method: "POST",
            }),
            invalidatesTags: [{ type: "Favourite", id: "USER_FAVOURITES" }],
        }),

        removeFavourite: builder.mutation<BackendMutationResponse, { productId: string }>({
            query: ({ productId }) => ({
                url: `favourites/${productId}`,
                method: "DELETE",
            }),
            async onQueryStarted({ productId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    favouriteApi.util.updateQueryData(
                        "getFavourites",
                        { page: 1, limit: 20 },
                        (draft) => {
                            const initialCount = draft.data.length;
                            draft.data = draft.data.filter(item => item.product_id !== productId);
                            if (draft.data.length < initialCount) {
                                draft.total = Math.max(0, draft.total - 1);
                            }
                        }
                    )
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo()
                }
            },
            invalidatesTags: (result, error, { productId }) => [
                { type: "Favourite", id: productId },
                { type: "Favourite", id: "USER_FAVOURITES" }
            ],
        })
    })
})

export const {
    useGetFavouritesQuery,
    useAddFavouriteMutation,
    useRemoveFavouriteMutation,
} = favouriteApi;
