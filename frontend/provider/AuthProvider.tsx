"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAccessToken } from "@/store/slice/userSlice";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token && token !== "undefined" && token !== "null") {
            dispatch(setAccessToken(token));
        }
    }, [dispatch]);

    return <>{children}</>;
}