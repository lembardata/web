import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/sheets",
  "/profile",
  "/settings",
  "/api-keys",
]

// Routes that should redirect to dashboard if user is already authenticated
const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]

export default auth((req: NextRequest & { auth: any }) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isProtectedRoute = protectedRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  )

  // Redirect to login if trying to access protected route without authentication
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin)
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if trying to access auth routes while authenticated
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin))
  }

  // Allow the request to continue
  return NextResponse.next()
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}