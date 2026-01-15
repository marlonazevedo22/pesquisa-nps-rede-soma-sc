
import { NextRequest, NextResponse } from 'next/server';

export default function proxy(request: NextRequest) {
  const basicAuth = request.headers.get('authorization');
  const url = request.nextUrl.clone();

  // Protege apenas /admin/dashboard e subrotas
  if (url.pathname === '/admin/dashboard' || url.pathname.startsWith('/admin/dashboard/')) {
    if (!basicAuth) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      });
    }

    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (user !== 'admin' || pwd !== adminPassword) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }
    // Acesso liberado
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard', '/admin/dashboard/:path*'],
};