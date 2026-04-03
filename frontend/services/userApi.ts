import { baseApi } from "./baseQuery";
import { setAccessToken, clearAccessToken } from "@/store/slice/userSlice";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types/user";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // ✅ LOGIN
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: "users/login",
                method: "POST",
                body: credentials,
            }),

            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setAccessToken(data.accessToken));
                    localStorage.setItem("token", data.accessToken);
                    localStorage.setItem("user", JSON.stringify(data.user));

                    // 🔥 Set cookies on frontend domain so proxy.ts can read them
                    const role = data.user?.role || "customer";
                    const maxAge = 60 * 60 * 24 * 7;
                    document.cookie = `token=${data.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
                    document.cookie = `role=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;
                } catch (err) {
                    console.log(err);
                }
            },
        }),
        registerUser: builder.mutation<AuthResponse, RegisterRequest>({
            query: (credentials) => ({
                url: "users/register",
                method: "POST",
                body: credentials,
            }),
        }),

        getProfile: builder.query<User, void>({
            query: () => "users/profile",
            transformResponse: (res: { user: User }) => res.user,
            providesTags: [{ type: "User", id: "PROFILE" }],
        }),

        // ✅ LOGOUT
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "users/logout",
                method: "POST",
            }),

            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                } finally {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    dispatch(clearAccessToken());

                    // 🔥 Clear frontend cookies so proxy.ts knows user is logged out
                    document.cookie = "token=; path=/; max-age=0";
                    document.cookie = "role=; path=/; max-age=0";

                    window.location.href = "/login";
                }
            },
        }),

    }),
});

export const {
    useLoginMutation,
    useRegisterUserMutation,
    useGetProfileQuery,
    useLogoutMutation
} = userApi;