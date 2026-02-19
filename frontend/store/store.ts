import { baseApi } from "@/services/baseQuery";
import { configureStore } from "@reduxjs/toolkit";

export const makeStore = () =>
    configureStore({
        reducer: {
            [baseApi.reducerPath]: baseApi.reducer,
        },
        middleware: (gdm) =>
            gdm({ serializableCheck: false }).concat(baseApi.middleware),
    });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
