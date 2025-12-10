import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/events(.*)',
  '/profile(.*)',
  '/dashboard(.*)',
  '/api/events(.*)',
  '/api/user(.*)'
])

// Define routes that should redirect authenticated users away (e.g., sign-in, sign-up)
const isPublicOnlyRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)'
])

export default clerkMiddleware((auth, req) => {
  const { userId } = auth()
  
  // Redirect authenticated users away from sign-in/sign-up pages
  if (userId && isPublicOnlyRoute(req)) {
    return NextResponse.redirect(new URL('/events', req.url))
  }

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    auth().protect()
  }

  // Allow other routes through
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Apply middleware to all requests except static files and Next.js internals
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
