import { BaseQueryFn, createApi, fetchBaseQuery, FetchArgs, FetchBaseQueryError, retry } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
        }
        headers.set("Content-Type", "application/json");
        return headers;
    }
})

// Auto-clear stale token when backend returns 401
const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Token is expired/invalid — clear everything so proxy.ts stops blocking /login
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            document.cookie = "token=; path=/; max-age=0";
        }
    }

    return result;
}

const baseQuery = retry(baseQueryWithAuth, {
    maxRetries: 0,
})

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQuery,
    tagTypes: ["Product", "User", "Cart", "Order", "Favourite"],
    endpoints: () => ({}),
});
