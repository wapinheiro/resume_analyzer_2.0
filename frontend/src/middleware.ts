import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Route protection
        if (path.startsWith("/advisor") && token?.role !== "advisor" && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
        if (path.startsWith("/admin") && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Smart redirects away from student landing page tailored by role
        if (path === "/" && token) {
            if (token.role === "admin") return NextResponse.redirect(new URL("/admin", req.url));
            if (token.role === "advisor") return NextResponse.redirect(new URL("/advisor/dashboard", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ['/', '/dashboard/:path*', '/analysis/:path*', '/history/:path*', '/advisor/:path*', '/admin/:path*'],
};
