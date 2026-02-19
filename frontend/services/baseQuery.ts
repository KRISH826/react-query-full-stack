import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

const raqBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
        if (typeof window !== undefined) {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
        }
        headers.set("Content-Type", "application/json");
        return headers;
    }
})

const baseQuery = retry(raqBaseQuery, {
    maxRetries: 0,
})

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQuery,
    tagTypes: ["Product", "User", "Cart"],
    endpoints: () => ({}),
});
