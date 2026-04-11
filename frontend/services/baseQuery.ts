import {
    BaseQueryFn,
    createApi,
    fetchBaseQuery,
    FetchArgs,
    FetchBaseQueryError,
    retry
} from "@reduxjs/toolkit/query/react";
import { RootState } from "@/store/store";
import { setAccessToken, clearAccessToken } from "@/store/slice/userSlice";
import { AuthResponse } from "@/types/user";

// 1. Raw API Query with Auth Headers
const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include", // 🔥 MUST for backend cookies
    prepareHeaders: (headers, { getState }) => {
        // Fetch from Redux first, fallback to localStorage
        let token = (getState() as RootState).auth?.accessToken;
        if (!token && typeof window !== "undefined") {
            token = localStorage.getItem("token");
        }

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// 2. Smart Interceptor for 401 Unauthorized
const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);
    const isRefreshCall = typeof args === "object" && args.url?.includes("/users/refresh");

    if (result?.error?.status === 401 && !isRefreshCall) {
        const refreshResult = await rawBaseQuery(
            { url: "users/refresh", method: "POST" },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            const newAccessToken = (refreshResult.data as AuthResponse).accessToken;
            api.dispatch(setAccessToken(newAccessToken));

            if (typeof window !== "undefined") {
                localStorage.setItem("token", newAccessToken);
                document.cookie = `token=${newAccessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
            }

            result = await rawBaseQuery(args, api, extraOptions);
        } else {
            api.dispatch(clearAccessToken());
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                document.cookie = "token=; path=/; max-age=0";
                document.cookie = "role=; path=/; max-age=0";
                const currentPath = window.location.pathname;

                const publicRoutes = ["/product", "/categories", "/product-search", "/login", "/register", "/"];
                const isPublicRoute = publicRoutes.some(route =>
                    currentPath === route || currentPath.startsWith(`${route}/`)
                );

                // Agar user kisi private page par tha, toh login par bhejo with Callback URL
                if (!isPublicRoute) {
                    window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
                }
            }
        }
    }

    return result;
};

// 3. Create and Export Base API
export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: retry(baseQueryWithAuth, { maxRetries: 0 }),
    tagTypes: ["User", "Product", "Cart", "Order", "Favourite", "Category", "Reviews"],
    endpoints: () => ({}),
});