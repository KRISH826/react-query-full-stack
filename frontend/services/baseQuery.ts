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

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});
// 2. Smart Interceptor for 401 Unauthorized
const baseQueryWithAuth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        const refreshResult = await baseQuery(
            { url: "/users/refresh", method: "POST" },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            const data = refreshResult.data as AuthResponse;

            api.dispatch(setAccessToken(data.accessToken));

            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(clearAccessToken());
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