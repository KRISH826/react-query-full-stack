import { productApi } from "@/services/productApi";
import { configureStore } from "@reduxjs/toolkit";

export const makeStore = () =>
    configureStore({
        reducer: {
            [productApi.reducerPath]: productApi.reducer,
        },
        middleware: (gdm) =>
            gdm({ serializableCheck: false }).concat(productApi.middleware),
    });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
