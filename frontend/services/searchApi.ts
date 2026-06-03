import { AirecommendationResponse } from "@/types/airecommended";
import { baseApi } from "./baseQuery";

export const searchApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        aiproductSearch: builder.mutation<AirecommendationResponse, string>({
            query: (query) => ({
                url: "assistant/chat",
                method: "POST",
                body: {
                    query,
                },
            }),
        }),
    }),
});

export const {
    useAiproductSearchMutation,
} = searchApi;