"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.accessToken);

    useEffect(() => {
        if (token) {
            return;
        }

        const localStorageToken = localStorage.getItem("token");

        if (
            localStorageToken &&
            localStorageToken !== "undefined" &&
            localStorageToken !== "null"
        ) {
            dispatch(setAccessToken(localStorageToken));
        }
    }, [dispatch, token]);

    return <>{children}</>;
}
