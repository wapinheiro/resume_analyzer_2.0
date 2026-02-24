import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAdvisorRoute = req.nextUrl.pathname.startsWith("/advisor");

        // If trying to access an advisor route but not an advisor/admin
        if (isAdvisorRoute && token?.role !== "advisor" && token?.role !== "admin") {
            // Redirect to a Not Authorized page or the homepage
            return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token, // Standard login check
        },
    }
);

export const config = {
    // Only runs middleware on specific protected routes
    matcher: ['/dashboard/:path*', '/analysis/:path*', '/history/:path*', '/advisor/:path*'],
};
