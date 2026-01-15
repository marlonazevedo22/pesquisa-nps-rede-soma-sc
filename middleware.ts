import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization');
  const url = request.nextUrl.clone();

    if (url.pathname.startsWith('/admin')) {
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

    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

  export const config = {
    matcher: ['/admin', '/admin/:path*'],
};
