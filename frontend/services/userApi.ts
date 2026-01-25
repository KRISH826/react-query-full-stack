import { User } from "@/types/user"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const UserApi = createApi({
    reducerPath: 'useApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => 'users',
            transformResponse: (response: { users: User[] }) => response.users,
            providesTags: ["User"]
        }),
        createUser: builder.mutation({
            query: (newPost: User) => ({
                url: 'users',
                method: 'POST',
                body: newPost
            }),
            invalidatesTags: ["User"]
        }),
        getUserById: builder.query({
            query: (id: number) => `users/${id}`,
            providesTags: ["User"]
        })
    })
})

export const { useGetUsersQuery, useGetUserByIdQuery, useCreateUserMutation } = UserApi