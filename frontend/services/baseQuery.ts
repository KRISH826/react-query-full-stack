// import { RootState } from "@/store/store";
// import {fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query/react";

// let isRefreshing = false;

// const rawBaseQuery = fetchBaseQuery({
//     baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
//     credentials: 'include',
//     prepareHeaders: (header, {getState}) => {
//         const state = getState() as RootState;
//         const token = state.auth.accessToken;
//         if(token){
//             header.set('Authorization', `Bearer ${token}`);
//         }
//         return header;
//     }
// })