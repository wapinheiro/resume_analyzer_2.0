export { default } from "next-auth/middleware";

export const config = {
    // Only runs middleware on specific protected routes
    matcher: ['/dashboard/:path*', '/analysis/:path*', '/history/:path*'],
};
