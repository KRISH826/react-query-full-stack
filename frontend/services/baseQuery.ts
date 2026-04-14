import {
    BaseQueryFn,
    createApi,
    fetchBaseQuery,
    FetchArgs,
    FetchBaseQueryError,
    retry,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "@/store/store";
import { clearAccessToken } from "@/store/slice/userSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        let token = (getState() as RootState).auth.accessToken;
        if (!token && typeof window !== "undefined") {
            token = localStorage.getItem("token");
        }
        if (token && token !== "undefined" && token !== "null") {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithAuth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        const state = api.getState() as RootState;

        // Grab token from state OR localStorage
        const currentToken = state.auth.accessToken ||
            (typeof window !== "undefined" ? localStorage.getItem("token") : null);

        const isValidToken = currentToken && currentToken !== "undefined" && currentToken !== "null";

        // 🔥 Only trigger the logout sequence if we actually HAD a token that the server rejected
        if (isValidToken) {
            api.dispatch(clearAccessToken());

            if (
                typeof window !== "undefined" &&
                !window.location.pathname.includes("/login")
            ) {
                localStorage.removeItem("token");
                document.cookie = "role=; path=/; max-age=0; SameSite=Lax";
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