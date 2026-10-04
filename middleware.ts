import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/session'

const protectedRoutes = ['/todo', '/admin/users']
const publicRoutes = ['/login']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  
  // Skip middleware for root path
  if (path === '/') {
    return NextResponse.next()
  }
  
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)

  const session = await verifySession()

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Redirect to todo if accessing login page with valid session
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL('/todo', req.nextUrl))
  }

  // Check if accessing admin route but not admin role
  if (path.startsWith('/admin/') && session && session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/todo', req.nextUrl))
  }

  return NextResponse.next()
}

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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}