import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const path = req.nextUrl.pathname;

    // Protection for /advisor routes
    if (path.startsWith("/advisor") && token?.role !== "advisor" && token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Protection for /admin routes
    if (path.startsWith("/admin") && token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/analysis/:path*', '/history/:path*', '/advisor/:path*', '/admin/:path*', '/profile/:path*'],
};
