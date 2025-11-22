export { default } from "next-auth/middleware";

// Only protect routes that require authentication
// This prevents infinite redirect loops by keeping public routes accessible
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/workflows/:path*",
        "/api/workflows/:path*",
    ],
};
