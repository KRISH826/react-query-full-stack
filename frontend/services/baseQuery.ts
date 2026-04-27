import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
  FetchArgs,
  FetchBaseQueryError,
  BaseQueryApi,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "@/store/store";
import { clearAccessToken } from "@/store/slice/userSlice";
import { clearClientAuth } from "@/lib/client-auth";

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

function clearAuthState(dispatch: BaseQueryApi["dispatch"]) {
  dispatch(clearAccessToken());

  if (typeof window !== "undefined") {
    clearClientAuth();
  }
}

// Prevent multiple simultaneous 401 redirects
let isRedirecting = false;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!isRedirecting) {
      isRedirecting = true;

      clearAuthState(api.dispatch);

      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
      setTimeout(() => {
        isRedirecting = false;
      }, 3000);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Product", "Cart", "Order", "Favourite", "Category", "Reviews"],
  endpoints: () => ({}),
});
