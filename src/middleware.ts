import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/login'

  if (isAdminRoute || isLoginRoute) {
    try {
      const response = await fetch(new URL('/api/auth/get-session', request.url), {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      })
      
      const session = await response.json().catch(() => null)
      
      const role = session?.user?.role?.toLowerCase()
      const isAdmin = role === "admin" || role === "superadmin"

      // Jika mencoba akses /admin tapi tidak ada sesi atau BUKAN admin
      if (isAdminRoute && (!session || !session.session || !isAdmin)) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      
      // Jika mencoba akses /login tapi sudah login
      if (isLoginRoute && session && session.session) {
        if (isAdmin) {
          return NextResponse.redirect(new URL('/admin', request.url))
        } else {
          return NextResponse.redirect(new URL('/user', request.url))
        }
      }
      
    } catch (error) {
      // Fallback jika error API
      if (isAdminRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
