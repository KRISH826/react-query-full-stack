import { baseApi } from "./baseQuery";
import { setAccessToken, clearAccessToken } from "@/store/slice/userSlice";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types/user";
import { clearClientAuth, persistClientAuth } from "@/lib/client-auth";

interface EmailRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    code: string;
    newPassword: string;
}

interface VerifyEmailRequest {
    email: string;
    code: string;
}

interface SuccessResponse {
    success: boolean;
    message: string;
}

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: "users/login",
                method: "POST",
                body: credentials,
            }),

            async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    const validToken = data.accessToken;
                    const role = data.user?.role ?? "customer";

                    if (validToken && validToken !== "undefined") {
                        dispatch(setAccessToken(validToken));
                        persistClientAuth(validToken, role);
                    }
                } catch (err) {
                    console.error("Login failed:", err);
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

        logout: builder.mutation<void, void>({
            query: () => ({
                url: "users/logout",
                method: "POST",
            }),

            async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                } catch (err) {
                    console.error("Logout request failed:", err);
                } finally {
                    dispatch(clearAccessToken());
                    clearClientAuth();

                    window.location.href = "/login";
                }
            },
        }),

        updateProfile: builder.mutation<User, FormData | Partial<User>>({
            query: (data) => ({
                url: "users/profile",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: [{ type: "User", id: "PROFILE" }],
        }),
        resendVerificationMail: builder.mutation<SuccessResponse, EmailRequest>({
            query: (data) => ({
                url: "users/resend-mail",
                method: "POST",
                body: data,
            }),
        }),

        verifyEmail: builder.mutation<SuccessResponse, VerifyEmailRequest>({
            query: (data) => ({
                url: "users/verify-email",
                method: "POST",
                body: data,
            }),
        }),

        forgetPassword: builder.mutation<SuccessResponse, EmailRequest>({
            query: (data) => ({
                url: "users/forget-password",
                method: "POST",
                body: data,
            }),
        }),

        resetPassword: builder.mutation<SuccessResponse, ResetPasswordRequest>({
            query: (data) => ({
                url: "users/reset-password",
                method: "POST",
                body: data,
            }),
        }),

    }),
});

export const {
    useLoginMutation,
    useRegisterUserMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useLogoutMutation,
    useVerifyEmailMutation,
    useResendVerificationMailMutation,
    useForgetPasswordMutation,
    useResetPasswordMutation,
} = userApi;
