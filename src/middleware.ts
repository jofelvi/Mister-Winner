import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Para Firebase Auth, vamos a permitir que el cliente maneje la redirección
  // El middleware solo se ejecutará para rutas estáticas

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/perfil', '/rifas', '/historial'];
  const adminRoutes = ['/admin'];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );
  
  const isAdminRoute = adminRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Solo para rutas protegidas, dejamos que el componente ProtectedRoute maneje la lógica
  if (isProtectedRoute || isAdminRoute) {
    // Permitir que pase y que ProtectedRoute maneje la autenticación
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/perfil/:path*',
    '/rifas/:path*',
    '/historial/:path*',
    '/admin/:path*',
  ],
};
