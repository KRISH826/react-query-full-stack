import { baseApi } from "@/services/baseQuery";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/userSlice";

export const makeStore = () =>
    configureStore({
        reducer: {
            [baseApi.reducerPath]: baseApi.reducer,
            auth: authReducer,
        },
        middleware: (gdm) =>
            gdm({ serializableCheck: false }).concat(baseApi.middleware),
    });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
