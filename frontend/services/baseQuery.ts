import { BaseQueryFn, createApi, fetchBaseQuery, FetchArgs, FetchBaseQueryError, retry } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
        let token = null;
        if (typeof window !== "undefined") {
            token = localStorage.getItem("token");
            if (!token) {
                const match = document.cookie.match(/(^| )token=([^;]+)/);
                token = match ? match[2] : null;
            }
        }
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    }
});
const baseQueryWithAuth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {

    const result = await rawBaseQuery(args, api, extraOptions);

    // Agar token expire ho gaya ya invalid hai (401 status)
    if (result?.error?.status === 401) {
        if (typeof window !== "undefined") {
            // Check Environment for Secure flag
            const isProd = process.env.NODE_ENV === 'production';
            const secureFlag = isProd ? "Secure;" : "";

            document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; ${secureFlag}`;
            document.cookie = `role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; ${secureFlag}`;
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
    }

    return result;
};

const baseQuery = retry(baseQueryWithAuth, {
    maxRetries: 0,
})

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQuery,
    tagTypes: ["Product", "User", "Cart", "Order", "Favourite", "Reviews", "Category"],
    endpoints: () => ({}),
});
