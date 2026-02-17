import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

const raqBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
})

const baseQuery = retry(raqBaseQuery, {
    maxRetries: 3,
})

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQuery,
    tagTypes: ["Product"],
    endpoints: () => ({}),
});
