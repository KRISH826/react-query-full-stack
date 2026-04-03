import { NextRequest, NextResponse } from "next/server";

const ADMIN_ROUTES = ["/admin", "/admin/dashboard"];
const CUSTOMER_ROUTES = ["/product", "/carts", "/checkout", "/orders", "/favourites"];
const AUTH_ROUTES = ["/login", "/register", "/forget-password", "/reset-password", "/verify-email"];
const PROTECTED_ROUTES = [...ADMIN_ROUTES, ...CUSTOMER_ROUTES, "/dashboard"];

export function proxy(request: NextRequest) {

    // 🔥 CHANGE: refreshToken use karo
    const token = request.cookies.get("refreshToken")?.value;
    const role = request.cookies.get("role")?.value;

    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    const isAdminRoute = ADMIN_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    const isAuthRoute = AUTH_ROUTES.some((route) =>
        pathname.startsWith(route)
    );
    if (isProtected && !token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (token) {

        // login page block
        if (isAuthRoute) {
            const redirectUrl =
                role === "admin" ? "/admin/dashboard" : "/product";

            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }

        // admin protection
        if (isAdminRoute && role !== "admin") {
            return NextResponse.redirect(new URL("/product", request.url));
        }

        // customer protection
        const isCustomerOnly = ["/carts", "/checkout"].some((r) =>
            pathname.startsWith(r)
        );

        if (isCustomerOnly && role === "admin") {
            return NextResponse.redirect(
                new URL("/admin/dashboard", request.url)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/product/:path*",
        "/carts/:path*",
        "/checkout/:path*",
        "/dashboard",
        "/orders/:path*",
        "/favourites/:path*",
        "/login",
        "/register",
    ],
};