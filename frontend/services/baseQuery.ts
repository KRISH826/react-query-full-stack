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

const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
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

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
    async (args, api, extraOptions) => {

        let result = await rawBaseQuery(args, api, extraOptions);

        const isRefreshCall =
            typeof args === "object" &&
            args.url?.includes("/users/refresh");

        if (result?.error?.status === 401 && !isRefreshCall) {

            const refreshResult = await rawBaseQuery(
                {
                    url: "users/refresh",
                    method: "POST",
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const newAccessToken = (refreshResult.data as AuthResponse).accessToken;

                api.dispatch(setAccessToken(newAccessToken));

                result = await rawBaseQuery(args, api, extraOptions);
            } else {
                api.dispatch(clearAccessToken());
                if (typeof window !== "undefined") {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    // 🔥 MUST clear cookies BEFORE redirect, otherwise proxy.ts sees
                    // the token cookie and bounces back → infinite loop
                    document.cookie = "token=; path=/; max-age=0";
                    document.cookie = "role=; path=/; max-age=0";
                    window.location.href = "/login";
                }
            }
        }

        return result;
    };

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: retry(baseQueryWithAuth, { maxRetries: 0 }),
    tagTypes: ["User", "Product", "Cart", "Order", "Favourite", "Category", "Reviews"],
    endpoints: () => ({}),
});