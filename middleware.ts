import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protege apenas /admin
  if (pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization')
    const urlPassword = request.nextUrl.searchParams.get('password')

    const correctPassword = process.env.ADMIN_PASSWORD || 'admin123' // Mude no Vercel

    if (authHeader !== `Bearer ${correctPassword}` && urlPassword !== correctPassword) {
      return new Response('Acesso negado', { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}