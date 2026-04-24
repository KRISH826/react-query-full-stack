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

        const token = localStorage.getItem("token");

        if (token && token !== "undefined" && token !== "null") {
            dispatch(setAccessToken(token));
        }
    }, [dispatch, token]);

    return <>{children}</>;
}
