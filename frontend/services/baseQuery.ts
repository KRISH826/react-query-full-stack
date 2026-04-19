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

        const token =
            state.auth.accessToken ||
            (typeof window !== "undefined"
                ? localStorage.getItem("token")
                : null);

        // ✅ sirf tab logout jab actual token tha
        if (token && token !== "undefined" && token !== "null") {
            api.dispatch(clearAccessToken());

            if (typeof window !== "undefined") {
                localStorage.removeItem("token");

                if (!window.location.pathname.includes("/login")) {
                    window.location.href = "/login";
                }
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