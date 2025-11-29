import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = {
  empresa: ['/dashboard'],
  candidato: ['/panel-candidato'],
};

// Public routes that don't require authentication
const publicRoutes = ['/auth/login', '/auth/register', '/candidate/register', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // NOTA: El middleware de Next.js se ejecuta en el servidor y no puede acceder a localStorage.
  // La protección de rutas se maneja en el cliente mediante componentes o hooks.
  // Para una protección más robusta en producción, considerar usar cookies httpOnly.

  // Por ahora, permitir todas las rutas y dejar que el cliente maneje la autenticación
  // Las páginas protegidas deben verificar la autenticación usando el AuthContext

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
