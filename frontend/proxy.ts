import { NextRequest, NextResponse } from "next/server";


// 1. Define Routes Correctly
const ADMIN_ROUTES = ["/admin", "/admin/dashboard"];
const CUSTOMER_ROUTES = ["/carts", "/checkout", "/orders", "/favourites", "/profile"];
const AUTH_ROUTES = ["/login", "/register", "/forget-password", "/reset-password", "/verify-email"];

const PROTECTED_ROUTES = [...ADMIN_ROUTES, ...CUSTOMER_ROUTES, "/dashboard"];

export function proxy(request: NextRequest) {

    const role = request.cookies.get("role")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

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
    const isLoggedIn = role || refreshToken;

    if (isProtected && !isLoggedIn) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute && role !== "admin") {
        return NextResponse.redirect(new URL("/product", request.url));
    }

    const isCustomerOnly = ["/carts", "/checkout", "/orders"].some((r) =>
        pathname.startsWith(r)
    );

    if (isCustomerOnly && role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
}

// matcher
export const config = {
    matcher: [
        "/admin/:path*",
        "/carts/:path*",
        "/checkout/:path*",
        "/dashboard",
        "/orders/:path*",
        "/favourites/:path*",
        "/profile/:path*", // Added profile here
        "/login",
        "/register",
        // 🔥 Removed "/product/:path*" from matcher. Ab middleware product pages par run hi nahi hoga, making it super fast!
    ],
};