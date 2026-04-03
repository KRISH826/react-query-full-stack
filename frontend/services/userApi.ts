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
                    localStorage.setItem("user", JSON.stringify(data.user));

                } catch (err) {
                    console.log(err);
                }
            },
        }),

        // ✅ REGISTER
        registerUser: builder.mutation<AuthResponse, RegisterRequest>({
            query: (credentials) => ({
                url: "users/register",
                method: "POST",
                body: credentials,
            }),
        }),

        // ✅ PROFILE
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
                    localStorage.removeItem("user");
                    dispatch(clearAccessToken());
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