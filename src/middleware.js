import { clerkMiddleware } from "@clerk/nextjs/server";
export default clerkMiddleware({
  // Public routes that don't require authentication
  publicRoutes: ["/","/api/upgrade-tier"],
  
  // Routes that can be accessed while signed out, but also show user info when signed in
  ignoredRoutes: ["/api/webhook/clerk"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 