"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { useRef } from "react";
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
    const storeRef = useRef<AppStore | null>(null);

    if (storeRef.current === null) {
        // Reuse the client store so dev remounts don't restart RTK Query requests.
        storeRef.current = getStore();
    }

    return (
        // eslint-disable-next-line react-hooks/rules-of-hooks
        <Provider store={storeRef.current!}>
            {children}
        </Provider>
    );
}
