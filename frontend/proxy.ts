import { NextRequest, NextResponse } from "next/server";

const ADMIN_ROUTES = ["/admin", "/admin/dashboard"];
const CUSTOMER_ROUTES = ["/product", "/carts", "/checkout", "/orders", "/favourites"];
const AUTH_ROUTES = ["/login", "/register", "/forget-password", "/reset-password", "/verify-email"];
const PROTECTED_ROUTES = [...ADMIN_ROUTES, ...CUSTOMER_ROUTES, "/dashboard"];

export function proxy(request: NextRequest) {
    // Cookies se Token aur Role uthayein
    const token = request.cookies.get("token")?.value;
    const role = request.cookies.get("role")?.value;
    const { pathname } = request.nextUrl;
    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

    // 1. Agar user logged in nahi hai aur protected page pe ja raha hai
    if (isProtected && !token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 2. Agar user logged in hai
    if (token) {
        // Login/Register page par jane se rokein
        if (isAuthRoute) {
            const redirectUrl = role === "admin" ? "/admin/dashboard" : "/product";
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
        if (isAdminRoute && role !== "admin") {
            return NextResponse.redirect(new URL("/product", request.url));
        }
        const isCustomerOnly = ["/carts", "/checkout"].some(r => pathname.startsWith(r));
        if (isCustomerOnly && role === "admin") {
            return NextResponse.redirect(new URL("/admin/dashboard", request.url));
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
    ]
}