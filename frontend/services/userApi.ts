import { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types/user";
import { baseApi } from "./baseQuery";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: "users/login",
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.accessToken) {
                        localStorage.setItem("token", data.accessToken);
                        localStorage.setItem("user", JSON.stringify(data.user));
                    }

                } catch (error) {
                    console.log(error);
                }
            },
            invalidatesTags: [{ type: "User", id: "PROFILE" }],
        }),

        registerUser: builder.mutation<AuthResponse, RegisterRequest>({
            query: (credentials) => ({
                url: "users/register",
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.accessToken) {
                        localStorage.setItem("token", data.accessToken);
                        localStorage.setItem("user", JSON.stringify(data.user));
                    }

                } catch (error) {
                    console.log(error);
                }
            },
            invalidatesTags: [{ type: "User", id: "PROFILE" }],
        }),

        getProfile: builder.query<User, void>({
            query: () => "users/profile",
            transformResponse: (response: { user: User }) => response.user,
            providesTags: [{ type: "User", id: "PROFILE" }],
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: "users/logout",
                method: "POST",
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } finally {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            },
        }),

    })
})

export const { useLoginMutation, useGetProfileQuery, useLogoutMutation, useRegisterUserMutation } = userApi;