import { NextRequest, NextResponse } from "next/server";

// ✅ Protected — login required
const PROTECTED_ROUTES = ["/carts", "/checkout", "/orders", "/favourites", "/admin", "/dashboard"]
// ✅ Auth routes — logged in user nahi ja sakta
const AUTH_ROUTES = ["/login", "/register", "/forget-password", "/reset-password", "/verify-email"]

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.replace("Bearer", "")

    const { pathname } = request.nextUrl;
    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

    if (isProtected && !token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/carts/:path*",
        "/checkout/:path*",
        "/dashboard",
        "/orders/:path*",
        "/favourites/:path*",
        "/login",
        "/register",
        "/forget-password",
        "/reset-password",
        "/verify-email",
    ]
}