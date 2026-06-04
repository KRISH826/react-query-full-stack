import { AirecommendationResponse } from "@/types/airecommended";
import { baseApi } from "./baseQuery";

export const searchApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        aiproductSearch: builder.mutation<AirecommendationResponse, string>({
            query: (message) => ({
                url: `assistant/chat?q=${encodeURIComponent(message)}`,
                method: "POST",
            }),
        }),
    }),
});


export const {
    useAiproductSearchMutation,
} = searchApi;
