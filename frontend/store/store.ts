import { configureStore } from "@reduxjs/toolkit";
import { UserApi } from "@/services/userApi";

export const makeStore = () =>
    configureStore({
        reducer: {
            [UserApi.reducerPath]: UserApi.reducer,
        },
        middleware: (gdm) =>
            gdm({ serializableCheck: false }).concat(UserApi.middleware),
    });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
