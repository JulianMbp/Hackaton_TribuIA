import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = ['/dashboard'];

// Public routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/register', '/candidate/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // DESHABILITADO TEMPORALMENTE PARA LOGIN MOCK
  // TODO: Habilitar cuando se conecte con Turso DB

  // Check if the route is protected
  // const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Check if user has token
  // const token = request.cookies.get('token')?.value || '';

  // Redirect to login if accessing protected route without token
  // if (isProtectedRoute && !token) {
  //   const loginUrl = new URL('/auth/login', request.url);
  //   return NextResponse.redirect(loginUrl);
  // }

  // Redirect to dashboard if accessing auth pages with valid token
  // const isAuthRoute = pathname.startsWith('/auth');
  // if (isAuthRoute && token) {
  //   const dashboardUrl = new URL('/dashboard', request.url);
  //   return NextResponse.redirect(dashboardUrl);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
