"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { useRef } from "react";
import type { ReactNode } from "react";
import type { AppStore } from "@/store/store";

export default function Providers({ children }: { children: ReactNode }) {
    const storeRef = useRef<AppStore | null>(null);

    if (storeRef.current === null) {
        storeRef.current = makeStore();
    }

    return (
        // eslint-disable-next-line react-hooks/rules-of-hooks
        <Provider store={storeRef.current!}>
            {children}
        </Provider>
    );
}
