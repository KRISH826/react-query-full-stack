"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import type { ReactNode } from "react";
import type { AppStore } from "@/store/store";

let clientStore: AppStore | null = null;

const getStore = () => {
    if (typeof window === "undefined") {
        return makeStore();
    }

    if (clientStore === null) {
        clientStore = makeStore();
    }

    return clientStore;
};

export default function Providers({ children }: { children: ReactNode }) {
    const store = getStore();

    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}
