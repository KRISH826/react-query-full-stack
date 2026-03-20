import { CreateReviewPayload, ReviewData } from "@/types/review";
import { baseApi } from "./baseQuery";

interface BackendReviewResponse {
    success: boolean;
    message: string;
    data: ReviewData;
}

interface BackendMutationResponse {
    success: boolean;
    message: string;
}

export const reviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProductReviews: builder.query<ReviewData, { productId: string; page?: number; limit?: number }>({
            query: ({ productId, page = 1, limit = 10 }) => ({
                url: `reviews/${productId}`,
                method: "GET",
                params: { page, limit },
            }),
            transformResponse: (response: BackendReviewResponse) => response.data,
            providesTags: (_, __, { productId }) => [{ type: "Reviews", id: productId }],
        }),

        addReview: builder.mutation<BackendMutationResponse, CreateReviewPayload>({
            query: (body) => ({
                url: `reviews`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_, __, { product_id }) => [
                { type: "Reviews", id: product_id },
                { type: "Product", id: product_id },
            ],
        }),

    }),
});

export const {
    useGetProductReviewsQuery,
    useAddReviewMutation,
} = reviewApi;