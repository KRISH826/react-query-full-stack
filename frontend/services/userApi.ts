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
                        const role = data.user?.role;
                        const maxAge = 60 * 60 * 24 * 7;

                        // cookies (middleware ke liye)
                        document.cookie = `token=${data.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
                        document.cookie = `role=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;

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
                        const role = data.user?.role;
                        const maxAge = 60 * 60 * 24 * 7;

                        document.cookie = `token=${data.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
                        document.cookie = `role=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;

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

        updateProfile: builder.mutation<User, User>({
            query: (user) => ({
                url: "users/profile",
                method: "PUT",
                body: user,
            }),
            invalidatesTags: [{ type: "User", id: "PROFILE" }],
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
                    document.cookie = "token=; path=/; max-age=0";
                    document.cookie = "role=; path=/; max-age=0";

                    window.location.href = "/login";
                }
            },
        }),
        verifyEmail: builder.mutation<void, { email: string, code: string }>({
            query: (credentials) => ({
                url: "users/verify-email",
                method: "POST",
                body: credentials,
            }),

            invalidatesTags: [{ type: "User", id: "PROFILE" }],
        }),
        resendCode: builder.mutation<void, { email: string }>({
            query: (credentials) => ({
                url: "users/resend-code",
                method: "POST",
                body: credentials,
            }),
        }),
        forgotPassword: builder.mutation<void, { email: string }>({
            query: (credentials) => ({
                url: "users/forget-password",
                method: "POST",
                body: credentials,
            }),
        }),
        resetPassword: builder.mutation<void, { email: string, code: string, newPassword: string }>({
            query: (credentials) => ({
                url: "users/reset-password",
                method: "POST",
                body: credentials,
            }),
        }),
    })
});

export const { useLoginMutation, useGetProfileQuery, useLogoutMutation, useRegisterUserMutation, useUpdateProfileMutation, useVerifyEmailMutation, useResendCodeMutation, useForgotPasswordMutation, useResetPasswordMutation } = userApi;